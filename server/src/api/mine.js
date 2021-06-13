const express = require('express');
const { mineBlock, recieveNewBlock } = require('../services/mine');

const router = express.Router();

router.get('/mine', async function(req, res) {
    return res.json(await mineBlock())
});

router.post('/receive-new-block', function(req, res) {
    const {newBlock} = req.body;

    return res.json(recieveNewBlock(newBlock));
})


module.exports = router;
