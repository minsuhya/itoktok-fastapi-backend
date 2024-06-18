import os

import sqlalchemy as sa
from dotenv import load_dotenv
from loguru import logger
from sqlmodel import Session, SQLModel, create_engine

# from sqlmodel import text, select

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ENV_FILE = os.path.join(ROOT_DIR, ".env")
if os.path.exists(ENV_FILE):
    load_dotenv(ENV_FILE)

# https://fastapi.tiangolo.com/tutorial/sql-databases/#note
# connect_args = {"check_same_thread": False}  # only for SQLite

engine = create_engine(os.environ["CONN_URL"], echo=False)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def query_count(from_cls):
    """Return the number of rows in a query.

    Usage:
        session.execute( `query_count(products)` ).scalar_one()
    """
    return Session(engine).query(sa.func.count("*").label("cnt")).select_from(from_cls)

def get_session():
    with Session(engine) as session:
        yield session
