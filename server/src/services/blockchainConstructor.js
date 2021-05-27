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

Blockchain.prototype.getBlock = function(blockHash) {
    const filteredBlock = this.chain.filter(block => block.hash === blockHash);

    return filteredBlock.length ? filteredBlock[0] : null
}

Blockchain.prototype.getTransaction = function(transactionId) {
    return this.chain.reduce((acc, block) => {
        let transaction = block.transactions.find(trans => trans.transactionId === transactionId);
        if (transaction) {
            acc = {transaction, block};
        }
        return acc
    }, {
        transaction: null,
        block: null
    });
}

Blockchain.prototype.getAddressData = function(address) {
    // Get all transaction data of address
    const addressData = this.chain.reduce((acc, block) => {
        // Get transactions of address in current block if any
        const blockAddressTransactions = block.transactions.filter(trans => trans.sender === address || trans.recipient === address);
        // Calculate the balance of address in current block
        const blockAddressBalance = blockAddressTransactions.reduce((a, blockAddressTransaction) => {
            if (blockAddressTransaction.sender == address){
                a -= blockAddressTransaction.amount;
            } else if (blockAddressTransaction.recipient == address) {
                a += blockAddressTransaction.amount
            }
            return a
        }, 0)
        // Update and return the balance and transactions data of address
        return {
            addressTransactions: [...acc.addressTransactions, ...blockAddressTransactions],
            addressBalance: acc.addressBalance + blockAddressBalance
        }
    }, {
        addressTransactions: [],
        addressBalance: 0
    });

    return addressData;
}

module.exports = Blockchain;