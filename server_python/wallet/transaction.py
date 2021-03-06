import uuid
import time
from server_python.wallet.wallet import Wallet


class Transaction:
    """
    Document of an exchange in currency from a sender to one or more recipient.
    Transaction input must have the same amount as transaction output(What enters to system should leave it.)
    Ex: When you have 3 coins and you send 1 coin to Alice, you receive back 2 coins as change.
    """

    def __init__(self, sender_wallet: Wallet, recipient: str, amount: float) -> None:
        self.id = str(uuid.uuid4())[0:8]
        self.output = self.create_output(sender_wallet, recipient, amount)
        self.input = self.create_input(sender_wallet, self.output)

    def create_output(self, sender_wallet: Wallet, recipient_address: str, amount: float) -> dict:
        """Structure the output data for the transaction

        Args:
            sender_wallet (Wallet): sender wallet object
            recipient_address (str): recipient address
            amount (float): Amount sent

        Returns:
            dict: output data of transaction
        """
        if amount > sender_wallet.balance:
            raise Exception('Amount exceeds balance!')
        output = {}
        output[recipient_address] = amount
        output[sender_wallet.address] = sender_wallet.balance - amount

        return output

    def create_input(self, sender_wallet: Wallet, output: dict) -> dict:
        """
        Structure the input data for transaction.
        Sign the transaction and include the sender's public key and address

        Args:
            sender_wallet (Wallet): Wallet
            output (dict): Output

        Returns:
            dict: Input data
        """
        return {
            'timestamp': time.time_ns(),
            'amount': sender_wallet.balance,
            'address': sender_wallet.address,
            'public_key': sender_wallet.public_key,
            'signature': sender_wallet.sign(output)
        }

    def update(self, sender_wallet: Wallet, recipient: str, amount: float) -> None:
        """
        Update the transaction inctance. 
        Rule: Only one transaction per sender per block

        Args:
            sender_wallet (Wallet): Wallet of sender
            recipient (str): Recipient address
            amount (float): Amount sent

        Raises:
            Exception: When amount exceeds the balance of wallet
        """
        if amount > self.output[sender_wallet.address]:
            raise Exception('Amount exceeds balance!')

        if recipient in self.output:
            self.output[recipient] += amount
        else:
            self.output[recipient] = amount

        self.output[sender_wallet.address] -= amount

        self.input = self.create_input(sender_wallet, self.output)

    def to_dict(self) -> dict:
        """Serialize the transaction

        Returns:
            dict: Dictionary representation of transaction
        """
        return self.__dict__

    @staticmethod
    def is_valid_transaction(transaction: 'Transaction') -> None:
        """Validate the transaction

        Args:
            transaction (Transaction): Transaction instance

        Raises:
            Exception: If output doesn't balance input
            Exception: If signature is invalid
        """
        if sum(transaction.output.values()) != transaction.input['amount']:
            raise Exception("Invalid transaction output values!")

        if not Wallet.verify(transaction.input["public_key"], transaction.output, transaction.input["signature"]):
            raise Exception('Invalid signature!')


def main():
    transaction = Transaction(Wallet(), 'lk34ljnlsf_recipient', 15)
    print(f"Transaction: {transaction.__dict__}")


if __name__ == "__main__":
    main()
