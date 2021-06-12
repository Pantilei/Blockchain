import hashlib
import json


def crypto_hash(*args):
    """Create sha256 hash with given data

    Args:
        data (any): Data to be hashed

    Returns:
        str: sha256 hash
    """
    # Stringify data and sort so that generated hash will always be the same
    stringified_args = sorted(map(lambda data: json.dumps(data), args))
    joined_strings = "".join(stringified_args)

    return hashlib.sha256(joined_strings.encode("utf-8")).hexdigest()


def main():
    print(crypto_hash(123, [3], "wer"))
    print(crypto_hash("wer", 123, [3]))
    print("abc".encode("utf-8"))


if __name__ == "__main__":
    main()
