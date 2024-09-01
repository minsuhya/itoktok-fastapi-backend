from typing import List, Optional

from passlib.context import CryptContext
from sqlmodel import Session, select

from ..models.user import User
from ..schemas.user import UserUpdate

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def create_user(session: Session, user: User) -> User:
    if user.user_type == 1:  # center로 가입할 경우 center_username을 username으로 설정
        user.center_username = user.username
    user.password = get_password_hash(user.password)
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


def get_user_by_id(session: Session, user_id: int) -> Optional[User]:
    return session.get(User, user_id)


def get_user_by_username(session: Session, username: str) -> Optional[User]:
    statement = select(User).where(User.username == username)
    return session.exec(statement).first()


def get_users(session: Session, skip: int = 0, limit: int = 10) -> List[User]:
    statement = select(User).offset(skip).limit(limit)
    return session.exec(statement).all()


def update_user(session: Session, user: UserUpdate, db_user: User) -> Optional[User]:
    user_data = user.model_dump(exclude_unset=True)
    db_user.sqlmodel_update(user_data)
    session.commit()
    session.refresh(db_user)
    return db_user


def delete_user(session: Session, user_id: int) -> bool:
    user = session.get(User, user_id)
    if user:
        session.delete(user)
        session.commit()
        return True
    return False
