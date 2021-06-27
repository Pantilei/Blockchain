from fastapi import FastAPI
from random import randint
from server_python.blockchain.blockchain import Blockchain
from server_python.pubsub import PubSub

PORT = randint(5000, 6000)

app = FastAPI()
blockchain = Blockchain()
pub_sub = PubSub('amqp://guest:guest@localhost:5672/%2F', 'block')


@app.on_event('startup')
async def startup():
    await pub_sub.listen()


@app.get('/')
async def route_root():
    await pub_sub.publish(b'Hello test!')
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
