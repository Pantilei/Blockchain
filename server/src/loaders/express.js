const express = require('express');
const cors = require('cors');

const rootRouter = require('../api');



module.exports = async function({app}) {
    app.use(cors());

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));


    app.use('/', rootRouter);

    return app
}