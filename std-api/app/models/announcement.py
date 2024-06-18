from sqlmodel import SQLModel, Field
from sqlalchemy import Column, DateTime, func
from typing import Optional
from datetime import datetime
from enum import Enum

class AnnouncementType(str, Enum):
    center_notice = "센터 공지사항"
    customer_notice = "고객 공지사항"
    data_room = "자료실"

class AnnouncementCategory(str, Enum):
    important = "중요공지"
    guidance = "지침"
    form = "양식"

class Announcement(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    is_important: bool = False
    category: str = Field(default=AnnouncementCategory.important)
    content: str
    announcement_type: str = Field(default=AnnouncementType.center_notice)
    end_date: Optional[datetime] = None
    attachment_url: Optional[str] = None
    created_at: Optional[datetime] = Field(
        sa_column=Column(DateTime(timezone=True), server_default=func.now())
    )

    updated_at: Optional[datetime] = Field(
        sa_column=Column(DateTime(timezone=True), onupdate=func.now())
    )
    deleted_at: Optional[datetime] = Field(default=None)
