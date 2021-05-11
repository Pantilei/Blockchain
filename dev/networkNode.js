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
    console.log(req);
    const {amount, sender, recipient} = req.body;
    const blockIndex = bitcoin.createNewTransaction(amount, sender, recipient);
    return res.json({note: `Trasaction will be added into a block ${blockIndex}`})
});

/**
 * Fetching this endpoind will mine the new block with data of current pending transactions.
 */
app.get('/mine', function(req, res) {
    const lastBlock = bitcoin.getLastBlock();
    const lastBlockHash = lastBlock.hash;
    const currentBlockData = {
        transactions: bitcoin.pendingTransactions,
        index: lastBlock.index + 1
    }
    const blockHash = bitcoin.hashBlock(lastBlockHash, currentBlockData);
    const nonce = bitcoin.proofOfWork(lastBlockHash, blockHash);
    // Reward whoever mined the block
    bitcoin.createNewTransaction(12.5, "00", nodeAddress);
    // Create new block
    const newBlock = bitcoin.createNewBlock(nonce, lastBlockHash, blockHash);

    return res.json({
        note: "New block mined successfully",
        block: newBlock
    });
});

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

app.listen(port, function(){
    console.log(`Listening on port ${port}...`);
});
