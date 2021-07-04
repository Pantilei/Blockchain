import uvicorn
import sys
from random import randint
from server_python.config import HOST

# PORT: int = randint(5000, 6000)
PORT: int = int(sys.argv[1])


if __name__ == "__main__":
    uvicorn.run("server_python.app:app", port=PORT,
                host=HOST, reload=True)
