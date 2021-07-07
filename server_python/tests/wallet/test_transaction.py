from cryptography.hazmat.primitives.asymmetric import ec
import pytest
from cryptography.hazmat import backends
from server_python.wallet.wallet import Wallet
from server_python.wallet.transaction import Transaction


def test_transaction():
    sender_wallet = Wallet()
    recipient = 'saslfgj_recipient'
    amount = 50
    transaction = Transaction(sender_wallet, recipient, amount)

    assert transaction.output[recipient] == amount
    assert transaction.output[sender_wallet.address] == sender_wallet.balance - amount

    assert 'timestamp' in transaction.input
    assert transaction.input['amount'] == sender_wallet.balance
    assert transaction.input['address'] == sender_wallet.address
    assert transaction.input['public_key'] == sender_wallet.public_key

    assert Wallet.verify(
        transaction.input['public_key'], transaction.output, transaction.input['signature'])


def test_transactions_exceeds_balance():
    with pytest.raises(Exception, match='Amount exceeds balance!'):
        Transaction(Wallet(), 'recipient', 7001)
