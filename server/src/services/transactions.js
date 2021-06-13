const bitcoin = require('../services/bitcoin');
const nodeAddress = require('../services/nodeAddress');
const fetch = require('node-fetch');


const createTransaction = function(newTransaction) {
    const blockIndex = bitcoin.addTransactionToPendingTransactions(newTransaction);

    return res.json({note: `Transaction will be added to node ${blockIndex}.`});
}

const broadcastTransaction = async function(amount, sender, recipient) {
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
        console.log("newTransaction: ", newTransaction);

        return Promise.resolve({note: 'Transaction created and broadcast successefully'})
    } catch (error) {
        return Promise.resolve({error});
    }
}

const getTransaction = function(transactionId) {

     return bitcoin.getTransaction(transactionId);
}

module.exports = {
    createTransaction,
    broadcastTransaction,
    getTransaction
}