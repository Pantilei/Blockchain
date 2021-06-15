from server_python.util.hex_to_binary import hex_to_binary


def test_hex_to_binary():
    original_number = 678
    hex_original_number = hex(original_number)[2:]
    binary_original_number = hex_to_binary(hex_original_number)

    assert int(binary_original_number, 2) == original_number
