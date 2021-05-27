const express = require('express');
const { registerAndBroadcastNode, registerNodeBulk, registerNode } = require('../services/node');


const router = express.Router();


router.post('/register-and-broadcast-node', async function(req, res){
    const newNodeUrl = req.body.newNodeUrl;
    
    return res.json(await registerAndBroadcastNode(newNodeUrl));
});

/**
 * Register new node in current network
 */
router.post('/register-node', function(req, res){
    const newNodeUrl = req.body.newNodeUrl;

    return res.json(registerNode(newNodeUrl));
});

/**
 * Register in bulk the node urls in network
 */
router.post('/register-nodes-bulk', function(req, res){
    const allNetworkNodes = req.body.allNetworkNodes;

    return res.json(registerNodeBulk(allNetworkNodes))
});


module.exports = router;
