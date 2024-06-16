from sqlmodel import Session, select
from ..models.record import Record
from typing import List, Optional

def create_record(session: Session, record: Record) -> Record:
    session.add(record)
    session.commit()
    session.refresh(record)
    return record

def get_record(session: Session, record_id: int) -> Optional[Record]:
    return session.get(Record, record_id)

def get_records(session: Session, skip: int = 0, limit: int = 10) -> List[Record]:
    statement = select(Record).offset(skip).limit(limit)
    results = session.exec(statement)
    return results.all()

def update_record(session: Session, record_id: int, record_data: Record) -> Optional[Record]:
    record = session.get(Record, record_id)
    if record:
        for key, value in record_data.dict(exclude_unset=True).items():
            setattr(record, key, value)
        session.commit()
        session.refresh(record)
    return record

def delete_record(session: Session, record_id: int) -> bool:
    record = session.get(Record, record_id)
    if record:
        session.delete(record)
        session.commit()
        return True
    return False
