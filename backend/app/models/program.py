from datetime import datetime
from typing import TYPE_CHECKING, Optional, List
from sqlmodel import Field, SQLModel, Relationship
from sqlalchemy import Column, DateTime, func, String, Text, Integer, DECIMAL, Boolean
from zoneinfo import ZoneInfo

if TYPE_CHECKING:
    from .user import CenterInfo, User
    from .schedule import Schedule

SEOUL_TZ = ZoneInfo("Asia/Seoul")

class ProgramBase(SQLModel):
    program_name: str = Field(max_length=50, index=True)
    program_type: str = Field(max_length=50, index=True)
    category: str = Field(max_length=50, default='')
    teacher_username: Optional[str] = Field(foreign_key='user.username', max_length=25, default=None)
    description: str = Field(sa_column=Column(Text, default=''))
    duration: int = Field(default=60)
    max_participants: int = Field(default=1)
    price: float = Field(default=0.00, sa_column=Column(DECIMAL(10,2)))
    is_all_teachers: bool = Field(default=False, sa_column=Column(Boolean))
    is_active: bool = Field(default=True, sa_column=Column(Boolean))
    center_username: str = Field(
        default='', foreign_key="centerinfo.username", max_length=25, nullable=False
    )  # 센터아이디


class Program(ProgramBase, table=True):
    __tablename__ = "program"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(
        sa_column=Column(
            DateTime(timezone=True),
            server_default=func.now(),
            nullable=False
        )
    )
    updated_at: datetime = Field(
        sa_column=Column(
            DateTime(timezone=True),
            server_default=func.now(),
            onupdate=func.now(),
            nullable=False
        )
    )
    deleted_at: Optional[datetime] = Field(
        sa_column=Column(
            DateTime(timezone=True),
            nullable=True
        )
    )

    # 센터 정보
    center_info: Optional["CenterInfo"] = Relationship(back_populates="programs")

    # 담당선생님 정보
    teacher: Optional["User"] = Relationship(back_populates="programs")

    # 스케줄 정보
    schedules: List["Schedule"] = Relationship(back_populates="program")

    @staticmethod
    def get_current_time():
        return datetime.now(SEOUL_TZ)
    
    class Config:
        from_attributes = True
        arbitrary_types_allowed = True

