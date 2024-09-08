from typing import List, Optional

from fastapi_pagination import Page
from fastapi_pagination.ext.sqlalchemy import paginate
from sqlmodel import Session, desc, select

from ..models.client import ClientInfo
from ..schemas.client import ClientInfoCreate, ClientInfoRead, ClientInfoUpdate


###### Client Info CRUD #####
# 클라이언트 정보 생성
def create_client_info(session: Session, info: ClientInfoCreate) -> ClientInfo:
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
    session: Session, page: int = 1, size: int = 10, search_qry: str = ""
) -> Page[ClientInfo]:
    # offset = (page - 1) * size
    # statement = select(ClientInfo).offset(offset).limit(size)
    # result = session.exec(statement).all()
    return paginate(
        session,
        select(ClientInfo)
        .where(ClientInfo.client_name.like(f"%{search_qry}%"))
        .order_by(desc(ClientInfo.id)),
    )


# 클라이언트 정보 수정
def update_client_info(
    session: Session, info: ClientInfoUpdate, db_info: ClientInfo
) -> Optional[ClientInfo]:
    # info 객체에서 변경된 데이터를 dict로 변환합니다.
    info_data = info.model_dump(exclude_unset=True)

    # db_info 객체의 필드를 업데이트합니다.
    db_info.__dict__.update(info_data)

    # 세션을 커밋하고, 변경된 객체를 새로 고칩니다.
    session.add(db_info)
    session.commit()
    session.refresh(db_info)

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
