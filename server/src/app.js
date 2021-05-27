const express = require('express');
const loaders = require('./loaders');

const port = process.argv[2];


async function startServer() {

    const app = express();

    await loaders({ expressApp: app });
    
    
    app.listen(port, function(){
        console.log(`Listening on port ${port}...`);
    });
}

startServer();

