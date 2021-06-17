import time
from server_python.util.crypto_hash import crypto_hash
from server_python.config import MINE_RATE
from server_python.util.hex_to_binary import hex_to_binary


GENESIS_DATA = {
    'timestamp': 1,
    'last_hash': 'genesis_last_hash',
    'hash': 'genesis_hash',
    'data': [],
    'difficulty': 3,
    'nonce': 0
}


class Block:
    """
    Block is a unit of storage that store the transactions of cryptocurrency.
    """

    def __init__(self, timestamp: int, last_hash: str, hash: str, data: str, difficulty: int, nonce: int) -> None:
        self.timestamp = timestamp
        self.last_hash = last_hash
        self.hash = hash
        self.data = data
        self.difficulty = difficulty
        self.nonce = nonce

    def __repr__(self) -> str:
        return (
            "\n Block ("
            f"      timestamp: {self.timestamp}, \n"
            f"      last_hash: {self.last_hash}, \n"
            f"      hash: {self.hash}, \n"
            f"      data: {self.data} \n"
            f"      difficulty: {self.difficulty} \n"
            f"      nonce: {self.nonce}) \n"
        )

    def __eq__(self, o: object) -> bool:
        return self.__dict__ == o.__dict__

    @staticmethod
    def mine_block(last_block: 'Block', data: str) -> 'Block':
        """
        Mine the block based on given last block and data until the hash meets the leading 0's proof of work requirements.
        """
        timestamp = time.time_ns()
        last_hash = last_block.hash
        difficulty = Block.adjust_difficulty(last_block, timestamp)
        nonce = 0
        hash = crypto_hash(timestamp, last_hash, data, difficulty, nonce)

        while hex_to_binary(hash)[0:difficulty] != "0"*difficulty:
            nonce += 1
            timestamp = time.time_ns()
            difficulty = Block.adjust_difficulty(last_block, timestamp)
            hash = crypto_hash(timestamp, last_hash, data, difficulty, nonce)

        return Block(timestamp, last_hash, hash, data, difficulty, nonce)

    @staticmethod
    def genesis() -> 'Block':
        """
        Generate Genesis block
        """
        return Block(**GENESIS_DATA)

    def adjust_difficulty(last_block: 'Block', new_timestamp: int) -> int:
        """Calculate the adjusted difficulty according to MINE_RATE

        Args:
            last_block (Block): Last block in chain
            new_timestamp (int): Current timestamp when mining the block

        Returns:
            int: Adjusted difficulty
        """
        if (new_timestamp - last_block.timestamp) < MINE_RATE:
            return last_block.difficulty + 1

        if (last_block.difficulty - 1) > 0:
            return last_block.difficulty - 1

        return 1

    @staticmethod
    def is_valid_block(last_block: 'Block', block: 'Block') -> None:
        """
        Validate the block by enforcing the following rules:
         - The block must contain the proper last hash reference
         - The proof of work requirement must be met
         - The block difficulty must only adjust by 1
         - The block hash must be valid combination of block fields
        Args:
            last_block (Block): Last block instance
            block (Block): Current block instance

        Raises:
            Exception: When the block is not valid
        """

        if block.last_hash != last_block.hash:
            raise Exception('The block must have proper last hash reference!')

        if hex_to_binary(block.hash)[0:block.difficulty] != '0' * block.difficulty:
            raise Exception('The proof of work requirement is not met!')

        if abs(last_block.difficulty - block.difficulty) > 1:
            raise Exception('The block difficulty must be only adjusted by 1!')

        reconstructed_hash = crypto_hash(
            block.timestamp,
            block.last_hash,
            block.data,
            block.difficulty,
            block.nonce
        )
        if reconstructed_hash != block.hash:
            raise Exception(
                'The block hash must be a valid combination of block fields!')


def main():
    genesis_block = Block.genesis()
    bad_block = Block.mine_block(genesis_block, "random data")
    bad_block.last_hash = "danger"
    try:
        Block.is_valid_block(genesis_block, bad_block)
    except Exception as e:
        print(e)


if __name__ == "__main__":
    main()
