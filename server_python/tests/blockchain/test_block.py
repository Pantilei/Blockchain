import time
from server_python.blockchain.block import Block, GENESIS_DATA
from server_python.config import MINE_RATE, SECONDS
from server_python.util.hex_to_binary import hex_to_binary


def test_mine_block():
    last_block = Block.genesis()
    data = 'test-data'
    block = Block.mine_block(last_block, data)
    # Ensure that block is instance of Block class
    assert isinstance(block, Block)
    # Check if block contains correct data
    assert block.data == "test-data"
    assert block.last_hash == last_block.hash
    assert hex_to_binary(block.hash)[
        0:block.difficulty] == '0'*block.difficulty


def test_genesis_block():
    genesis = Block.genesis()
    # Assert genesis is the instance of Block class
    assert isinstance(genesis, Block)
    # Check genesis block data
    for key, value in GENESIS_DATA.items():
        assert getattr(genesis, key) == value


def test_quickly_mined_block():
    last_block = Block.mine_block(Block.genesis(), '1st block')
    block = Block.mine_block(last_block, '2nd block')

    assert block.difficulty == last_block.difficulty + 1


def test_slowly_mined_block():
    last_block = Block.mine_block(Block.genesis(), '1st block')
    time.sleep(MINE_RATE/SECONDS)
    block = Block.mine_block(last_block, '2nd block')

    assert block.difficulty == last_block.difficulty - 1


def test_mined_block_difficulty_limits_at_1():
    last_block = Block(
        time.time_ns(),
        "test_lst_hash",
        "test_hash",
        "test_data",
        1,
        0
    )
    time.sleep(MINE_RATE/SECONDS)
    mined_block = Block.mine_block(last_block, "data")

    assert mined_block.difficulty == 1
