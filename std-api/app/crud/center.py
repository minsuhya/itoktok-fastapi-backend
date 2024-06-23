from typing import List, Optional
from sqlmodel import Session, select
from ..models.user import CenterDirector
from ..schemas.user import CenterDirectorUpdate
from passlib.hash import bcrypt
# from passlib.context import CryptContext

# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    # return pwd_context.hash(password)
    return bcrypt.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.verify(plain_password, hashed_password)

def create_center_director(session: Session, director: CenterDirector) -> CenterDirector:
    director.password = get_password_hash(director.password)
    session.add(director)
    session.commit()
    session.refresh(director)
    return director

def get_center_director_by_id(session: Session, director_id: int) -> Optional[CenterDirector]:
    return session.get(CenterDirector, director_id)

def get_center_director_by_username(session: Session, username: str) -> Optional[CenterDirector]:
    statement = select(CenterDirector).where(CenterDirector.username == username)
    return session.exec(statement).first()

def get_center_directors(session: Session, skip: int = 0, limit: int = 10) -> List[CenterDirector]:
    statement = select(CenterDirector).offset(skip).limit(limit)
    return session.exec(statement).all()

def update_center_director(session: Session, director: CenterDirectorUpdate, db_director: CenterDirector) -> Optional[CenterDirector]:
    director_data = director.model_dump(exclude_unset=True)
    db_director.sqlmodel_update(director_data)
    session.commit()
    session.refresh(db_director)
    return db_director

def delete_center_director(session: Session, director_id: int) -> bool:
    director = session.get(CenterDirector, director_id)
    if director:
        session.delete(director)
        session.commit()
        return True
    return False
