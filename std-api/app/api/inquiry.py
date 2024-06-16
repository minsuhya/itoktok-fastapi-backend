from typing import List, Union

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, desc, select

from ..core import get_session
from ..models.inquiry import Inquiry
from ..schemas.inquiry import InquiryCreate, InquiryUpdate, InquiryRead
from ..crud.inquiry import create_inquiry, get_inquiry, get_inquiries, update_inquiry, delete_inquiry
from ..schemas import ErrorResponse, SuccessResponse

router = APIRouter(
    prefix="/inquiries",
    tags=["inquiries"],
    dependencies=[Depends(get_session)],
    responses={404: {
        "description": "API Not found"
    }},
)

@router.post("/inquiries/", response_model=InquiryRead)
def create_inquiry(inquiry: InquiryCreate, db_session: Session = Depends(get_session)):
    inquiry_data = Inquiry.from_orm(inquiry)
    return create_inquiry(db_session, inquiry_data)

@router.get("/inquiries/{inquiry_id}", response_model=InquiryRead)
def read_inquiry(inquiry_id: int, db_session: Session = Depends(get_session)):
    inquiry = get_inquiry(db_session, inquiry_id)
    if not inquiry:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    return inquiry

@router.get("/inquiries/", response_model=List[InquiryRead])
def read_inquiries(skip: int = 0, limit: int = 10, db_session: Session = Depends(get_session)):
    return get_inquiries(db_session, skip=skip, limit=limit)

@router.put("/inquiries/{inquiry_id}", response_model=InquiryRead)
def update_inquiry(inquiry_id: int, inquiry: InquiryUpdate, db_session: Session = Depends(get_session)):
    existing_inquiry = get_inquiry(db_session, inquiry_id)
    if not existing_inquiry:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    inquiry_data = inquiry.dict(exclude_unset=True)
    for key, value in inquiry_data.items():
        setattr(existing_inquiry, key, value)
    return update_inquiry(db_session, inquiry_id, existing_inquiry)

@router.delete("/inquiries/{inquiry_id}", response_model=bool)
def delete_inquiry(inquiry_id: int, db_session: Session = Depends(get_session)):
    if not delete_inquiry(db_session, inquiry_id):
        raise HTTPException(status_code=404, detail="Inquiry not found")
    return True
