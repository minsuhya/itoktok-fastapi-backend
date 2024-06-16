from pydantic import BaseModel
from typing import Optional
from datetime import date, time
from ..models.schedule import ScheduleType

class ScheduleCreate(BaseModel):
    schedule_type: ScheduleType
    teacher_id: int
    user_id: int
    program_id: int
    date: date
    start_time: time
    end_time: time
    note: Optional[str] = None

class ScheduleUpdate(BaseModel):
    schedule_type: Optional[ScheduleType] = None
    teacher_id: Optional[int] = None
    user_id: Optional[int] = None
    program_id: Optional[int] = None
    date: Optional[str] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    note: Optional[str] = None

class ScheduleRead(BaseModel):
    id: int
    schedule_type: ScheduleType
    teacher_id: int
    user_id: int
    program_id: int
    date: date
    start_time: time
    end_time: time
    note: Optional[str] = None

    class Config:
        orm_mode = True
