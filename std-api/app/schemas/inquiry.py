from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from ..models.inquiry import InquiryType

class InquiryCreate(BaseModel):
    inquiry_type: InquiryType
    title: str
    content: str

class InquiryUpdate(BaseModel):
    inquiry_type: Optional[InquiryType] = None
    title: Optional[str] = None
    content: Optional[str] = None

class InquiryRead(BaseModel):
    id: int
    inquiry_type: InquiryType
    title: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True
