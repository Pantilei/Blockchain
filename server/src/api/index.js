const express = require('express');

const rootRouter = express.Router();

rootRouter.use('/', require('./blockchain'));
rootRouter.use('/', require('./consensus'));
rootRouter.use('/', require('./mine'));
rootRouter.use('/', require('./node'));
rootRouter.use('/', require('./transactions'));

module.exports = rootRouter;