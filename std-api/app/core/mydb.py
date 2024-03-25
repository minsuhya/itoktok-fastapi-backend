import os

import sqlalchemy as sa
from dotenv import load_dotenv
from loguru import logger
from ..models import User, Hero, Team
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
    insert_samples()


def insert_samples():
    with Session(engine) as session:
        # size = session.execute(text("SELECT count(id) AS cnt FROM hero")).scalar_one()
        size = session.execute(query_count(Hero)).scalar_one()
        if size > 0:
            logger.info("Samples already inserted: size={}", size)
            return

        team1 = Team(name="서울팀", headquarters="종로구")
        team2 = Team(name="충남팀", headquarters="홍성군")
        team3 = Team(name="경북팀", headquarters="울산군", heroes=[])
        session.add_all(instances=[team1, team2, team3])
        session.commit()
        session.refresh(team1)
        session.refresh(team2)
        session.refresh(team3)
        logger.info([team1, team2, team3])

        hero1 = Hero(name="Deadpond", secret_name="Dive Wilson", team_id=1)
        hero2 = Hero(name="Rusty-Man", secret_name="Tommy Sharp", age=48, team_id=1)
        hero3 = Hero(name="Dormammu", secret_name="Unknown", team_id=2)
        hero4 = Hero(name="Spider-Boy", secret_name="Pedro Parqueador", age=21)
        session.add_all(instances=[hero1, hero2, hero3, hero4])
        session.commit()
        session.refresh(hero1)
        session.refresh(hero2)
        session.refresh(hero3)
        session.refresh(hero4)
        logger.info([hero1, hero2, hero3, hero4])
        logger.info([team1, team2, team3])


def query_count(from_cls):
    """Return the number of rows in a query.

    Usage:
        session.execute( `query_count(products)` ).scalar_one()
    """
    return Session(engine).query(sa.func.count("*").label("cnt")).select_from(from_cls)


def get_session():
    with Session(engine) as session:
        yield session
