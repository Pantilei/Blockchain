from server_python.blockchain.block import Block, GENESIS_DATA


def test_mine_block():
    block = Block(1, "dummy last hash", "dummy hash", [2])
    # Ensure that block is instance of Block class
    assert isinstance(block, Block)
    # Check if block contains correct data
    assert block.last_hash == "dummy last hash"
    assert block.hash == "dummy hash"
    assert block.timestamp == 1
    assert block.data == [2]


def test_genesis_block():
    genesis = Block.genesis()
    # Assert genesis is the instance of Block class
    assert isinstance(genesis, Block)
    # Check genesis block data
    for key, value in GENESIS_DATA.items():
        assert getattr(genesis, key) == value
