import os
from dotenv import load_dotenv
load_dotenv()

NANOSECONDS = 1
MICROSECONDS = NANOSECONDS * 1000
MILLISECONDS = MICROSECONDS * 1000
SECONDS = MILLISECONDS * 1000
MINE_RATE = 4 * SECONDS

RABBITMQ_URL = os.environ.get('RABBITMQ_URL')
HOST = os.environ.get('HOST')
STARTING_BALANCE = os.environ.get('STARTING_BALANCE')
