from typing import List, Union

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, desc, select

from ..core import get_session
from ..models.voucher import Voucher
from ..schemas.voucher import VoucherCreate, VoucherUpdate, VoucherRead
from ..crud.voucher import create_voucher, get_voucher, get_vouchers, update_voucher, delete_voucher
from ..schemas import ErrorResponse, SuccessResponse

router = APIRouter(
    prefix="/vouchers",
    tags=["vouchers"],
    dependencies=[Depends(get_session)],
    responses={404: {
        "description": "API Not found"
    }},
)

@router.post("/vouchers/", response_model=VoucherRead)
def create_voucher(voucher: VoucherCreate, session: Session = Depends(get_session)):
    voucher_data = Voucher.from_orm(voucher)
    return create_voucher(session, voucher_data)

@router.get("/vouchers/{voucher_id}", response_model=VoucherRead)
def read_voucher(voucher_id: int, session: Session = Depends(get_session)):
    voucher = get_voucher(session, voucher_id)
    if not voucher:
        raise HTTPException(status_code=404, detail="Voucher not found")
    return voucher

@router.get("/vouchers/", response_model=List[VoucherRead])
def read_vouchers(skip: int = 0, limit: int = 10, session: Session = Depends(get_session)):
    return get_vouchers(session, skip=skip, limit=limit)

@router.put("/vouchers/{voucher_id}", response_model=VoucherRead)
def update_voucher(voucher_id: int, voucher: VoucherUpdate, session: Session = Depends(get_session)):
    existing_voucher = get_voucher(session, voucher_id)
    if not existing_voucher:
        raise HTTPException(status_code=404, detail="Voucher not found")
    voucher_data = voucher.dict(exclude_unset=True)
    for key, value in voucher_data.items():
        setattr(existing_voucher, key, value)
    return update_voucher(session, voucher_id, existing_voucher)

@router.delete("/vouchers/{voucher_id}", response_model=bool)
def delete_voucher(voucher_id: int, session: Session = Depends(get_session)):
    if not delete_voucher(session, voucher_id):
        raise HTTPException(status_code=404, detail="Voucher not found")
    return True
