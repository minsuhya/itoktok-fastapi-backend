from typing import Optional
from enum import Enum

from sqlmodel import Field, SQLModel
from sqlalchemy.sql import func
from sqlalchemy import Column, DateTime
from datetime import datetime

class ProgramCategory(str, Enum):
    rehabilitation = "재활"
    evaluation = "평가"
    counseling = "상담"
    others = "기타"

class ProgramMethod(str, Enum):
    individual = "개인"
    group = "그룹"

class ProgramLocation(str, Enum):
    internal = "기관"
    home = "재가"
    external = "외부기관"

class ProgramStatus(str, Enum):
    normal = "정상"
    suspended = "중단"

class Program(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    category: str = Field(default=ProgramCategory.rehabilitation)
    program_type: str
    program_name: str
    method: str = Field(default=ProgramMethod.individual)
    location: str = Field(default=ProgramLocation.internal)
    teacher_id: Optional[int] = None
    price: Optional[float] = None
    base_price: Optional[float] = None
    status: str = Field(default=ProgramStatus.normal)
    created_at: Optional[datetime] = Field(
        sa_column=Column(DateTime(timezone=True), server_default=func.now())
    )

    updated_at: Optional[datetime] = Field(
        sa_column=Column(DateTime(timezone=True), onupdate=func.now())
    )
    deleted_at: Optional[datetime] = Field(default=None)
