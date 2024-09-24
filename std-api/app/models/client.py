from datetime import date, datetime
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import Column, DateTime, func, text
from sqlmodel import JSON, Field, Relationship, SQLModel

if TYPE_CHECKING:
    from .schedule import Schedule
    from .user import User


class ClientInfo(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    consultant: str = Field(foreign_key="user.username", max_length=20, nullable=False)
    consultant_status: str = Field(default="1", max_length=1, nullable=False)
    client_name: str = Field(max_length=30, nullable=False)
    phone_number: str = Field(max_length=15, nullable=False)
    tags: Optional[str] = Field(default=None, max_length=255)
    memo: Optional[str] = Field(default=None)
    birth_date: Optional[str] = Field(default=None)
    gender: Optional[str] = Field(default=None, max_length=1)
    email_address: Optional[str] = Field(default=None, max_length=50)
    address_region: Optional[str] = Field(default=None, max_length=50)
    address_city: Optional[str] = Field(default=None, max_length=50)
    family_members: Optional[str] = Field(default=None)
    consultation_path: str = Field(max_length=20, nullable=False)
    center_username: str = Field(max_length=20, nullable=False)
    register: str = Field(max_length=20, nullable=False)  # 등록자

    created_at: Optional[datetime] = Field(
        sa_column=Column(
            DateTime(timezone=True), server_default=func.now(), nullable=False
        )
    )
    updated_at: Optional[datetime] = Field(
        sa_column=Column(
            DateTime(timezone=True),
            server_default=func.now(),
            onupdate=func.now(),
            nullable=False,
        )
    )
    deleted_at: Optional[datetime] = Field(
        default=None, sa_column=Column(DateTime(timezone=True))
    )

    schedule: List["Schedule"] = Relationship(back_populates="clientinfo")
    consultant_info: Optional["User"] = Relationship(back_populates="client_infos")
