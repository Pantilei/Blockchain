from server_python.app.schemas.trasaction import TransactionSchema
import aiohttp
import sys
from server_python.config import RABBITMQ_URL
from fastapi import FastAPI
from server_python.blockchain.blockchain import Blockchain
from server_python.pubsub import PubSub
from server_python.wallet.transaction import Transaction
from server_python.wallet.wallet import Wallet

ROOT_PORT = 5000
PORT: int = int(sys.argv[1] if len(sys.argv) > 1 else 5000)

app: FastAPI = FastAPI()
blockchain: Blockchain = Blockchain()
wallet: Wallet = Wallet()

pub_sub: PubSub = PubSub(RABBITMQ_URL + '/%2F', 'block', blockchain)


@app.on_event('startup')
async def get_and_update_local_chain():
    if PORT == ROOT_PORT:
        return
    async with aiohttp.ClientSession() as session:
        async with session.get(f'http://localhost:{ROOT_PORT}/blockchain') as response:
            result = await response.json()
            result_blockchain = Blockchain.from_dict(result)
            try:
                blockchain.replace_chain(result_blockchain.chain)
                print(f"\n Successfully syncronized the localchain!")
            except Exception as ex:
                print(f"\n Error synchronizing: {ex}")


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
    return blockchain.to_dict()


@app.get('/blockchain/mine')
async def route_blockchain_mine():
    trasaction_data = 'stubbed_transactions'
    blockchain.add_block(trasaction_data)
    block = blockchain.chain[-1]
    await pub_sub.broadcast_block(block)

    return block.to_dict()


@app.post('/wallet/transact')
async def route_wallet_transaction(transaction_body: TransactionSchema):
    transaction: Transaction = Transaction(
        wallet, transaction_body.recipient, transaction_body.amount)

    return transaction.to_dict()
