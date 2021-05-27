const bitcoin = require('../services/bitcoin');
const nodeAddress = require('../services/nodeAddress');

const getAddressData = function(address) {
    return bitcoin.getAddressData(address);
}

module.exports = {
    getAddressData
}