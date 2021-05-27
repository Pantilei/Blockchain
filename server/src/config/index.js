const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    port: process.env.PORT,
    // databaseURL: process.env.DATABASE_URI,
    // paypal: {
    //     publicKey: process.env.PAYPAL_PUBLIC_KEY,
    //     secretKey: process.env.PAYPAL_SECRET_KEY,
    // },
}