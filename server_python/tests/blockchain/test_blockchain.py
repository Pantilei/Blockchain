from server_python.tests.blockchain.test_block import block
import pytest
from server_python.blockchain.blockchain import Blockchain
from server_python.blockchain.block import Block, GENESIS_DATA


def test_blockchain_instance():
    blockchain = Blockchain()

    assert blockchain.chain[0].hash == GENESIS_DATA['hash']


def test_add_block():
    blockchain = Blockchain()
    data = "block data"

    blockchain.add_block(data)
    # Asser block with correct data is added
    assert blockchain.chain[-1].data == data


@pytest.fixture
def blockchain_tree_blocks():
    blockchain = Blockchain()

    for i in range(3):
        blockchain.add_block(i)

    return blockchain


def test_is_valid_chain(blockchain_tree_blocks: 'Blockchain'):
    Blockchain.is_valid_chain(blockchain_tree_blocks.chain)


def test_is_valid_chain_bad_genesis(blockchain_tree_blocks: 'Blockchain'):
    blockchain_tree_blocks.chain[0].hash = 'evil_hash'

    with pytest.raises(Exception, match="The genesis block must be valid!"):
        Blockchain.is_valid_chain(blockchain_tree_blocks.chain)


def test_replace_chain(blockchain_tree_blocks: 'Blockchain'):

    blockchain = Blockchain()
    blockchain.replace_chain(blockchain_tree_blocks.chain)

    assert blockchain.chain == blockchain_tree_blocks.chain


def test_replace_chain_not_longer(blockchain_tree_blocks: 'Blockchain'):
    blockchain = Blockchain()

    with pytest.raises(Exception, match="The incomming chain must be longer! Cannot replace."):
        blockchain_tree_blocks.replace_chain(blockchain.chain)


def test_raplace_chain_bad_chain(blockchain_tree_blocks: 'Blockchain'):

    blockchain = Blockchain()
    blockchain_tree_blocks.chain[1].hash = "bad_hash"
    with pytest.raises(Exception, match=f"Cannot replace, the incomming chain is invalid"):
        blockchain.replace_chain(blockchain_tree_blocks.chain)
