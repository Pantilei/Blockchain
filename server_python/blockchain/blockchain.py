from server_python.tests.blockchain.test_block import last_block
from typing import List
from server_python.blockchain.block import Block


class Blockchain:
    """
    Blockchain is a public ledger of transactions which is implemented as a list of blocks(datasets of transactions)
    """

    def __init__(self) -> None:
        self.chain: List[Block] = [Block.genesis()]

    def add_block(self, data):
        last_block = self.chain[-1]
        self.chain.append(Block.mine_block(last_block, data))

    def __repr__(self) -> str:
        return f"Blockchain: {self.chain}"

    def is_valid_chain(chain: List[Block]) -> None:
        """Validate the incomming chain
            Enforce the following rules of blockchain:
             - The chain must start with genesis block
             - Blocks must be formatted correctly

        Args:
            chain (Blockchain): Chain of blocks

        Raises:
            Exception: If chain is not valid
        """
        if chain[0] != Block.genesis():
            raise Exception('The genesis block must be valid!')

        for i in range(1, len(chain)):
            last_block = chain[i-1]
            block = chain[i]
            Block.is_valid_block(last_block, block)


if __name__ == "__main__":
    blockchain = Blockchain()
    blockchain.add_block("data1")
    blockchain.add_block("data2")
    blockchain.add_block("data3")

    print(blockchain)
