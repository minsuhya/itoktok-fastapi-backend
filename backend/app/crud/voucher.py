from sqlmodel import Session, select
from typing import List, Optional
from ..models.voucher import Voucher

def create_voucher(session: Session, voucher: Voucher) -> Voucher:
    session.add(voucher)
    session.commit()
    session.refresh(voucher)
    return voucher

def get_voucher(session: Session, voucher_id: int) -> Optional[Voucher]:
    return session.get(Voucher, voucher_id)

def get_vouchers(session: Session, skip: int = 0, limit: int = 10) -> List[Voucher]:
    statement = select(Voucher).offset(skip).limit(limit)
    results = session.exec(statement)
    return results.all()

def update_voucher(session: Session, voucher_id: int, voucher_data: Voucher) -> Optional[Voucher]:
    voucher = session.get(Voucher, voucher_id)
    if voucher:
        for key, value in voucher_data.dict(exclude_unset=True).items():
            setattr(voucher, key, value)
        session.commit()
        session.refresh(voucher)
    return voucher

def delete_voucher(session: Session, voucher_id: int) -> bool:
    voucher = session.get(Voucher, voucher_id)
    if voucher:
        session.delete(voucher)
        session.commit()
        return True
    return False
