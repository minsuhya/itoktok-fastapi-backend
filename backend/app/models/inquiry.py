from sqlmodel import SQLModel, Field
from sqlalchemy import Column, DateTime, func
from typing import Optional
from datetime import datetime
from enum import Enum

class InquiryType(str, Enum):
    service_inquiry = "서비스문의"
    error_suggestion = "오류/개선사항"
    complaint = "불만사항"
    proposal = "제안사항"
    alert_request = "알림톡/문자신청"

class Inquiry(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    inquiry_type: str = Field(default=InquiryType.service_inquiry)
    title: str
    content: str
    created_at: Optional[datetime] = Field(
        sa_column=Column(DateTime(timezone=True), server_default=func.now())
    )

    updated_at: Optional[datetime] = Field(
        sa_column=Column(DateTime(timezone=True), onupdate=func.now())
    )
    deleted_at: Optional[datetime] = Field(default=None)
