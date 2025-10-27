from sqlmodel import Session, select
from ..models.user import Teacher
from ..schemas.user import TeacherUpdate
from typing import Optional, List
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_teacher(session: Session, teacher: Teacher) -> Teacher:
    teacher.password = get_password_hash(teacher.password)
    session.add(teacher)
    session.commit()
    session.refresh(teacher)
    return teacher

def get_teacher_by_id(session: Session, teacher_id: int) -> Optional[Teacher]:
    return session.get(Teacher, teacher_id)

def get_teacher_by_username(session: Session, username: str) -> Optional[Teacher]:
    statement = select(Teacher).where(Teacher.username == username)
    return session.exec(statement).first()

def get_teachers(session: Session, skip: int = 0, limit: int = 10, login_user=None) -> List[Teacher]:
    statement = select(Teacher)

    # 로그인 사용자가 있으면 같은 센터의 선생님만 조회
    if login_user:
        # 센터장(user_type=1)인 경우 자신이 센터장인 센터의 선생님 조회
        if login_user.user_type == 1:
            statement = statement.where(Teacher.center_username == login_user.username)
        # 선생님(user_type=2)인 경우 자신만 조회
        elif login_user.user_type == 2:
            statement = statement.where(Teacher.username == login_user.username)
        # 최고관리자는 모든 선생님 조회 (필터링 없음)

    statement = statement.offset(skip).limit(limit)
    return session.exec(statement).all()

def update_teacher(session: Session, teacher: TeacherUpdate, db_teacher: Teacher) -> Optional[Teacher]:
    teacher_data = teacher.model_dump(exclude_unset=True)
    db_teacher.sqlmodel_update(teacher_data)
    session.commit()
    session.refresh(db_teacher)
    return db_teacher

def delete_teacher(session: Session, teacher_id: int) -> bool:
    teacher = session.get(Teacher, teacher_id)
    if teacher:
        session.delete(teacher)
        session.commit()
        return True
    return False
