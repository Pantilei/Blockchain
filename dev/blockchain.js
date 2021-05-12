const sha256 = require('sha256');
const uuid = require('uuid/v1');

const currentNodeUrl = process.argv[3];


function Blockchain() {
    this.chain = [];
    this.pendingTransactions = [];
    this.currentNodeUrl = currentNodeUrl;
    this.networkNodes = [];
    // Create a Genesis block
    this.createNewBlock(100, '0', '0');
}

Blockchain.prototype.createNewBlock = function(nonce, previousBlockHash, hash) {
    const Block = {
        index: this.chain.length+1,
        timestap: Date.now(),
        transactions: this.pendingTransactions,
        nonce: nonce,
        hash: hash,
        previousBlockHash: previousBlockHash
    };

    this.pendingTransactions = []
    this.chain.push(Block);

    return Block;
}


Blockchain.prototype.getLastBlock = function() {
    return this.chain[this.chain.length - 1];
}

Blockchain.prototype.createNewTransaction = function(amount, sender, recipient) {
    const newTransaction = { amount, sender, recipient, transactionId: uuid().split('-').join('') };

    return newTransaction;
}

Blockchain.prototype.addTransactionToPendingTransactions = function(transactionObj) {
    this.pendingTransactions.push(transactionObj);
    // Return the block to which transaction will be added
    return this.getLastBlock()['index'] + 1;
}

Blockchain.prototype.hashBlock = function(previousBlockHash, currentBlockData, nonce) {
    const dataAsString = `${previousBlockHash}${nonce.toString()}${JSON.stringify(currentBlockData)}`;
    const hash = sha256(dataAsString);

    return hash;
}

Blockchain.prototype.proofOfWork = function(previousBlockHash, currentBlockData) {
    let nonce = 0;
    let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);

    while(hash.substring(0,4) !== "0000") {
        nonce++;
        hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    }

    return nonce;
}
module.exports = Blockchain;