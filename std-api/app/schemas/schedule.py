from datetime import date, datetime, timezone
from typing import List, Optional

from pydantic import BaseModel, Field

from .client import ClientInfoRead
from .user import UserRead


# Schedule Padatic Model
class ScheduleBase(BaseModel):
    teacher_username: str
    client_id: int
    title: str
    start_date: date = Field(default_factory=date.today)
    finish_date: date = Field(default_factory=date.today)
    start_time: str
    finish_time: str
    memo: Optional[str] = None
    created_by: Optional[str] = None
    updated_by: Optional[str] = None
    deleted_at: Optional[datetime] = None


class ScheduleCreate(ScheduleBase):
    created_at: Optional[datetime] = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    updated_at: Optional[datetime] = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )


class ScheduleRead(ScheduleBase):
    id: int
    created_at: datetime
    updated_at: datetime
    # schedule_list: List["ScheduleListRead"] = []
    teacher: Optional["UserRead"] = None  # Reverse relationship
    clientinfo: Optional["ClientInfoRead"] = None  # Reverse relationship

    class Config:
        from_attributes = True


class ScheduleUpdate(ScheduleBase):
    updated_at: Optional[datetime] = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )


# ScheduleList Padatic Model
class ScheduleListBase(BaseModel):
    schedule_date: date = Field(default_factory=date.today)
    schedule_time: str
    schedule_status: str = Field(
        max_length=1,
        default="1",
        description="스케줄 상태: 1(상담예약), 2(상담완료), 3(예약취소), 4(노쇼)",
    )
    schedule_memo: str = Field(default="", description="상담일지")
    deleted_at: Optional[datetime] = None


class ScheduleListCreate(ScheduleListBase):
    schedule_id: int
    created_at: Optional[datetime] = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    updated_at: Optional[datetime] = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )


class ScheduleListRead(ScheduleListBase):
    id: int
    schedule_id: int
    created_at: datetime
    updated_at: datetime
    schedule: Optional["ScheduleRead"] = None  # Reverse relationship

    class Config:
        from_attributes = True


class ScheduleListUpdate(ScheduleListBase):
    updated_at: Optional[datetime] = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )


# Forward reference 해결
ScheduleRead.update_forward_refs()
ScheduleListRead.update_forward_refs()
