from fastapi import FastAPI
from server_python.blockchain.blockchain import Blockchain


app = FastAPI()
blockchain = Blockchain()


@app.get('/')
async def route_root():
    return {
        'data': "Hello Darling!"
    }


@app.get('/blockchain')
async def route_blockchain():
    return blockchain.to_json()


@app.get('/blockchain/mine')
def route_blockchain_mine():
    trasaction_data = 'stubbed_transactions'
    blockchain.add_block(trasaction_data)

    return blockchain.chain[-1].to_json()
