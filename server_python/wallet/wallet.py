from inspect import signature
from typing import ByteString
import uuid
import json
from server_python.config import STARTING_BALANCE
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives import hashes
from cryptography.exceptions import InvalidSignature


class Wallet:
    """
    An individual wallet for a miner.
    Keeps track of miner's balance. 
    Allows the miner to authorize transactions.
    """

    def __init__(self) -> None:
        self.address = str(uuid.uuid4())[0:8]
        self.balance = STARTING_BALANCE
        self.private_key = ec.generate_private_key(
            ec.SECP256K1(), default_backend()
        )
        self.public_key = self.private_key.public_key()

    def sign(self, data: dict) -> ByteString:
        """Generate the signature based on local private key

        Args:
            data (dict): Data to sign

        Returns:
            Bytestring: Hex represantation of signature 
        """
        return self.private_key.sign(
            json.dumps(data).encode('UTF-8'),
            ec.ECDSA(hashes.SHA256())
        )

    @staticmethod
    def verify(public_key: ec.EllipticCurvePublicKey, data: dict, signature: bytes) -> bool:
        """Verify signature based on the original public key and data

        Args:
            public_key (ec.EllipticCurvePublicKey): public key
            data (dict): Signed data
            signature (bytes): Signature

        Returns:
            bool: Verified state
        """
        try:
            public_key.verify(
                signature,
                json.dumps(data).encode('UTF-8'),
                ec.ECDSA(hashes.SHA256())
            )
            return True
        except InvalidSignature:
            return False


def main():
    wallet = Wallet()
    print(f"\nWallet: {wallet.__dict__}")
    data = {'foo': 'mate'}
    signature = wallet.sign(data)
    print(f"\nSignature: ", signature)

    should_be_valid = Wallet.verify(wallet.public_key, data, signature)
    print(f"\nsould be valid: ", should_be_valid)

    should_be_invalid = Wallet.verify(Wallet().public_key, data, signature)
    print(f"\nsould be invalid: ", should_be_invalid)


if __name__ == "__main__":
    main()
