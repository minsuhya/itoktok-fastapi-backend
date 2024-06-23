from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date

class CustomerCreate(BaseModel):
    name: str
    gender: str
    birthdate: date
    disability_type: str
    disability_level: Optional[str] = None
    contact: str
    email: Optional[EmailStr] = None
    address: Optional[str] = None
    school: Optional[str] = None
    initial_consultation_date: Optional[date] = None
    first_visit_date: Optional[date] = None
    member_number: Optional[str] = None
    referral_path: Optional[str] = None
    status: str
    note: Optional[str] = None

class CustomerUpdate(BaseModel):
    name: Optional[str] = None
    gender: Optional[str] = None
    birthdate: Optional[date] = None
    disability_type: Optional[str] = None
    disability_level: Optional[str] = None
    contact: Optional[str] = None
    email: Optional[EmailStr] = None
    address: Optional[str] = None
    school: Optional[str] = None
    initial_consultation_date: Optional[date] = None
    first_visit_date: Optional[date] = None
    member_number: Optional[str] = None
    referral_path: Optional[str] = None
    status: Optional[str] = None
    note: Optional[str] = None

class CustomerRead(BaseModel):
    id: int
    name: str
    gender: str
    birthdate: date
    disability_type: str
    disability_level: Optional[str] = None
    contact: str
    email: Optional[EmailStr] = None
    address: Optional[str] = None
    school: Optional[str] = None
    initial_consultation_date: Optional[date] = None
    first_visit_date: Optional[date] = None
    member_number: Optional[str] = None
    referral_path: Optional[str] = None
    status: str
    note: Optional[str] = None

    class Config:
        from_attributes = True
