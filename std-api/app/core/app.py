from fastapi import Depends, FastAPI
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

# from core.pgdb import create_db_and_tables, engine
from .mydb import create_db_and_tables, engine

# from .mgdb import get_mongodb


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")

app = FastAPI(title="FastAPI + SQLModel + PostgreSQL(or Mysql)", version="0.1.0")


@app.on_event("startup")
def on_startup():
    create_db_and_tables()
    # app.mongodb = get_mongodb()


@app.on_event("shutdown")
def on_shutdown():
    engine.dispose()
    # app.mongodb.client.close()
    # app.mongodb = None
    # # get_mongodb().client.close()
