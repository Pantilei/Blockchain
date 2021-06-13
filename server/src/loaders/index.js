const expressLoader = require('./express');


module.exports = async function({ expressApp }) {

    // Here load all: mongoose, database, redis
    await expressLoader({app: expressApp});
}