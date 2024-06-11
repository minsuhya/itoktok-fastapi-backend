from typing import List, Union

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, desc, select

from ..core import get_session
from ..models.notice import Notice
from ..schemas.notice import NoticeCreate, NoticeUpdate
from ..crud import notice as crud
from ..schemas import ErrorResponse, SuccessResponse

router = APIRouter(
    prefix="/board",
    tags=["board"],
    dependencies=[Depends(get_session)],
    responses={404: {
        "description": "API Not found"
    }},
)

@router.post("/notices/", response_model=SuccessResponse)
def create_notice(notice: NoticeCreate, db: Session = Depends(get_session)):
    return SuccessResponse(data=crud.create_notice(db=db, notice=notice))

@router.get("/notices/", response_model=Union[SuccessResponse, List[Notice]])
def read_notices(skip: int = 0, limit: int = 100, db: Session = Depends(get_session)):
    notices = crud.get_notices(db, skip=skip, limit=limit)
    return SuccessResponse(data=notices)

@router.get("/notices/{notice_id}", response_model=SuccessResponse)
def read_notice(notice_id: int, db: Session = Depends(get_session)):
    notice = crud.get_notice(db, notice_id=notice_id)
    if notice is None:
        raise HTTPException(status_code=404, detail="Notice not found")
    return SuccessResponse(data=notice)

@router.put("/notices/{notice_id}", response_model=SuccessResponse)
def update_notice(notice_id: int, notice: Notice, db: Session = Depends(get_session)):
    return SuccessResponse(data=crud.update_notice(db=db, notice_id=notice_id, notice=notice))

@router.delete("/notices/{notice_id}")
def delete_notice(notice_id: int, db: Session = Depends(get_session)):
    crud.delete_notice(db=db, notice_id=notice_id)
    return SuccessResponse(data={"detail": "Notice deleted"})
