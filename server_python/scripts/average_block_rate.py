import time
from server_python.config import SECONDS
from server_python.blockchain.blockchain import Blockchain


blockchain = Blockchain()
times = []
for i in range(1000):
    start_time = time.time_ns()
    blockchain.add_block(i)
    end_time = time.time_ns()

    mine_rate = (end_time - start_time)/SECONDS
    times.append(mine_rate)

    average_time = sum(times)/len(times)

    print(f"New block difficulty: {blockchain.chain[-1].difficulty} ")
    print(f"Time to mine new block: {mine_rate}s")
    print(f"Avarage time to mine the block: {average_time}s \n")
