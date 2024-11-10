from datetime import date, datetime
from enum import Enum
from typing import TYPE_CHECKING, List, Optional

from pydantic import BaseModel
from sqlalchemy import Column, DateTime, func
from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from .client import ClientInfo
    from .schedule import Schedule
    from .program import Program


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str = None


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(max_length=20, nullable=False, unique=True)  # 아이디
    password: str = Field(max_length=20, nullable=False)  # 비밀번호
    email: str = Field(max_length=50, nullable=False)  # 이메일
    full_name: str = Field(max_length=20, nullable=False)  # 이름
    birth_date: str = Field(max_length=10, nullable=True)  # 생년월일
    zip_code: str = Field(default="", nullable=True)  # 우편번호
    address: str = Field(default="", nullable=True)  # 주소
    address_extra: str = Field(default="", nullable=True)  # 상세주소
    phone_number: str = Field(default="", max_length=15, nullable=True)  # 전화번호
    hp_number: str = Field(..., max_length=15, nullable=False)  # 휴대폰번호
    center_username: str = Field(
        ..., foreign_key="centerinfo.username", max_length=20, nullable=False
    )  # 센터아이디
    user_type: str = Field(
        default="1", max_length=1, nullable=False
    )  # 사용자 타입 (1: 센터, 2: 상담사)
    is_active: int = Field(
        default=1, nullable=False
    )  # 활성화 여부 0: 비활성화, 1: 활성화
    is_superuser: int = Field(
        default=0, nullable=False
    )  # 관리자 여부 0: 일반, 1: 관리자
    usercolor: str = Field(default="#a668e3", max_length=7, nullable=False)  # 일정 색상
    expertise: str = Field(default="", max_length=30, nullable=False)  # 전문분야

    created_at: Optional[datetime] = Field(
        sa_column=Column(DateTime(timezone=True), server_default=func.now())
    )

    updated_at: Optional[datetime] = Field(
        sa_column=Column(DateTime(timezone=True), onupdate=func.now())
    )
    deleted_at: Optional[datetime] = Field(default=None)

    # 내담자 정보
    client_infos: List["ClientInfo"] = Relationship(back_populates="consultant_info")
    # 센터 정보
    center_info: Optional["CenterInfo"] = Relationship(back_populates="users")
    # 스케줄 정보
    schedules: List["Schedule"] = Relationship(back_populates="teacher")
    # 프로그램 정보
    programs: List["Program"] = Relationship(back_populates="teacher")


class CenterInfo(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(
        max_length=20, nullable=False, unique=True, description="Center Username"
    )
    center_name: str = Field(max_length=20, nullable=False, description="센터명")
    center_summary: str = Field(
        max_length=100, nullable=False, description="센터 한줄소개"
    )
    center_introduce: str = Field(
        max_length=255, nullable=False, description="센터 소개"
    )
    center_export: str = Field(max_length=50, nullable=False, description="전문분야")
    center_addr: str = Field(max_length=255, nullable=False, description="센터주소")
    center_tel: str = Field(max_length=15, nullable=False, description="센터전화번호")

    created_at: Optional[datetime] = Field(
        sa_column=Column(DateTime(timezone=True), server_default=func.now())
    )

    updated_at: Optional[datetime] = Field(
        sa_column=Column(DateTime(timezone=True), onupdate=func.now())
    )
    deleted_at: Optional[datetime] = Field(default=None)

    # 사용자 정보
    users: List["User"] = Relationship(back_populates="center_info")
    # 프로그램 정보
    programs: List["Program"] = Relationship(back_populates="center_info")


class Role(str, Enum):
    center_director = "center_director"
    teacher = "teacher"


class UserBase(SQLModel):
    username: str  # 아이디
    password: str  # 비밀번호
    full_name: str  # 이름
    email: str  # 이메일
    is_active: bool = True  # 활성화 여부
    role: str = Field(default=Role.center_director)  # 역할


class CenterDirector(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    address: Optional[str] = None  # 기관 주소
    position: str  # 직급
    mobile_number: str  # 휴대폰 전화번호
    office_number: Optional[str] = None  # 기관 전화번호
    birthdate: Optional[date] = None  # 생년월일
    signature_image: Optional[str] = None  # 서명 이미지
    profile_image: Optional[str] = None  # 프로필 이미지
    qualification_number: Optional[str] = None  # 자격번호
    receive_alerts: bool = False  # 알림 수신 여부(재활,상담,평가기록)
    receive_schedule_alerts: bool = False  # 일정 알림 수신 여부
    created_at: Optional[datetime] = Field(
        sa_column=Column(DateTime(timezone=True), server_default=func.now())
    )

    updated_at: Optional[datetime] = Field(
        sa_column=Column(DateTime(timezone=True), onupdate=func.now())
    )
    deleted_at: Optional[datetime] = Field(default=None)


class Teacher(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    company_number: Optional[str] = None  # 사번
    address: Optional[str] = None  # 주소
    position: str  # 직급(호칭)
    mobile_number: str  # 휴대폰번호
    office_number: Optional[str] = None  # 업무용전화번호
    birthdate: Optional[date] = None  # 생년월일
    teacher_role: str  # 역할(재활사, 관리자)
    created_at: Optional[datetime] = Field(
        sa_column=Column(DateTime(timezone=True), server_default=func.now())
    )

    updated_at: Optional[datetime] = Field(
        sa_column=Column(DateTime(timezone=True), onupdate=func.now())
    )
    deleted_at: Optional[datetime] = Field(default=None)
