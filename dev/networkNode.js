const express = require('express');
const uuid = require('uuid/v1');
const fetch = require('node-fetch');
const Blockchain = require("./blockchain");

const port = process.argv[2];


const bitcoin = new Blockchain();
const nodeAddress = uuid().split('-').join('');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }))


app.get('/blockchain', function(req, res){
    return res.json(bitcoin);
});

app.post('/transaction', function(req, res) {
    const newTransaction = req.body;
    const blockIndex = bitcoin.addTransactionToPendingTransactions(newTransaction);

    return res.json({note: `Transaction will be added to node ${blockIndex}.`});
});

app.post('/transaction/broadcast', async function(req, res) {
    const {amount, sender, recipient} = req.body;

    try {
        // Add new transaction to current node
        const newTransaction = bitcoin.createNewTransaction(amount, sender, recipient);
        bitcoin.addTransactionToPendingTransactions(newTransaction);
        // Broadcast new trasaction to all newtwork nodes
        await Promise.all(bitcoin.networkNodes.map(networkNodeUrl => {
            return fetch(`${networkNodeUrl}/transaction`, {
                method: 'POST',
                headers: {'Content-type': 'application/json'},
                body: JSON.stringify(newTransaction)
            });
        }));

        return res.json({note: 'Transaction created and broadcast successefully'})
    } catch (error) {
        console.log(error);
    }
    
});

/**
 * Fetching this endpoint will mine the new block with data of current pending transactions.
 */
app.get('/mine', async function(req, res) {
    const lastBlock = bitcoin.getLastBlock();
    const lastBlockHash = lastBlock.hash;
    const currentBlockData = {
        transactions: bitcoin.pendingTransactions,
        index: lastBlock.index + 1
    }
    const nonce = bitcoin.proofOfWork(lastBlockHash, currentBlockData);
    const blockHash = bitcoin.hashBlock(lastBlockHash, currentBlockData, nonce);
    // Create new block
    const newBlock = bitcoin.createNewBlock(nonce, lastBlockHash, blockHash);

    try {
        // Broadcast newly created block to whole network
        await Promise.all(bitcoin.networkNodes.map(networkNodeUrl => {
            return fetch(`${networkNodeUrl}/receive-new-block`, {
                method: "POST",
                headers: {'Content-type': 'application/json'},
                body: JSON.stringify({newBlock})
            });
        }));
        // Create new pending transaction to reward whoever mined the block
        await fetch(`${bitcoin.currentNodeUrl}/transaction/broadcast`, {
            method: "POST",
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({amount: 12.5, sender: "00", recipient: nodeAddress})
        });

        return res.json({
            note: "New block mined & broadcast successfully",
            block: newBlock
        });
    } catch (error) {
        console.log(error);
        return res.json({error})
    }
});

app.post('/receive-new-block', function(req, res) {
    const {newBlock} = req.body;
    const lastBlock = bitcoin.getLastBlock();
    const correctHash = lastBlock.hash === newBlock.previousBlockHash;
    const correctIndex = lastBlock.index + 1 === newBlock.index;
    if (correctHash && correctIndex) {
        bitcoin.chain.push(newBlock);
        bitcoin.pendingTransactions = [];
        return res.json({
            note: "New block received and accepted.",
            newBlock
        });
    }

    return res.json({
        note: "New block rejected",
        newBlock
    });
})

/**
 * Register the node in network by broadcasting the new node to all nodes in network.
 */
app.post('/register-and-broadcast-node', async function(req, res){
    const newNodeUrl = req.body.newNodeUrl;
    if (bitcoin.networkNodes.indexOf(newNodeUrl) === -1) {
        bitcoin.networkNodes.push(newNodeUrl);
    }
    try {
        // Broadcast to all network the new node url
        await Promise.all(bitcoin.networkNodes.map(networkNodeUrl => {
            return fetch(`${networkNodeUrl}/register-node`,{
                method: 'POST',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({newNodeUrl})
            });
        }));
        // Register all node urls in new created node.
        await fetch(`${newNodeUrl}/register-nodes-bulk`, {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({allNetworkNodes: [...bitcoin.networkNodes, bitcoin.currentNodeUrl]})
        });

        return res.json({ note: 'New node registered successefully!' });
    } catch (error) {
        console.log({error});
    }

});

/**
 * Register new node in current network
 */
app.post('/register-node', function(req, res){
    const newNodeUrl = req.body.newNodeUrl;
    // Don't add the new node url if it is already present in network or it is current node url
    if ((bitcoin.networkNodes.indexOf(newNodeUrl) === -1) && (newNodeUrl !== bitcoin.currentNodeUrl)) {
        bitcoin.networkNodes.push(newNodeUrl);

        return res.json({note: 'New node registered successeffuly'});
    }
    return res.json({note: 'Node present in network'});
});

/**
 * Register in bulk the node urls in network
 */
app.post('/register-nodes-bulk', function(req, res){
    const allNetworkNodes = req.body.allNetworkNodes;
    allNetworkNodes.forEach((networkNodeUrl) => {
        if (bitcoin.networkNodes.indexOf(networkNodeUrl) === -1 && bitcoin.currentNodeUrl !== networkNodeUrl) {
            bitcoin.networkNodes.push(networkNodeUrl);
        }
    });

    return res.json({note: 'Bulk registration successeful!'})
});

/**
 * Consensus endpoint to update chain and pending transactions in current network
 */
app.get('/consensus', async function(req, res) {
    
    const blockchains = await Promise.all(bitcoin.networkNodes.map(networkNodeUrl => {
        return fetch(`${networkNodeUrl}/blockchain`, {
            method: "GET"
        })
        .then(r => r.json());
    }));
    const currentChainLength = bitcoin.chain.length;
    let maxChainLength = currentChainLength;
    let newLongestChain = null;
    let newPendingTransactions = null;
    blockchains.forEach(blockchain => {
        if (blockchain.chain.length > maxChainLength) {
            maxChainLength = blockchain.chain.length;
            newLongestChain = blockchain.chain;
            newPendingTransactions = blockchain.pendingTransactions;
        };
    });
    if (!newLongestChain || (newLongestChain && !bitcoin.chainIsValid(newLongestChain))){
        return res.json({
            note: "Current chain has not been replaced",
            chain: bitcoin.chain
        });
    }
    bitcoin.chain = newLongestChain;
    bitcoin.pendingTransactions = newPendingTransactions;
    
    return res.json({
        note: "This chain has been replaced",
        chain: bitcoin.chain
    });
});

app.get('/block/:blockHash', function(req, res) {
    const blockHash = req.params.blockHash;
    const block = bitcoin.getBlock(blockHash);

    return res.json({block});
});

app.get('/transaction/:transactionId', function(req, res) {
    const transactionId = req.params.transactionId;
    const transactionData = bitcoin.getTransaction(transactionId);

    return res.json(transactionData);
});

app.get('/address/:address', function(req, res){
    const address = req.params.address;
    const addressData = bitcoin.getAddressData(address);

    return res.json({addressData})
});

app.listen(port, function(){
    console.log(`Listening on port ${port}...`);
});
