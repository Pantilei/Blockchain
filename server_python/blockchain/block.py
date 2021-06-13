import time
from server_python.util.crypto_hash import crypto_hash

GENESIS_DATA = {
    'timestamp': 1,
    'last_hash': 'genesis_last_hash',
    'hash': 'genesis_hash',
    'data': []
}


class Block:
    """
    Block is a unit of storage that store the transactions of cryptocurrency.
    """

    def __init__(self, timestamp: int, last_hash: str, hash: str, data: str) -> None:
        self.timestamp = timestamp
        self.last_hash = last_hash
        self.hash = hash
        self.data = data

    def __repr__(self) -> str:
        return (
            "\n Block ( \n"
            f"      timestamp: {self.timestamp}, \n"
            f"      last_hash: {self.last_hash}, \n"
            f"      hash: {self.hash}, \n"
            f"      data: {self.data} \n)"
        )

    @staticmethod
    def mine_block(last_block: 'Block', data: str) -> 'Block':
        """
        Mine the block based on given last block and data
        """
        timestamp = time.time_ns()
        last_hash = last_block.hash
        hash = crypto_hash(timestamp, last_hash, data)

        return Block(timestamp, last_hash, hash, data)

    @staticmethod
    def genesis() -> 'Block':
        """
        Generate Genesis block
        """
        return Block(**GENESIS_DATA)


def main():
    genesis_block = Block.genesis()
    block = Block.mine_block(genesis_block, "random data")
    print(block)


if __name__ == "__main__":
    main()
