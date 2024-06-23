from typing import Optional

from pydantic import BaseModel
from sqlmodel import SQLModel, Field
from sqlalchemy import Column, DateTime, func
from datetime import date, datetime
from enum import Enum


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str = None


class Role(str, Enum):
    center_director = "center_director"
    teacher = "teacher"

class UserBase(SQLModel):
    username: str # 아이디
    password: str # 비밀번호
    full_name: str # 이름
    email: str # 이메일
    is_active: bool = True # 활성화 여부
    role: str = Field(default=Role.center_director) # 역할

class CenterDirector(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    address: Optional[str] = None # 기관 주소
    position: str # 직급
    mobile_number: str # 휴대폰 전화번호
    office_number: Optional[str] = None # 기관 전화번호
    birthdate: Optional[date] = None # 생년월일
    signature_image: Optional[str] = None  # 서명 이미지
    profile_image: Optional[str] = None # 프로필 이미지
    qualification_number: Optional[str] = None # 자격번호
    receive_alerts: bool = False # 알림 수신 여부(재활,상담,평가기록)
    receive_schedule_alerts: bool = False # 일정 알림 수신 여부
    created_at: Optional[datetime] = Field(
        sa_column=Column(DateTime(timezone=True), server_default=func.now())
    )

    updated_at: Optional[datetime] = Field(
        sa_column=Column(DateTime(timezone=True), onupdate=func.now())
    )
    deleted_at: Optional[datetime] = Field(default=None)

class Teacher(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    company_number: Optional[str] = None # 사번
    address: Optional[str] = None # 주소
    position: str # 직급(호칭)
    mobile_number: str # 휴대폰번호
    office_number: Optional[str] = None # 업무용전화번호
    birthdate: Optional[str] = None # 생년월일
    teacher_role: str # 역할(재활사, 관리자)
    created_at: Optional[datetime] = Field(
        sa_column=Column(DateTime(timezone=True), server_default=func.now())
    )

    updated_at: Optional[datetime] = Field(
        sa_column=Column(DateTime(timezone=True), onupdate=func.now())
    )
    deleted_at: Optional[datetime] = Field(default=None)
