const express = require('express');
const uuid = require('uuid/v1');
const Blockchain = require("./blockchain");


const bitcoin = new Blockchain();
const nodeAddress = uuid().split('-').join('');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }))


app.get('/blockchain', function(req, res){
    return res.json(bitcoin);
});

app.post('/transaction', function(req, res) {
    console.log(req);
    const {amount, sender, recipient} = req.body;
    const blockIndex = bitcoin.createNewTransaction(amount, sender, recipient);
    return res.json({note: `Trasaction will be added into a block ${blockIndex}`})
});

app.get('/mine', function(req, res) {
    const lastBlock = bitcoin.getLastBlock();
    const lastBlockHash = lastBlock.hash;
    const currentBlockData = {
        transactions: bitcoin.pendingTransactions,
        index: lastBlock.index + 1
    }
    const blockHash = bitcoin.hashBlock(lastBlockHash, currentBlockData);
    const nonce = bitcoin.proofOfWork(lastBlockHash, blockHash);
    // Reward whoever mined the block
    bitcoin.createNewTransaction(12.5, "00", nodeAddress);
    // Create new block
    const newBlock = bitcoin.createNewBlock(nonce, lastBlockHash, blockHash);

    return res.json({
        note: "New block mined successfully",
        block: newBlock
    });
});


app.listen(3000, function(){
    console.log("Listening on port 3000...");
});
