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

Blockchain.prototype.chainIsValid = function(blockchain) {

    for (let i=1; i<blockchain.length; i++){
        let currentBlock = blockchain[i];
        let previousBlock = blockchain[i-1];
        // Check if block has correct previous block hash
        if (previousBlock.hash !== currentBlock.previousBlockHash) {
            return false;
        }
        // Check if block has proper difficulty hash
        let blockHash = this.hashBlock(
            previousBlock.hash, 
            {
                transactions: currentBlock.transactions,
                index: currentBlock.index   
            },
            currentBlock.nonce
        );
        if (blockHash.substring(0, 4) !== "0000"){
            return false;
        }
        // Check if hashes are same
        if (blockHash !== currentBlock.hash){
            return false
        }
    }

    // Check validity of Genesis block
    const genesisBlock = blockchain[0];
    const correctNonce = genesisBlock.nonce === 100;
    const correctPreviousBlockHash = genesisBlock.previousBlockHash === "0";
    const correctHash = genesisBlock.hash === "0";
    const correctTransactions = genesisBlock.transactions.length === 0;
    if (!correctNonce || !correctPreviousBlockHash || !correctHash || !correctTransactions) {
        return false;
    }

    return true;
}


module.exports = Blockchain;