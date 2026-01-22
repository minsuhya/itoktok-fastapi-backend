from typing import List, Union

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, desc, select

from ..core import get_session, oauth2_scheme
from ..models.voucher import Voucher
from ..schemas.voucher import VoucherCreate, VoucherUpdate, VoucherRead
from ..crud.voucher import (
    create_voucher as create_voucher_crud,
    get_voucher,
    get_vouchers,
    update_voucher as update_voucher_crud,
    delete_voucher as delete_voucher_crud,
)
from ..schemas import ErrorResponse, SuccessResponse
from .auth import get_current_user

router = APIRouter(
    prefix="/vouchers",
    tags=["vouchers"],
    dependencies=[Depends(get_session), Depends(oauth2_scheme)],
    responses={404: {"description": "API Not found"}},
)


@router.post("/", response_model=VoucherRead)
def create_voucher(
    voucher: VoucherCreate,
    session: Session = Depends(get_session),
    current_user=Depends(get_current_user),
):
    voucher_data = Voucher.from_orm(voucher)
    return create_voucher_crud(session, voucher_data)


@router.get("/{voucher_id}", response_model=VoucherRead)
def read_voucher(
    voucher_id: int,
    session: Session = Depends(get_session),
    current_user=Depends(get_current_user),
):
    voucher = get_voucher(session, voucher_id)
    if not voucher:
        raise HTTPException(status_code=404, detail="Voucher not found")
    return voucher


@router.get("/", response_model=List[VoucherRead])
def read_vouchers(
    skip: int = 0,
    limit: int = 10,
    session: Session = Depends(get_session),
    current_user=Depends(get_current_user),
):
    return get_vouchers(session, skip=skip, limit=limit)


@router.put("/{voucher_id}", response_model=VoucherRead)
def update_voucher(
    voucher_id: int,
    voucher: VoucherUpdate,
    session: Session = Depends(get_session),
    current_user=Depends(get_current_user),
):
    existing_voucher = get_voucher(session, voucher_id)
    if not existing_voucher:
        raise HTTPException(status_code=404, detail="Voucher not found")
    voucher_data = voucher.dict(exclude_unset=True)
    for key, value in voucher_data.items():
        setattr(existing_voucher, key, value)
    return update_voucher_crud(session, voucher_id, existing_voucher)


@router.delete("/{voucher_id}", response_model=bool)
def delete_voucher(
    voucher_id: int,
    session: Session = Depends(get_session),
    current_user=Depends(get_current_user),
):
    if not delete_voucher_crud(session, voucher_id):
        raise HTTPException(status_code=404, detail="Voucher not found")
    return True
