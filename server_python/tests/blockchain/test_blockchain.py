from server_python.blockchain.blockchain import Blockchain
from server_python.blockchain.block import GENESIS_DATA


def test_blockchain_instance():
    blockchain = Blockchain()

    assert blockchain.chain[0].hash == GENESIS_DATA['hash']


def test_add_block():
    blockchain = Blockchain()
    data = "block data"

    blockchain.add_block(data)
    # Asser block with correct data is added
    assert blockchain.chain[-1].data == data
