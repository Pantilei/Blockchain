const express = require('express');
const blockchainConsensus = require('../services/consensus');


const router = express.Router();


router.get('/consensus', async function(req, res) {
    
    return res.json(await blockchainConsensus());
});


module.exports = router;
