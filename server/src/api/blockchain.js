const express = require('express');
const { getBlock } = require('../services/block');
const { getAddressData } = require('../services/address');
const bitcoin = require('../services/bitcoin');

const router = express.Router();

router.get('/blockchain', function(req, res){
    return res.json(bitcoin);
});


router.get('/block/:blockHash', function(req, res) {
    const blockHash = req.params.blockHash;
    const block = getBlock(blockHash);

    return res.json({block});
});


router.get('/address/:address', function(req, res){
    const address = req.params.address;
    const addressData = getAddressData(address);

    return res.json({addressData})
});

module.exports = router;
