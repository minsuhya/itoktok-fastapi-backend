from sqlmodel import Session, select
from ..models.schedule import Schedule
from typing import List, Optional

def create_schedule(session: Session, schedule: Schedule) -> Schedule:
    session.add(schedule)
    session.commit()
    session.refresh(schedule)
    return schedule

def get_schedule(session: Session, schedule_id: int) -> Optional[Schedule]:
    return session.get(Schedule, schedule_id)

def get_schedules(session: Session, skip: int = 0, limit: int = 10) -> List[Schedule]:
    statement = select(Schedule).offset(skip).limit(limit)
    results = session.exec(statement)
    return results.all()

def update_schedule(session: Session, schedule_id: int, schedule_data: Schedule) -> Optional[Schedule]:
    schedule = session.get(Schedule, schedule_id)
    if schedule:
        for key, value in schedule_data.dict(exclude_unset=True).items():
            setattr(schedule, key, value)
        session.commit()
        session.refresh(schedule)
    return schedule

def delete_schedule(session: Session, schedule_id: int) -> bool:
    schedule = session.get(Schedule, schedule_id)
    if schedule:
        session.delete(schedule)
        session.commit()
        return True
    return False
