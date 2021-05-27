const express = require('express');
const { getTransaction } = require('../services/transactions');
const { createTransaction, broadcastTransaction } = require('../services/transactions');

const router = express.Router();

router.post('/transaction', function(req, res) {
    const newTransaction = req.body;
    
    return res.json(createTransaction(newTransaction));
});

router.post('/transaction/broadcast', async function(req, res) {
    const {amount, sender, recipient} = req.body;
    const result = await broadcastTransaction(amount, sender, recipient);

    return res.json(result)
});

router.get('/transaction/:transactionId', function(req, res) {
    const transactionId = req.params.transactionId;
    const transactionData = getTransaction(transactionId);

    return res.json(transactionData);
});

module.exports = router;
