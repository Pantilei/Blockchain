const bitcoin = require('../services/bitcoin');
const nodeAddress = require('../services/nodeAddress');

const getBlock = function(blockHash) {
    return bitcoin.getBlock(blockHash);
}

module.exports = {
    getBlock
}