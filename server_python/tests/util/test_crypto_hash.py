from server_python.util.crypto_hash import crypto_hash


def test_crypto_hash():
    # It should create same hash for the same set of params
    assert crypto_hash("some data", 2, [1, 2]) == crypto_hash(
        2, "some data", [1, 2])
    # Ensure that correct sha256 hash is generated
    assert crypto_hash(
        "data") == "519b3ed503c6a825347f28dfd269c0a422e3b923858410e3abbab2d2a99837f2"
