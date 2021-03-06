from logging import WARN
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


def test_transaction_update_exceeds_balance():
    sender_wallet = Wallet()
    transaction = Transaction(sender_wallet, 'recipient', 50)

    with pytest.raises(Exception, match='Amount exceeds balance!'):
        transaction.update(sender_wallet, 'recipient', 9000)


def test_transaction_update():
    sender_wallet = Wallet()

    first_recipient = 'first_recipient'
    first_amount = 50

    transaction = Transaction(sender_wallet, first_recipient, first_amount)

    next_recipient = 'next_recipient'
    next_amount = 70

    transaction.update(sender_wallet, next_recipient, next_amount)

    assert transaction.output[next_recipient] == next_amount
    assert transaction.output[sender_wallet.address] == sender_wallet.balance - \
        first_amount - next_amount
    assert Wallet.verify(
        transaction.input['public_key'], transaction.output, transaction.input['signature'])

    to_first_again_amount = 25
    transaction.update(sender_wallet, first_recipient, to_first_again_amount)
    assert transaction.output[first_recipient] == first_amount + \
        to_first_again_amount
    assert transaction.output[sender_wallet.address] == sender_wallet.balance - \
        first_amount - next_amount - to_first_again_amount
    assert Wallet.verify(
        transaction.input['public_key'], transaction.output, transaction.input['signature'])


def test_valid_transaction():
    Transaction.is_valid_transaction(Transaction(Wallet(), 'recipient', 70))


def test_valid_transaction_with_invalid_outputs():
    sender_wallet = Wallet()
    transaction = Transaction(sender_wallet, 'recipient', 50)

    transaction.output[sender_wallet.address] = 9000

    with pytest.raises(Exception, match='Invalid transaction output values!'):
        Transaction.is_valid_transaction(transaction)


def test_valid_transaction_with_invalid_signature():
    transaction = Transaction(Wallet(), 'recipient', 80)
    transaction.input['signature'] = Wallet().sign(transaction.output)

    with pytest.raises(Exception, match='Invalid signature!'):
        Transaction.is_valid_transaction(transaction)
