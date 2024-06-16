from typing import Optional

from sqlmodel import Field, SQLModel
from sqlalchemy.sql import func
from sqlalchemy import Column, DateTime
from datetime import datetime

class Customer(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    gender: str
    birthdate: str
    disability_type: str
    disability_level: Optional[str] = None
    contact: str
    email: Optional[str] = None
    address: Optional[str] = None
    school: Optional[str] = None
    initial_consultation_date: Optional[str] = None
    first_visit_date: Optional[str] = None
    member_number: Optional[str] = None
    referral_path: Optional[str] = None
    status: str
    note: Optional[str] = None
    created_at: Optional[datetime] = Field(
        sa_column=Column(DateTime(timezone=True), server_default=func.now())
    )

    updated_at: Optional[datetime] = Field(
        sa_column=Column(DateTime(timezone=True), onupdate=func.now())
    )
    deleted_at: Optional[datetime] = Field(default=None)
