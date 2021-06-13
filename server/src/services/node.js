const bitcoin = require('../services/bitcoin');
const nodeAddress = require('../services/nodeAddress');
const fetch = require('node-fetch');


const registerAndBroadcastNode = async function (newNodeUrl) {

    if (bitcoin.networkNodes.indexOf(newNodeUrl) === -1) {
        bitcoin.networkNodes.push(newNodeUrl);
    }
    try {
        // Broadcast to all network the new node url
        await Promise.all(bitcoin.networkNodes.map(networkNodeUrl => {
            return fetch(`${networkNodeUrl}/register-node`,{
                method: 'POST',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({newNodeUrl})
            });
        }));
        // Register all node urls in new created node.
        await fetch(`${newNodeUrl}/register-nodes-bulk`, {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({allNetworkNodes: [...bitcoin.networkNodes, bitcoin.currentNodeUrl]})
        });

        return Promise.resolve({ note: 'New node registered successefully!' });
    } catch (error) {
        return Promise.resolve({ note: error });
    }
}

const registerNodeBulk = function(allNetworkNodes) {
    allNetworkNodes.forEach((networkNodeUrl) => {
        if (bitcoin.networkNodes.indexOf(networkNodeUrl) === -1 && bitcoin.currentNodeUrl !== networkNodeUrl) {
            bitcoin.networkNodes.push(networkNodeUrl);
        }
    });

    return {note: 'Bulk registration successeful!'}
}

const registerNode = function(newNodeUrl) {
    // Don't add the new node url if it is already present in network or it is current node url
    if ((bitcoin.networkNodes.indexOf(newNodeUrl) === -1) && (newNodeUrl !== bitcoin.currentNodeUrl)) {
        bitcoin.networkNodes.push(newNodeUrl);

        return {note: 'New node registered successeffuly'};
    }
    return {note: 'Node present in network'};
}

module.exports = {
    registerAndBroadcastNode,
    registerNodeBulk,
    registerNode
}