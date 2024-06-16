from sqlmodel import Session, select
from ..models.announcement import Announcement
from typing import List, Optional

def create_announcement(session: Session, announcement: Announcement) -> Announcement:
    session.add(announcement)
    session.commit()
    session.refresh(announcement)
    return announcement

def get_announcement(session: Session, announcement_id: int) -> Optional[Announcement]:
    return session.get(Announcement, announcement_id)

def get_announcements(session: Session, skip: int = 0, limit: int = 10) -> List[Announcement]:
    statement = select(Announcement).offset(skip).limit(limit)
    results = session.exec(statement)
    return results.all()

def update_announcement(session: Session, announcement_id: int, announcement_data: Announcement) -> Optional[Announcement]:
    announcement = session.get(Announcement, announcement_id)
    if announcement:
        for key, value in announcement_data.dict(exclude_unset=True).items():
            setattr(announcement, key, value)
        session.commit()
        session.refresh(announcement)
    return announcement

def delete_announcement(session: Session, announcement_id: int) -> bool:
    announcement = session.get(Announcement, announcement_id)
    if announcement:
        session.delete(announcement)
        session.commit()
        return True
    return False
