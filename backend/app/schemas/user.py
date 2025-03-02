from datetime import date, datetime, timezone
from enum import Enum
from typing import Optional

from pydantic import BaseModel, EmailStr, Field, validator


class Role(str, Enum):
    center_director = "center_director"
    teacher = "teacher"


# User Schema
class UserBaseSchema(BaseModel):
    username: str
    email: EmailStr
    full_name: str
    birth_date: Optional[str] = None
    zip_code: Optional[str] = None
    address: Optional[str] = None
    address_extra: Optional[str] = None
    phone_number: Optional[str] = None
    hp_number: str
    user_type: str  # 사용자 타입 (1: 센터, 2: 상담사)
    center_username: str
    is_active: int = 1  # 사용자 활성화 여부 (0: 비활성화, 1: 활성화)
    is_superuser: Optional[int] = 0  # 관리자 여부 (0: 일반 사용자, 1: 관리자)
    usercolor: str = "#a668e3"  # 일정 색상
    expertise: str  # 전문분야
    deleted_at: Optional[datetime] = None

    @validator("is_superuser", pre=True, always=True)
    def validate_is_superuser(cls, v):
        if v == "":
            return 0
        if isinstance(v, str) and v.isdigit():
            return int(v)
        if isinstance(v, int):
            return v
        raise ValueError(
            "Input should be a valid integer or a string that can be parsed as an integer"
        )


class UserCreate(UserBaseSchema):
    password: str = Field(default="", max_length=15)
    created_at: Optional[datetime] = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    updated_at: Optional[datetime] = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )


class UserUpdate(UserBaseSchema):
    password: Optional[str | None] = None
    updated_at: Optional[datetime] = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )


class UserRead(UserBaseSchema):
    id: int
    created_at: datetime
    updated_at: datetime
    center_info: Optional["CenterInfoRead"] = None

    class Config:
        from_attributes = True


# CenterInfo Schema
class CenterInfoBase(BaseModel):
    username: str = Field(..., max_length=20, description="Center Username")
    center_name: str = Field(..., max_length=20, description="센터명")
    center_summary: str = Field(..., max_length=100, description="센터 한줄소개")
    center_introduce: str = Field(..., max_length=255, description="센터 소개")
    center_export: str = Field(..., max_length=50, description="전문분야")
    center_addr: str = Field(..., max_length=255, description="센터주소")
    center_tel: str = Field(..., max_length=15, description="센터전화번호")


class CenterInfoCreate(CenterInfoBase):
    created_at: Optional[datetime] = datetime.now()
    updated_at: Optional[datetime] = datetime.now()


class CenterInfoUpdate(CenterInfoBase):
    updated_at: Optional[datetime] = datetime.now()


class CenterInfoRead(CenterInfoBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime]
    deleted_at: Optional[datetime]

    class Config:
        from_attributes = True


# CenterDirector Schema
class CenterDirectorCreate(BaseModel):
    username: str
    password: str
    full_name: str
    email: EmailStr
    address: Optional[str] = None
    position: str
    mobile_number: str
    office_number: Optional[str] = None
    birthdate: Optional[date] = None
    signature_image: Optional[str] = None
    profile_image: Optional[str] = None
    qualification_number: Optional[str] = None
    receive_alerts: bool = False
    receive_schedule_alerts: bool = False
    created_at: Optional[datetime] = datetime.now()
    updated_at: Optional[datetime] = datetime.now()
    deleted_at: Optional[datetime] = None


class CenterDirectorRead(UserBaseSchema):
    id: int
    address: Optional[str] = None
    position: str
    mobile_number: str
    office_number: Optional[str] = None
    birthdate: Optional[date] = None
    signature_image: Optional[str] = None
    profile_image: Optional[str] = None
    qualification_number: Optional[str] = None
    receive_alerts: bool = False
    receive_schedule_alerts: bool = False


class CenterDirectorUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    address: Optional[str] = None
    position: Optional[str] = None
    mobile_number: Optional[str] = None
    office_number: Optional[str] = None
    birthdate: Optional[date] = None
    signature_image: Optional[str] = None
    profile_image: Optional[str] = None
    qualification_number: Optional[str] = None
    receive_alerts: Optional[bool] = None
    receive_schedule_alerts: Optional[bool] = None


class TeacherCreate(BaseModel):
    username: str
    password: str
    full_name: str
    email: EmailStr
    company_number: Optional[str] = None
    address: Optional[str] = None
    position: str
    mobile_number: str
    office_number: Optional[str] = None
    birthdate: Optional[date] = None
    profile_image: Optional[str] = None
    teacher_role: str
    created_at: Optional[datetime] = datetime.now()
    updated_at: Optional[datetime] = datetime.now()
    deleted_at: Optional[datetime] = None


class TeacherRead(UserBaseSchema):
    id: int
    company_number: Optional[str] = None
    address: Optional[str] = None
    position: str
    mobile_number: str
    office_number: Optional[str] = None
    birthdate: Optional[date] = None
    profile_image: Optional[str] = None
    teacher_role: str


class TeacherUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    company_number: Optional[str] = None
    address: Optional[str] = None
    position: Optional[str] = None
    mobile_number: Optional[str] = None
    office_number: Optional[str] = None
    birthdate: Optional[date] = None
    profile_image: Optional[str] = None
    teacher_role: Optional[str] = None


class UserSearchSelectedTeacherBase(BaseModel):
    username: str
    selected_teacher: str


class UserSearchSelectedTeacherCreate(BaseModel):
    username: Optional[str] = None
    selected_teacher: str
    pass


class UserSearchSelectedTeacherUpdate(BaseModel):
    username: Optional[str] = None
    selected_teacher: str
    updated_at: Optional[datetime] = None


class UserSearchSelectedTeacherRead(UserSearchSelectedTeacherBase):
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    deleted_at: Optional[datetime] = None

    class Config:
        from_attributes = True