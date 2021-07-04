from server_python.config import RABBITMQ_URL
from fastapi import FastAPI
from server_python.blockchain.blockchain import Blockchain
from server_python.pubsub import PubSub


app: FastAPI = FastAPI()
blockchain: Blockchain = Blockchain()
pub_sub: PubSub = PubSub(RABBITMQ_URL + '/%2F', 'block')


@app.on_event('startup')
async def startup() -> None:
    """Create and listen the channel queue
    """
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
async def route_blockchain_mine():
    trasaction_data = 'stubbed_transactions'
    blockchain.add_block(trasaction_data)
    block = blockchain.chain[-1]
    await pub_sub.broadcast_block(block)

    return block.to_json()
