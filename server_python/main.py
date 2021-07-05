import uvicorn
import sys
from server_python.config import HOST


PORT: int = int(sys.argv[1] if len(sys.argv) > 1 else 5000)


if __name__ == "__main__":
    uvicorn.run("server_python.app:app", port=PORT,
                host=HOST, reload=True)
