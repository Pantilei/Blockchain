const Blockchain = require('./blockchain');

const bitcoin = new Blockchain();


const bc1 = {
    "chain": [
    { 
    "index": 1,
    "timestap": 1620849797463,
    "transactions": [],
    "nonce": 100,
    "hash": "0",
    "previousBlockHash": "0"
    },
    {
    "index": 2,
    "timestap": 1620850312998,
    "transactions": [],
    "nonce": 18140,
    "hash": "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100",
    "previousBlockHash": "0"
    },
    {
    "index": 3,
    "timestap": 1620850327364,
    "transactions": [
    {
    "amount": 12.5,
    "sender": "00",
    "recipient": "17a01670b35d11eb913e77533c2c4d87",
    "transactionId": "4aeb1470b35e11eb913e77533c2c4d87"
    }
    ],
    "nonce": 116786,
    "hash": "00008394f50a915d39cdf9f91fb7899e828eeaa75caea488c59457c96622c5e4",
    "previousBlockHash": "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100"
    },
    {
    "index": 4,
    "timestap": 1620850392947,
    "transactions": [
    {
    "amount": 12.5,
    "sender": "00",
    "recipient": "17a01670b35d11eb913e77533c2c4d87",
    "transactionId": "5378b750b35e11eb913e77533c2c4d87"
    },
    {
    "amount": 300,
    "sender": "ADFGDFASDANPSDJFASIFDJ",
    "recipient": "RECAVSRTGSACVASERTGAE",
    "transactionId": "6e23cdb0b35e11eb913e77533c2c4d87"
    },
    {
    "amount": 100,
    "sender": "ADFGDFASDANPSDJFASIFDJ",
    "recipient": "RECAVSRTGSACVASERTGAE",
    "transactionId": "73107c10b35e11eb913e77533c2c4d87"
    }
    ],
    "nonce": 120112,
    "hash": "0000f1b65b8368bbecf323590d265af9124a224a15837332799f5a5ba38133b8",
    "previousBlockHash": "00008394f50a915d39cdf9f91fb7899e828eeaa75caea488c59457c96622c5e4"
    }
    ],
    "pendingTransactions": [
    {
    "amount": 12.5,
    "sender": "00",
    "recipient": "17a01670b35d11eb913e77533c2c4d87",
    "transactionId": "7a8fe340b35e11eb913e77533c2c4d87"
    }
    ],
    "currentNodeUrl": "http://localhost:3001",
    "networkNodes": []
    }

console.log("VALID: ", bitcoin.chainIsValid(bc1.chain));