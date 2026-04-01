from datetime import datetime, timezone
from typing import Optional

from pydantic import BaseModel, EmailStr, Field, validator


# User Schema
class UserBaseSchema(BaseModel):
    username: str
    email: EmailStr
    full_name: str
    birth_date: Optional[str] = ""
    zip_code: Optional[str] = ""
    address: Optional[str] = ""
    address_extra: Optional[str] = ""
    phone_number: Optional[str] = ""
    hp_number: str
    user_type: str  # 사용자 타입 (1: 센터, 2: 상담사)
    center_username: Optional[str] = ""
    is_active: int = 1  # 사용자 활성화 여부 (0: 비활성화, 1: 활성화)
    is_superuser: Optional[int] = 0  # 관리자 여부 (0: 일반 사용자, 1: 관리자)
    usercolor: str = "#a668e3"  # 일정 색상
    expertise: Optional[str] = ""  # 전문분야
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

    @validator(
        "birth_date",
        "zip_code",
        "address",
        "address_extra",
        "phone_number",
        "center_username",
        "expertise",
        pre=True,
        always=True,
    )
    def normalize_optional_strings(cls, v):
        if v is None:
            return ""
        return v


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
