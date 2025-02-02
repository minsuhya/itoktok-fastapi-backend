from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from zoneinfo import ZoneInfo

from .user import UserRead

SEOUL_TZ = ZoneInfo("Asia/Seoul")

class ProgramBase(BaseModel):
    program_name: str = Field(..., max_length=50)
    program_type: str = Field(..., max_length=50)
    category: Optional[str] = Field(default='', max_length=50)
    teacher_username: Optional[str] = Field(default=None, max_length=25)
    description: Optional[str] = Field(default='')
    duration: Optional[int] = Field(default=60)
    max_participants: Optional[int] = Field(default=1)
    price: Optional[float] = Field(default=0.00)
    is_all_teachers: bool = Field(default=False)
    is_active: Optional[bool] = Field(default=True)
    deleted_at: Optional[datetime] = None

class ProgramCreate(ProgramBase):
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(SEOUL_TZ)
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(SEOUL_TZ)
    )

class ProgramUpdate(BaseModel):
    program_name: Optional[str] = Field(default=None, max_length=50)
    program_type: Optional[str] = Field(default=None, max_length=50)
    category: Optional[str] = Field(default=None, max_length=50)
    teacher_username: Optional[str] = Field(default=None, max_length=25)
    description: Optional[str] = None
    duration: Optional[int] = None
    max_participants: Optional[int] = None
    price: Optional[float] = None
    is_all_teachers: Optional[bool] = None
    is_active: Optional[bool] = None
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(SEOUL_TZ)
    )

    class Config:
        exclude_unset = True

class ProgramRead(ProgramBase):
    id: int
    created_at: datetime
    updated_at: datetime
    teacher: Optional["UserRead"] = None

    class Config:
        from_attributes = True
