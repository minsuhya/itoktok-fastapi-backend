from typing import List, Union

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, desc, select

from ..core import get_session, oauth2_scheme
from ..models.inquiry import Inquiry
from ..schemas.inquiry import InquiryCreate, InquiryUpdate, InquiryRead
from ..crud.inquiry import (
    create_inquiry as create_inquiry_crud,
    get_inquiry,
    get_inquiries,
    update_inquiry as update_inquiry_crud,
    delete_inquiry as delete_inquiry_crud,
)
from ..schemas import ErrorResponse, SuccessResponse
from .auth import get_current_user

router = APIRouter(
    prefix="/inquiries",
    tags=["inquiries"],
    dependencies=[Depends(get_session), Depends(oauth2_scheme)],
    responses={404: {"description": "API Not found"}},
)


@router.post("/", response_model=InquiryRead)
def create_inquiry(
    inquiry: InquiryCreate,
    db_session: Session = Depends(get_session),
    current_user=Depends(get_current_user),
):
    inquiry_data = Inquiry.from_orm(inquiry)
    return create_inquiry_crud(db_session, inquiry_data)


@router.get("/{inquiry_id}", response_model=InquiryRead)
def read_inquiry(
    inquiry_id: int,
    db_session: Session = Depends(get_session),
    current_user=Depends(get_current_user),
):
    inquiry = get_inquiry(db_session, inquiry_id)
    if not inquiry:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    return inquiry


@router.get("/", response_model=List[InquiryRead])
def read_inquiries(
    skip: int = 0,
    limit: int = 10,
    db_session: Session = Depends(get_session),
    current_user=Depends(get_current_user),
):
    return get_inquiries(db_session, skip=skip, limit=limit)


@router.put("/{inquiry_id}", response_model=InquiryRead)
def update_inquiry(
    inquiry_id: int,
    inquiry: InquiryUpdate,
    db_session: Session = Depends(get_session),
    current_user=Depends(get_current_user),
):
    existing_inquiry = get_inquiry(db_session, inquiry_id)
    if not existing_inquiry:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    inquiry_data = inquiry.dict(exclude_unset=True)
    for key, value in inquiry_data.items():
        setattr(existing_inquiry, key, value)
    return update_inquiry_crud(db_session, inquiry_id, existing_inquiry)


@router.delete("/{inquiry_id}", response_model=bool)
def delete_inquiry(
    inquiry_id: int,
    db_session: Session = Depends(get_session),
    current_user=Depends(get_current_user),
):
    if not delete_inquiry_crud(db_session, inquiry_id):
        raise HTTPException(status_code=404, detail="Inquiry not found")
    return True
