from datetime import date, datetime, time
from enum import Enum
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import Column, DateTime, func
from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from .client import ClientInfo
    from .User import User
    from .program import Program


class ScheduleBase(SQLModel):
    schedule_type: int = Field(default=1, description="일정 유형: 1(재활), 2(상담/평가), 3(기타)")
    teacher_username: str = Field(foreign_key="user.username", max_length=20)
    client_id: int = Field(foreign_key="clientinfo.id")
    start_date: date = Field(default_factory=date.today)
    finish_date: date = Field(default_factory=date.today)
    start_time: str = Field(max_length=5)
    finish_time: str = Field(max_length=5)
    repeat_type: int = Field(default=1, description="반복 유형: 1(매일), 2(매주), 3(매월)")
    repeat_days: Optional[str] = Field(default=None, description="반복 요일 지정: 매주 반복일 경우 사용")
    created_by: Optional[str] = Field(max_length=20, default=None)
    updated_by: Optional[str] = Field(max_length=20, default=None)
    created_at: Optional[datetime] = Field(
        sa_column=Column(DateTime(timezone=True), server_default=func.now())
    )
    updated_at: Optional[datetime] = Field(
        sa_column=Column(DateTime(timezone=True), onupdate=func.now())
    )
    deleted_at: Optional[datetime] = Field(default=None)


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
    teacher: "User" = Relationship(
        back_populates="schedules",
        sa_relationship_kwargs={
            "foreign_keys": "Schedule.teacher_username",
            "primaryjoin": "Schedule.teacher_username == User.username",
        },
    )


class ScheduleListBase(SQLModel):
    title: str = Field(max_length=50)
    teacher_username: str = Field(foreign_key="user.username", max_length=20)
    client_id: int = Field(foreign_key="clientinfo.id")
    program_id: int = Field(foreign_key="program.id")
    schedule_date: date = Field(default_factory=date.today)
    schedule_time: str = Field(max_length=5)
    schedule_finish_time: str = Field(max_length=5)
    schedule_status: str = Field(
        max_length=1,
        default="1",
        description="스케줄 상태: 1(예약), 2(완료), 3(취소), 4(노쇼), 5(보류)"
    )
    schedule_memo: Optional[str] = Field(max_length=255, default=None)
    created_by: Optional[str] = Field(max_length=20, default=None)
    updated_by: Optional[str] = Field(max_length=20, default=None)
    created_at: Optional[datetime] = Field(
        sa_column=Column(DateTime(timezone=True), server_default=func.now())
    )
    updated_at: Optional[datetime] = Field(
        sa_column=Column(DateTime(timezone=True), onupdate=func.now())
    )
    deleted_at: Optional[datetime] = Field(default=None)
    schedule_id: int = Field(foreign_key="schedule.id")


class ScheduleList(ScheduleListBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    schedule: Schedule = Relationship(back_populates="schedule_list")
    clientinfo: "ClientInfo" = Relationship(back_populates="schedulelists")
    teacher: "User" = Relationship(back_populates="schedulelists")
    program: "Program" = Relationship(back_populates="schedulelists")
