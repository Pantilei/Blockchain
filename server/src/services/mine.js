const bitcoin = require('../services/bitcoin');
const nodeAddress = require('../services/nodeAddress');
const fetch = require('node-fetch');


const mineBlock = async function() {
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

        return Promise.resolve({
            note: "New block mined & broadcast successfully",
            block: newBlock
        });
    } catch (error) {
        console.log(error);
        return Promise.resolve({error})
    }
}

const recieveNewBlock = function(newBlock) {
    const lastBlock = bitcoin.getLastBlock();
    const correctHash = lastBlock.hash === newBlock.previousBlockHash;
    const correctIndex = lastBlock.index + 1 === newBlock.index;
    if (correctHash && correctIndex) {
        bitcoin.chain.push(newBlock);
        bitcoin.pendingTransactions = [];
        return {
            note: "New block received and accepted.",
            newBlock
        };
    }

    return {
        note: "New block rejected",
        newBlock
    };
}


module.exports = {
    mineBlock,
    recieveNewBlock
}