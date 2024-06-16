from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import date

class TeacherCreate(BaseModel):
    name: str
    birthdate: date
    login_account: str
    login_password: str
    position: str
    personal_history: Optional[str] = None
    mobile_number: str
    office_number: Optional[str] = None
    email: Optional[EmailStr] = None
    address: Optional[str] = None
    role: str

class TeacherUpdate(BaseModel):
    name: Optional[str] = None
    birthdate: Optional[date] = None
    login_account: Optional[str] = None
    login_password: Optional[str] = None
    position: Optional[str] = None
    personal_history: Optional[str] = None
    mobile_number: Optional[str] = None
    office_number: Optional[str] = None
    email: Optional[EmailStr] = None
    address: Optional[str] = None
    role: Optional[str] = None

class TeacherRead(BaseModel):
    id: int
    name: str
    birthdate: date
    login_account: str
    position: str
    personal_history: Optional[str] = None
    mobile_number: str
    office_number: Optional[str] = None
    email: Optional[EmailStr] = None
    address: Optional[str] = None
    role: str

    class Config:
        orm_mode = True
