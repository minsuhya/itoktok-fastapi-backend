from typing import List, Optional

from fastapi_pagination import Page
from fastapi_pagination.ext.sqlalchemy import paginate
from sqlalchemy.orm import joinedload
from sqlmodel import Session, desc, select

from ..models.client import ClientInfo
from ..models.user import User
from ..schemas.client import ClientInfoCreate, ClientInfoRead, ClientInfoUpdate


###### Client Info CRUD #####
# 클라이언트 정보 생성
def create_client_info(session: Session, info: ClientInfoCreate) -> ClientInfo:
    print("create_client_info", info)
    client_info = ClientInfo.from_orm(info)
    session.add(client_info)
    session.commit()
    session.refresh(client_info)
    return client_info


# 클라이언트 정보 조회
def get_client_info_by_id(session: Session, info_id: int) -> Optional[ClientInfo]:
    return session.get(ClientInfo, info_id)


# 클라이언트 정보 조회
def get_client_info_by_consultant(
    session: Session, consultant: str
) -> Optional[ClientInfo]:
    statement = select(ClientInfo).where(ClientInfo.consultant == consultant)
    return session.exec(statement).first()


# 클라이언트 정보 조회
def get_client_infos(
    session: Session,
    login_user: User,
    page: int = 1,
    size: int = 10,
    search_qry: str = "",
) -> Page[ClientInfo]:
    # offset = (page - 1) * size
    # statement = select(ClientInfo).offset(offset).limit(size)
    # result = session.exec(statement).all()
    query = (
        select(ClientInfo)
        .options(joinedload(ClientInfo.consultant_info))
        .order_by(desc(ClientInfo.id))
    )
    if search_qry:
        query = query.where(ClientInfo.client_name.like(f"%{search_qry}%"))
    if login_user.is_superuser != 1:  # 최고관리자일경우 - 센터 정보만
        center_username = login_user.center_username or login_user.username
        query = query.where(ClientInfo.center_username == center_username)
    return paginate(
        session,
        query,
    )


# 클라이언트 정보 조회
def search_client_infos(session: Session, search_qry: str = "") -> Page[ClientInfo]:
    query = select(ClientInfo).options(joinedload(ClientInfo.consultant_info))
    if search_qry:
        query = query.where(ClientInfo.client_name.like(f"%{search_qry}%"))
    result = session.exec(query).all()

    return result


# 클라이언트 정보 수정
def update_client_info(
    session: Session, info: ClientInfoUpdate, db_info: ClientInfo
) -> Optional[ClientInfo]:
    # Pydantic 모델을 dict로 변환
    info_data = info.dict(exclude_unset=True)
    print("info_data", info_data)

    # SQLModel 객체의 필드를 업데이트
    for key, value in info_data.items():
        setattr(db_info, key, value)

    print("db_info_data", db_info)

    # 세션을 커밋하고, 변경된 객체를 새로 고칩니다.
    session.add(db_info)
    session.commit()
    session.refresh(db_info)
    print("after db_info_data", db_info)

    return db_info


# 상담 상태 변경
def update_consultant_status(
    session: Session, client_id: int, consultant_status: str
) -> Optional[ClientInfo]:
    client_info = session.get(ClientInfo, client_id)
    if not client_info:
        return None

    client_info.consultant_status = consultant_status
    session.add(client_info)
    session.commit()
    session.refresh(client_info)

    return client_info


# 클라이언트 정보 삭제
def delete_client_info(session: Session, consultant: str) -> bool:
    statement = select(ClientInfo).where(ClientInfo.consultant == consultant)
    result = session.exec(statement).first()

    if result:
        session.delete(result)
        session.commit()
        return True
    return False
