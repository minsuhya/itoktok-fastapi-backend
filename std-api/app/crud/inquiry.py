from sqlmodel import Session, select
from ..models.inquiry import Inquiry
from typing import List, Optional

def create_inquiry(session: Session, inquiry: Inquiry) -> Inquiry:
    session.add(inquiry)
    session.commit()
    session.refresh(inquiry)
    return inquiry

def get_inquiry(session: Session, inquiry_id: int) -> Optional[Inquiry]:
    return session.get(Inquiry, inquiry_id)

def get_inquiries(session: Session, skip: int = 0, limit: int = 10) -> List[Inquiry]:
    statement = select(Inquiry).offset(skip).limit(limit)
    results = session.exec(statement)
    return results.all()

def update_inquiry(session: Session, inquiry_id: int, inquiry_data: Inquiry) -> Optional[Inquiry]:
    inquiry = session.get(Inquiry, inquiry_id)
    if inquiry:
        for key, value in inquiry_data.dict(exclude_unset=True).items():
            setattr(inquiry, key, value)
        session.commit()
        session.refresh(inquiry)
    return inquiry

def delete_inquiry(session: Session, inquiry_id: int) -> bool:
    inquiry = session.get(Inquiry, inquiry_id)
    if inquiry:
        session.delete(inquiry)
        session.commit()
        return True
    return False
