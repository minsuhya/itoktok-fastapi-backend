from typing import List, Optional
from sqlmodel import Session, select
from .models import Teacher

def create_teacher(session: Session, teacher: Teacher) -> Teacher:
    session.add(teacher)
    session.commit()
    session.refresh(teacher)
    return teacher

def get_teacher(session: Session, teacher_id: int) -> Optional[Teacher]:
    return session.get(Teacher, teacher_id)

def get_teachers(session: Session, skip: int = 0, limit: int = 10) -> List[Teacher]:
    statement = select(Teacher).offset(skip).limit(limit)
    results = session.exec(statement)
    return results.all()

def update_teacher(session: Session, teacher_id: int, teacher_data: Teacher) -> Optional[Teacher]:
    teacher = session.get(Teacher, teacher_id)
    if teacher:
        for key, value in teacher_data.dict(exclude_unset=True).items():
            setattr(teacher, key, value)
        session.commit()
        session.refresh(teacher)
    return teacher

def delete_teacher(session: Session, teacher_id: int) -> bool:
    teacher = session.get(Teacher, teacher_id)
    if teacher:
        session.delete(teacher)
        session.commit()
        return True
    return False
