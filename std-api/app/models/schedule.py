from datetime import date, datetime, time
from enum import Enum
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import Column, DateTime, func
from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from .client import ClientInfo
    from .User import User


class ScheduleType(str, Enum):
    rehabilitation = "재활"
    counseling_evaluation = "상담/평가"
    others = "기타"


class ScheduleBase(SQLModel):
    teacher_username: str = Field(
        foreign_key="user.username", max_length=20, nullable=False
    )
    client_id: int = Field(foreign_key="clientinfo.id", nullable=False)
    title: str = Field(max_length=50, nullable=False)
    start_date: date = Field(default_factory=date.today)
    finish_date: date = Field(default_factory=date.today)
    start_time: str = Field(max_length=5, nullable=False)
    finish_time: str = Field(max_length=5, nullable=False)
    memo: Optional[str] = Field(max_length=255, default=None)
    created_by: Optional[str] = Field(max_length=20, default=None)
    updated_by: Optional[str] = Field(max_length=20, default=None)
    created_at: Optional[datetime] = Field(
        sa_column=Column(DateTime(timezone=True), server_default=func.now())
    )

    updated_at: Optional[datetime] = Field(
        sa_column=Column(DateTime(timezone=True), onupdate=func.now())
    )
    deleted_at: Optional[datetime] = Field(default=None, nullable=True)


class Schedule(ScheduleBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    schedule_list: List["ScheduleList"] = Relationship(back_populates="schedule")
    clientinfo: "ClientInfo" = Relationship(
        back_populates="schedule",
        sa_relationship_kwargs={
            "foreign_keys": "Schedule.client_id",
            "primaryjoin": "Schedule.client_id == ClientInfo.id",
        },
    )
    # 상담사 정보
    teacher: "User" = Relationship(
        back_populates="schedules",
        sa_relationship_kwargs={
            "foreign_keys": "Schedule.teacher_username",
            "primaryjoin": "Schedule.teacher_username == User.username",
        },
    )


class ScheduleListBase(SQLModel):
    schedule_date: date = Field(default_factory=date.today)
    schedule_time: str = Field(max_length=5, nullable=False)
    schedule_status: str = Field(
        max_length=1,
        default="1",
        nullable=False,
        description="스케줄 상태: 1(상담예약), 2(상담완료), 3(예약취소), 4(노쇼)",
    )
    schedule_memo: str = Field(default="", nullable=False, description="상담일지")
    created_at: Optional[datetime] = Field(
        sa_column=Column(DateTime(timezone=True), server_default=func.now())
    )

    updated_at: Optional[datetime] = Field(
        sa_column=Column(DateTime(timezone=True), onupdate=func.now())
    )
    deleted_at: Optional[datetime] = Field(default=None, nullable=True)


class ScheduleList(ScheduleListBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    schedule_id: int = Field(foreign_key="schedule.id", nullable=False)
    schedule: Schedule = Relationship(back_populates="schedule_list")
