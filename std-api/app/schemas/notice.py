from typing import Optional
from sqlmodel import SQLModel, Field
from pydantic import BaseModel

class NoticeCreate(SQLModel):
    notice_type: str = Field(default='center')
    title: str
    content: str
    created_by: str = Field(default=None)

class NoticeUpdate(BaseModel):
    title: str | None = None
    content: str | None = None
    updated_by: str | None = None
