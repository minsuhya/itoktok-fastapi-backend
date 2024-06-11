from typing import Optional
from sqlmodel import SQLModel
from pydantic import BaseModel

class NoticeCreate(SQLModel):
    notice_type: str
    title: str
    content: str

class NoticeUpdate(BaseModel):
    title: str | None = None
    content: str | None = None
