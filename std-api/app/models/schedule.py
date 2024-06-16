from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import date, time
from enum import Enum

class ScheduleType(str, Enum):
    rehabilitation = "재활"
    counseling_evaluation = "상담/평가"
    others = "기타"

class Schedule(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    schedule_type: str = Field(default=ScheduleType.rehabilitation)
    teacher_id: int
    user_id: int
    program_id: int
    date: date
    start_time: time
    end_time: time
    note: Optional[str] = None
