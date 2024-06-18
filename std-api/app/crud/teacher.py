from sqlmodel import Session, select
from ..models.user import Teacher
from typing import Optional, List
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_teacher(session: Session, teacher: Teacher) -> Teacher:
    teacher.password_hash = get_password_hash(teacher.password_hash)
    session.add(teacher)
    session.commit()
    session.refresh(teacher)
    return teacher

def get_teacher_by_id(session: Session, teacher_id: int) -> Optional[Teacher]:
    return session.get(Teacher, teacher_id)

def get_teacher_by_username(session: Session, username: str) -> Optional[Teacher]:
    statement = select(Teacher).where(Teacher.username == username)
    return session.exec(statement).first()

def get_teachers(session: Session, skip: int = 0, limit: int = 10) -> List[Teacher]:
    statement = select(Teacher).offset(skip).limit(limit)
    return session.exec(statement).all()

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
