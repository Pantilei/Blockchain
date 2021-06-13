from server_python.blockchain.block import Block


class Blockchain:
    """
    Blockchain is a public ledger of transactions which is implemented as a list of blocks(datasets of transactions)
    """

    def __init__(self) -> None:
        self.chain = [Block.genesis()]

    def add_block(self, data):
        last_block = self.chain[-1]
        self.chain.append(Block.mine_block(last_block, data))

    def __repr__(self) -> str:
        return f"Blockchain: {self.chain}"


if __name__ == "__main__":
    blockchain = Blockchain()
    blockchain.add_block("data1")
    blockchain.add_block("data2")
    blockchain.add_block("data3")

    print(blockchain)
