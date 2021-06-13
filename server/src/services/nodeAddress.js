const uuid = require('uuid/v1');

const nodeAddress = uuid().split('-').join('');

module.exports = nodeAddress;
