from typing import List, Optional

from passlib.hash import bcrypt
from sqlmodel import Session, select

from ..models.user import CenterDirector, CenterInfo
from ..schemas.user import CenterDirectorUpdate, CenterInfoUpdate

# from passlib.context import CryptContext

# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_password_hash(password: str) -> str:
    # return pwd_context.hash(password)
    return bcrypt.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.verify(plain_password, hashed_password)


###### CenterDirector CRUD ######
# 센터 디렉터 생성
def create_center_director(
    session: Session, director: CenterDirector
) -> CenterDirector:
    director.password = get_password_hash(director.password)
    session.add(director)
    session.commit()
    session.refresh(director)
    return director


# 센터 디렉터 조회
def get_center_director_by_id(
    session: Session, director_id: int
) -> Optional[CenterDirector]:
    return session.get(CenterDirector, director_id)


# 센터 디렉터 조회
def get_center_director_by_username(
    session: Session, username: str
) -> Optional[CenterDirector]:
    statement = select(CenterDirector).where(CenterDirector.username == username)
    return session.exec(statement).first()


# 센터 디렉터 조회
def get_center_directors(
    session: Session, skip: int = 0, limit: int = 10
) -> List[CenterDirector]:
    statement = select(CenterDirector).offset(skip).limit(limit)
    return session.exec(statement).all()


# 센터 디렉터 수정
def update_center_director(
    session: Session, director: CenterDirectorUpdate, db_director: CenterDirector
) -> Optional[CenterDirector]:
    director_data = director.model_dump(exclude_unset=True)
    db_director.sqlmodel_update(director_data)
    session.commit()
    session.refresh(db_director)
    return db_director


# 센터 디렉터 삭제
def delete_center_director(session: Session, director_id: int) -> bool:
    director = session.get(CenterDirector, director_id)
    if director:
        session.delete(director)
        session.commit()
        return True
    return False


###### Center Info CRUD #####
# 센터 정보 생성
def create_center_info(session: Session, info: CenterInfo) -> CenterInfo:
    session.add(info)
    session.commit()
    session.refresh(info)
    return info


# 센터 정보 조회
def get_center_info_by_id(session: Session, info_id: int) -> Optional[CenterInfo]:
    return session.get(CenterInfo, info_id)


# 센터 정보 조회
def get_center_info_by_username(
    session: Session, username: str
) -> Optional[CenterInfo]:
    statement = select(CenterInfo).where(CenterInfo.username == username)
    return session.exec(statement).first()


# 센터 정보 조회
def get_center_infos(
    session: Session, skip: int = 0, limit: int = 10
) -> List[CenterInfo]:
    statement = select(CenterInfo).offset(skip).limit(limit)
    return session.exec(statement).all()


# 센터 정보 수정
def update_center_info(
    session: Session, info: CenterInfoUpdate, db_info: CenterInfo
) -> Optional[CenterInfo]:
    # info 객체에서 변경된 데이터를 dict로 변환합니다.
    info_data = info.model_dump(exclude_unset=True)

    # # db_info 객체를 model_validate를 사용하여 업데이트합니다.
    # updated_db_info = db_info.model_validate(info_data)
    # pydantic 모델을 사용하여 필드 갱신
    db_info.__dict__.update(info_data)

    # 세션을 커밋하고, 변경된 객체를 새로 고칩니다.
    session.add(db_info)
    session.commit()
    session.refresh(db_info)

    return db_info


# 센터 정보 삭제
def delete_center_info(session: Session, username: str) -> bool:
    statement = select(CenterInfo).where(CenterInfo.username == username)
    result = session.exec(statement).first()

    if result:
        session.delete(result)
        session.commit()
        return True
    return False
