from sqlmodel import SQLModel, Field
from typing import Optional
from enum import Enum
from datetime import datetime

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
    created_at: datetime = Field(default_factory=datetime.utcnow)
