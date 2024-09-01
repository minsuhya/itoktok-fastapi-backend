from datetime import date, datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class Role(str, Enum):
    center_director = "center_director"
    teacher = "teacher"


# User Schema
class UserBaseSchema(BaseModel):
    username: str
    full_name: str
    email: EmailStr
    user_type: str
    is_active: bool
    is_superuser: bool
    created_at: Optional[datetime] = datetime.now()
    updated_at: Optional[datetime] = datetime.now()
    deleted_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class UserCreate(BaseModel):
    username: str
    password: str
    email: EmailStr
    full_name: str
    birth_date: Optional[str] = None
    zip_code: Optional[str] = None
    address: Optional[str] = None
    address_extra: Optional[str] = None
    phone_number: Optional[str] = None
    hp_number: str
    user_type: str
    center_username: str
    is_active: bool = True
    is_superuser: bool = False
    created_at: Optional[datetime] = datetime.now()
    updated_at: Optional[datetime] = datetime.now()
    deleted_at: Optional[datetime] = None


class UserUpdate(BaseModel):
    email: EmailStr = None
    full_name: str
    birth_date: Optional[str] = None
    zip_code: Optional[str] = None
    address: Optional[str] = None
    address_extra: Optional[str] = None
    phone_number: Optional[str] = None
    hp_number: str
    updated_at: Optional[datetime] = datetime.now()


class UserRead(BaseModel):
    id: int
    username: str
    email: EmailStr
    full_name: str
    birth_date: Optional[str] = None
    zip_code: Optional[str] = None
    address: Optional[str] = None
    address_extra: Optional[str] = None
    phone_number: Optional[str] = None
    hp_number: str
    user_type: str
    center_username: str
    is_active: bool = True
    is_superuser: bool = False
    created_at: Optional[datetime] = datetime.now()
    updated_at: Optional[datetime] = datetime.now()
    deleted_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# CenterInfo Schema
class CenterInfoBase(BaseModel):
    username: str = Field(..., max_length=20, description="Center Username")
    center_name: str = Field(..., max_length=20, description="센터명")
    center_summary: str = Field(..., max_length=100, description="센터 한줄소개")
    center_introducs: str = Field(..., max_length=255, description="센터 소개")
    center_export: str = Field(..., max_length=50, description="전문분야")
    center_addr: str = Field(..., max_length=255, description="센터주소")
    center_tel: str = Field(..., max_length=15, description="센터전화번호")


class CenterInfoCreate(CenterInfoBase):
    pass


class CenterInfoUpdate(CenterInfoBase):
    pass


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
