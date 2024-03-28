from typing import Optional

from sqlmodel import Field, SQLModel


# 일정 모델
class ScheduleBase(SQLModel):
    teacher_username: str = Field(index=True)  # 교사 아이디
    student_username: str = Field(index=True)  # 학생 아이디
    program_id: int = Field(...)  # 프로그램 ID
    program_type: str = Field(...)  # 프로그램 타입
    start_date: str = Field(...)  # 시작일
    finish_date: str = Field(...)  # 시작일
    start_time: str = Field(...)  # 시작시간
    finish_time: str = Field(...)  # 종료시간
    loop: bool = Field(default=False)  # 반복
    memo: str = Field(default=None)  # 메모
    created_by: str = Field(default=None)  # 생성자
    updated_by: str = Field(default=None)  # 수정자
    created_at: str = Field(default=None)  # 생성일
    updated_at: str = Field(default=None)  # 수정일
    deleted_at: str = Field(default=None)  # 삭제일


class ScheduleCreate(ScheduleBase):
    pass


class ScheduleUpdate(SQLModel):
    teacher_username: Optional[str] = None  # 교사 아이디
    student_username: Optional[str] = None  # 학생 아이디
    program_id: int = None  # 프로그램 ID
    program_type: Optional[str] = None  # 프로그램 타입
    start_date: Optional[str] = None  # 시작일
    start_time: Optional[str] = None  # 시작시간
    finish_time: Optional[str] = None  # 종료시간
    loop: Optional[bool] = None  # 반복
    memo: Optional[str] = None  # 메모
    created_by: Optional[str] = None  # 생성자
    updated_by: Optional[str] = None  # 수정자
    created_at: Optional[str] = None  # 생성일
    updated_at: Optional[str] = None  # 수정일
    deleted_at: Optional[str] = None  # 삭제일
