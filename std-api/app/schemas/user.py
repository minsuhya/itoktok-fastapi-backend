from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime, date
from enum import Enum

class Role(str, Enum):
    center_director = "center_director"
    teacher = "teacher"

class UserBaseSchema(BaseModel):
    username: str
    full_name: str
    email: EmailStr
    is_active: bool
    role: Role
    created_at: Optional[datetime]
    updated_at: Optional[datetime]
    deleted_at: Optional[datetime]

    class Config:
        orm_mode = True

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
