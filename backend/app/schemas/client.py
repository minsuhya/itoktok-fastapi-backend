from datetime import date, datetime
from typing import List, Optional

from pydantic import BaseModel, Field

from .user import UserRead


# ClientInfo Base Schema
class ClientInfoBase(BaseModel):
    consultant: str = Field(..., max_length=20, description="Consultant")
    consultant_status: str = Field("1", max_length=1, description="Consultant")
    client_name: str = Field(..., max_length=30, description="Client Name")
    phone_number: str = Field(..., max_length=15, description="Phone Number")
    tags: Optional[str] = Field(None, max_length=100, description="Tags")
    memo: Optional[str] = Field(None, description="Memo")
    birth_date: Optional[str] = Field(None, description="Birth Date")
    gender: Optional[str] = Field(None, max_length=1, description="Gender")
    email_address: Optional[str] = Field(
        None, max_length=50, description="Email Address"
    )
    address_region: Optional[str] = Field(
        None, max_length=50, description="Address Region"
    )
    address_city: Optional[str] = Field(None, max_length=50, description="Address City")
    family_members: Optional[str] = Field(None, description="Family Members")
    consultation_path: Optional[str] = Field(
        default="", max_length=20, description="Consultation Path"
    )
    center_username: str = Field(..., max_length=15, description="center_username")
    registered_by: Optional[str] = Field(default=None, max_length=15, description="Register")


# ClientInfo Create Schema
class ClientInfoCreate(ClientInfoBase):
    created_at: Optional[datetime] = Field(default_factory=lambda: datetime.now())
    updated_at: Optional[datetime] = Field(default_factory=lambda: datetime.now())


# ClientInfo Update Schema
class ClientInfoUpdate(ClientInfoBase):
    updated_at: Optional[datetime] = Field(default_factory=lambda: datetime.now())


# ClientInfo Read Schema
class ClientInfoRead(ClientInfoBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime]
    deleted_at: Optional[datetime]
    consultant_info: Optional["UserRead"] = None

    class Config:
        from_attributes = True
