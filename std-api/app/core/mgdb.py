import os

from dotenv import load_dotenv
from loguru import logger
from pymongo import MongoClient
from pymongo.database import Database
from pymongo.errors import ConnectionFailure

# MongoDB attributes
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ENV_FILE = os.path.join(ROOT_DIR, ".env")
if os.path.exists(ENV_FILE):
    load_dotenv(ENV_FILE)

client = MongoClient(os.environ["MONGO_URI"])

# check connection
try:
    # The ismaster command is cheap and does not require auth.
    client.admin.command("ismaster")
    # init database
    client.drop_database(os.environ["MONGO_DB"])
except ConnectionFailure:
    logger.error("MongoDB Server not available")
    client = None


def get_mongodb() -> Database:
    return client[os.environ["MONGO_DB"]]
