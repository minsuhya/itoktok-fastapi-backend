from fastapi import Depends, FastAPI
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware

# from core.pgdb import create_db_and_tables, engine
from .mydb import create_db_and_tables, engine


app = FastAPI()

origins = [
    "*",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,  # cross-origin request에서 cookie를 포함할 것인지 (default=False)
    allow_methods=["*"],     # cross-origin request에서 허용할 method들을 나타냄. (default=['GET']
    allow_headers=["*"],     # cross-origin request에서 허용할 HTTP Header 목록
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

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
