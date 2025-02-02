from sqlmodel import SQLModel, Field
from sqlalchemy import Column, DateTime, func
from typing import Optional
from datetime import datetime
from enum import Enum

class VoucherType(str, Enum):
    support_for_disabled_children = "장애아동가족지원"
    regional_social_investment = "지역사회투자사업"
    education_support = "교육청지원사업"
    others = "기타"

class VoucherStatus(str, Enum):
    active = "사용"
    inactive = "중단"

class Voucher(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    type: str = Field(default=VoucherType.support_for_disabled_children)
    name: str
    support_amount: float = Field(default=0)
    personal_contribution: float = Field(default=0)
    status: str = Field(default=VoucherStatus.active)
    social_welfare_service_number: Optional[str] = None
    created_at: Optional[datetime] = Field(
        sa_column=Column(DateTime(timezone=True), server_default=func.now())
    )

    updated_at: Optional[datetime] = Field(
        sa_column=Column(DateTime(timezone=True), onupdate=func.now())
    )
    deleted_at: Optional[datetime] = Field(default=None)
