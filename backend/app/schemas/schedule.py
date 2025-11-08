from datetime import date, datetime, timezone, timedelta
from typing import List, Optional, Union, Annotated

from pydantic import BaseModel, Field

from .client import ClientInfoRead
from .user import UserRead
from .program import ProgramRead

# Forward references 정의
ScheduleRead = Annotated[BaseModel, Field(title="ScheduleRead")]
ScheduleListRead = Annotated[BaseModel, Field(title="ScheduleListRead")]

# Schedule Padatic Model
class ScheduleBase(BaseModel):
    schedule_type: Union[int, str] = Field(
        default=1,
        description="일정 유형: 1(재활), 2(상담/평가), 3(기타)"
    )
    teacher_username: str = Field(..., max_length=20)
    client_id: int
    start_date: date = Field(default_factory=date.today)
    finish_date: date = Field(default_factory=date.today)
    start_time: str = Field(..., max_length=5)
    finish_time: str = Field(..., max_length=5)
    repeat_type: Union[int, str] = Field(
        default=1,
        description="반복 유형: 1(매일), 2(매주), 3(매월)"
    )
    repeat_days: Optional[Union[str, dict]] = Field(
        default_factory=lambda: {
            "mon": False, "tue": False, "wed": False,
            "thu": False, "fri": False, "sat": False, "sun": False
        }
    )

    memo: Optional[str] = None # 메모
    client_name: Optional[str] = None # 내담자 이름
    phone_number: Optional[str] = None # 내담자 전화번호
    program_id: Optional[int] = None # 프로그램 아이디

    created_by: Optional[str] = None
    updated_by: Optional[str] = None
    deleted_at: Optional[datetime] = None


class ScheduleCreate(ScheduleBase):
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone(timedelta(hours=9))).replace(microsecond=0)
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone(timedelta(hours=9))).replace(microsecond=0)
    )
    class Config:
        # None 값을 제외하고 실제 값만 포함하도록 설정
        exclude_unset = True
        exclude_none = True
        json_schema_extra = {
            "example": {
                "teacher_username": "rupi",
                "client_id": 7,
                "client_name": "내담자4",
                "program_id": 1,
                "repeat_type": "1",
                "repeat_days": {
                    "mon": False,
                    "tue": False,
                    "wed": False,
                    "thu": False,
                    "fri": False,
                    "sat": False,
                    "sun": False
                },
                "start_date": "2025-02-04",
                "finish_date": "2025-02-07",
                "start_time": "17:50",
                "finish_time": "18:40",
                "memo": "메모입니다.",
                "phone_number": "01028324953"
            }
        }


class ScheduleRead(BaseModel):
    id: int
    teacher_username: str
    client_id: int
    schedule_type: Union[int, str]
    start_date: date
    finish_date: date
    start_time: str
    finish_time: str
    repeat_type: Union[int, str]
    repeat_days: Optional[Union[str, dict]] = None
    memo: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    schedule_list: List[ScheduleListRead] = []

    model_config = {
        "from_attributes": True
    }


class ScheduleUpdate(ScheduleBase):
    schedule_status: str = Field(
        max_length=1,
        default="1",
        description="스케줄 상태: 1(예약), 2(완료), 3(취소), 4(노쇼), 5(보류)"
    )
    update_range: str = Field(
        default="single",
        description="수정 범위: single(이번 일정만 변경), all(이후 반복일정 모두 변경)"
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone(timedelta(hours=9))).replace(microsecond=0)
    )


# ScheduleList Padatic Model
class ScheduleListBase(BaseModel):
    title: Optional[str] = None
    teacher_username: str
    client_id: int
    program_id: int
    schedule_date: date = Field(default_factory=date.today)
    schedule_time: str
    schedule_finish_time: str
    schedule_status: str = Field(
        max_length=1,
        default="1",
        description="스케줄 상태: 1(예약), 2(완료), 3(취소), 4(노쇼), 5(보류)"
    )
    schedule_memo: Optional[str] = None
    created_by: Optional[str] = None
    updated_by: Optional[str] = None
    deleted_at: Optional[datetime] = None


class ScheduleListCreate(ScheduleListBase):
    schedule_id: Optional[int] = None
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone(timedelta(hours=9))).replace(microsecond=0)
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone(timedelta(hours=9))).replace(microsecond=0)
    )


class ScheduleListRead(BaseModel):
    id: int
    schedule_id: int
    title: Optional[str] = None
    teacher_username: str
    client_id: int
    program_id: int
    schedule_date: date
    schedule_time: str
    schedule_finish_time: str
    schedule_status: str
    schedule_memo: Optional[str] = None
    created_by: Optional[str] = None
    updated_by: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    schedule: Optional[ScheduleRead] = None
    clientinfo: Optional[ClientInfoRead] = None
    teacher: Optional[UserRead] = None
    program: Optional[ProgramRead] = None

    model_config = {
        "from_attributes": True
    }


class ScheduleListUpdate(ScheduleListBase):
    update_range: str = Field(
        default="single",
        description="수정 범위: single(이번 일정만 변경), all(이후 반복일정 모두 변경)"
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone(timedelta(hours=9))).replace(microsecond=0)
    )