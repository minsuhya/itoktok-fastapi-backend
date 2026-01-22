from typing import List, Optional
from datetime import datetime
from fastapi_pagination import Page
from fastapi_pagination.ext.sqlalchemy import paginate
from passlib.context import CryptContext
from sqlalchemy.orm import joinedload
from sqlmodel import Session, desc, select

from ..models.user import User, UserSearchSelectedTeacher
from ..schemas.user import (
    UserUpdate,
    UserSearchSelectedTeacherCreate,
    UserSearchSelectedTeacherUpdate,
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def create_user(session: Session, user: User) -> User:
    if (
        not user.center_username and user.user_type == 1
    ):  # center로 가입할 경우 center_username을 username으로 설정
        user.center_username = user.username
    if user.expertise is None:
        user.expertise = ""
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


# 사용자(상담사)
def get_users(
    session: Session,
    login_user: User,
    page: int = 1,
    size: int = 10,
    search_qry: str = "",
) -> Page[User]:
    # statement = select(User).offset(skip).limit(limit)
    # return session.exec(statement).all()

    statement = (
        select(User).options(joinedload(User.center_info)).order_by(desc(User.id))
    )

    # 로그인 사용자 타입에 따라 조회 조건 설정
    if login_user:
        # 센터장(user_type=1)인 경우 자신이 센터장인 센터의 사용자 조회
        if login_user.user_type == "1":
            statement = statement.where(User.center_username == login_user.username)
        # 선생님(user_type=2)인 경우 자신만 조회
        elif login_user.user_type == "2":
            statement = statement.where(User.username == login_user.username)
        # 최고관리자는 모든 사용자 조회 (필터링 없음)

    if search_qry:
        statement = statement.where(User.full_name.like(f"%{search_qry}%"))

    return paginate(session, statement)


def update_user(session: Session, user: UserUpdate, db_user: User) -> Optional[User]:
    user_data = user.model_dump(exclude_unset=True)
    if user.password and user.password.strip():
        user_data["password"] = get_password_hash(user.password)
    else:
        user_data.pop("password", None)
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


# 사용자(상담사) 리스트
def get_teachers(session: Session, current_user: User) -> List[User]:
    # 로그인 사용자 타입에 따라 조회 조건 설정
    statement = select(User)
    if current_user:
        # 센터장(user_type=1)인 경우 자신이 센터장인 센터의 선생님 조회
        if current_user.user_type == "1":
            statement = statement.where(User.center_username == current_user.username)
        # 선생님(user_type=2)인 경우 자신만 조회
        elif current_user.user_type == "2":
            print("선생님")
            statement = statement.where(User.username == current_user.username)
        # 최고관리자는 모든 선생님 조회 (필터링 없음)
    statement = statement.order_by(desc(User.id))
    return session.exec(statement).all()


def get_user_selected_teachers(
    session: Session, username: str
) -> Optional[UserSearchSelectedTeacher]:
    """사용자가 선택한 상담사 목록 조회"""
    statement = select(UserSearchSelectedTeacher).where(
        UserSearchSelectedTeacher.username == username
    )
    return session.exec(statement).first()


def create_user_selected_teachers(
    session: Session, data: UserSearchSelectedTeacherCreate
) -> UserSearchSelectedTeacher:
    """사용자가 선택한 상담사 목록 생성"""
    db_selected = UserSearchSelectedTeacher(
        username=data.username,
        selected_teacher=data.selected_teacher,
        created_at=datetime.now(),
        updated_at=datetime.now(),
    )
    session.add(db_selected)
    session.commit()
    session.refresh(db_selected)
    return db_selected


def update_user_selected_teachers(
    session: Session, username: str, data: UserSearchSelectedTeacherUpdate
) -> Optional[UserSearchSelectedTeacher]:
    """사용자가 선택한 상담사 목록 업데이트"""
    db_selected = get_user_selected_teachers(session, username)
    if not db_selected:
        return None

    data_dict = data.model_dump(exclude_unset=True)
    for key, value in data_dict.items():
        setattr(db_selected, key, value)

    session.add(db_selected)
    session.commit()
    session.refresh(db_selected)
    return db_selected


def delete_user_selected_teachers(session: Session, username: str) -> bool:
    """사용자가 선택한 상담사 목록 삭제"""
    db_selected = get_user_selected_teachers(session, username)
    if db_selected:
        session.delete(db_selected)
        session.commit()
        return True
    return False
