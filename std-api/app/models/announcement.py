from sqlmodel import SQLModel, Field
from typing import Optional
from enum import Enum
from datetime import datetime

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
    created_at: datetime = Field(default_factory=datetime.utcnow)
    attachment_url: Optional[str] = None
