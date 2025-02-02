from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi_pagination import Page, add_pagination
from sqlalchemy.orm import Session

from ..core import get_session, oauth2_scheme
from ..crud.client import (create_client_info, delete_client_info,
                           get_client_info_by_consultant,
                           get_client_info_by_id, get_client_infos,
                           search_client_infos, update_client_info,
                           update_consultant_status)
from ..models.client import ClientInfo
from ..models.user import User
from ..schemas import ErrorResponse, SuccessResponse
from ..schemas.client import ClientInfoCreate, ClientInfoRead, ClientInfoUpdate
from .auth import get_current_user

router = APIRouter(
    prefix="/client",
    tags=["Client"],
    dependencies=[Depends(get_session), Depends(oauth2_scheme)],
    responses={404: {"description": "API Not found"}},
)


# 클라이언트 정보 생성
@router.post("/", response_model=ClientInfoRead)
def create_client(
    info: ClientInfoCreate,
    db: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    info.register = current_user.username
    return create_client_info(db, info)


# 클라이언트 정보 조회 by ID
@router.get("/{info_id}", response_model=SuccessResponse[ClientInfoRead])
def read_client_info(info_id: int, db: Session = Depends(get_session)):
    db_info = get_client_info_by_id(db, info_id)
    if db_info is None:
        raise HTTPException(status_code=404, detail="Client info not found")
    return SuccessResponse(data=db_info)


# 상담 상태 변경
@router.put(
    "/{info_id}/consultant_status/{consultant_status}",
    response_model=SuccessResponse[ClientInfoRead],
)
def change_consultant_status(
    info_id: int, consultant_status: str, db: Session = Depends(get_session)
):
    client_info = update_consultant_status(db, info_id, consultant_status)
    if not client_info:
        raise HTTPException(status_code=404, detail="Client not found")
    return SuccessResponse(data=client_info)


# 클라이언트 정보 조회 by Consultant
@router.get("/consultant/{consultant}", response_model=ClientInfoRead)
def read_client_info_by_consultant(consultant: str, db: Session = Depends(get_session)):
    db_info = get_client_info_by_consultant(db, consultant)
    if db_info is None:
        raise HTTPException(status_code=404, detail="Client info not found")
    return db_info


# 여러 클라이언트 정보 조회
@router.get("/", response_model=Page[ClientInfoRead])
def read_client_infos(
    page: int = 1,
    size: int = 10,
    search_qry: str = "",
    db: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    print("current_user", current_user)
    return get_client_infos(
        db, page=page, size=size, search_qry=search_qry, login_user=current_user
    )


# 클라이언트 정보 조회
@router.get("/search/", response_model=SuccessResponse[ClientInfoRead])
def read_search_client_infos(
    search_qry: str = "",
    db: Session = Depends(get_session),
):
    print("search_qry", search_qry)
    return SuccessResponse(data=search_client_infos(db, search_qry))


# 클라이언트 정보 수정
@router.put("/{info_id}", response_model=ClientInfoRead)
def update_client(
    info_id: int, info: ClientInfoUpdate, db: Session = Depends(get_session)
):
    db_info = get_client_info_by_id(db, info_id)
    print("info", info)
    print("db_info", db_info)
    if db_info is None:
        raise HTTPException(status_code=404, detail="Client info not found")
    return update_client_info(db, info, db_info)


# 클라이언트 정보 삭제
@router.delete("/{consultant}", response_model=bool)
def delete_client(consultant: str, db: Session = Depends(get_session)):
    if not delete_client_info(db, consultant):
        raise HTTPException(status_code=404, detail="Client info not found")
    return True
