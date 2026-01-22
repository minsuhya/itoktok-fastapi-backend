from typing import List, Union

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, desc, select

from ..core import get_session, oauth2_scheme
from ..models.record import Record
from ..schemas.record import RecordCreate, RecordUpdate, RecordRead
from ..crud.record import (
    create_record as create_record_crud,
    get_record,
    get_records,
    update_record as update_record_crud,
    delete_record as delete_record_crud,
)
from ..schemas import ErrorResponse, SuccessResponse
from .auth import get_current_user

router = APIRouter(
    prefix="/records",
    tags=["records"],
    dependencies=[Depends(get_session), Depends(oauth2_scheme)],
    responses={404: {"description": "API Not found"}},
)


@router.post("/", response_model=RecordRead)
def create_record(
    record: RecordCreate,
    db_session: Session = Depends(get_session),
    current_user=Depends(get_current_user),
):
    record_data = Record.from_orm(record)
    return create_record_crud(db_session, record_data)


@router.get("/{record_id}", response_model=RecordRead)
def read_record(
    record_id: int,
    db_session: Session = Depends(get_session),
    current_user=Depends(get_current_user),
):
    record = get_record(db_session, record_id)
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    return record


@router.get("/", response_model=List[RecordRead])
def read_records(
    skip: int = 0,
    limit: int = 10,
    db_session: Session = Depends(get_session),
    current_user=Depends(get_current_user),
):
    return get_records(db_session, skip=skip, limit=limit)


@router.put("/{record_id}", response_model=RecordRead)
def update_record(
    record_id: int,
    record: RecordUpdate,
    db_session: Session = Depends(get_session),
    current_user=Depends(get_current_user),
):
    existing_record = get_record(db_session, record_id)
    if not existing_record:
        raise HTTPException(status_code=404, detail="Record not found")
    record_data = record.dict(exclude_unset=True)
    for key, value in record_data.items():
        setattr(existing_record, key, value)
    return update_record_crud(db_session, record_id, existing_record)


@router.delete("/{record_id}", response_model=bool)
def delete_record(
    record_id: int,
    db_session: Session = Depends(get_session),
    current_user=Depends(get_current_user),
):
    if not delete_record_crud(db_session, record_id):
        raise HTTPException(status_code=404, detail="Record not found")
    return True
