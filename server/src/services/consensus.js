const bitcoin = require('../services/bitcoin');
const nodeAddress = require('../services/nodeAddress');
const fetch = require('node-fetch');


const blockchainConsensus = async function() {
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
        return Promise.resolve({
            note: "Current chain has not been replaced",
            chain: bitcoin.chain
        });
    }
    bitcoin.chain = newLongestChain;
    bitcoin.pendingTransactions = newPendingTransactions;

    return Promise.resolve({
        note: "This chain has been replaced",
        chain: bitcoin.chain
    })
}

module.exports = blockchainConsensus;