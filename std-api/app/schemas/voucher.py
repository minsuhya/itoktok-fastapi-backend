from pydantic import BaseModel
from typing import Optional
from ..models.voucher import VoucherType, VoucherStatus

class VoucherCreate(BaseModel):
    type: VoucherType
    name: str
    support_amount: float = 0
    personal_contribution: float = 0
    status: VoucherStatus
    social_welfare_service_number: Optional[str] = None

class VoucherUpdate(BaseModel):
    type: Optional[VoucherType] = None
    name: Optional[str] = None
    support_amount: Optional[float] = None
    personal_contribution: Optional[float] = None
    status: Optional[VoucherStatus] = None
    social_welfare_service_number: Optional[str] = None

class VoucherRead(BaseModel):
    id: int
    type: VoucherType
    name: str
    support_amount: float
    personal_contribution: float
    status: VoucherStatus
    social_welfare_service_number: Optional[str] = None

    class Config:
        from_attributes = True
