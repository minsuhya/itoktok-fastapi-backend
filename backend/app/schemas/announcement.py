from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from ..models.announcement import AnnouncementType, AnnouncementCategory

class AnnouncementCreate(BaseModel):
    title: str
    is_important: bool = False
    category: AnnouncementCategory
    content: str
    announcement_type: AnnouncementType
    end_date: Optional[datetime] = None
    attachment_url: Optional[str] = None

class AnnouncementUpdate(BaseModel):
    title: Optional[str] = None
    is_important: Optional[bool] = None
    category: Optional[AnnouncementCategory] = None
    content: Optional[str] = None
    announcement_type: Optional[AnnouncementType] = None
    end_date: Optional[datetime] = None
    attachment_url: Optional[str] = None

class AnnouncementRead(BaseModel):
    id: int
    title: str
    is_important: bool
    category: AnnouncementCategory
    content: str
    announcement_type: AnnouncementType
    end_date: Optional[datetime]
    created_at: datetime
    attachment_url: Optional[str]

    class Config:
        from_attributes = True
