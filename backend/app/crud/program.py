from datetime import datetime
from typing import List, Optional
from fastapi_pagination import Page
from fastapi_pagination.ext.sqlalchemy import paginate
from sqlmodel import Session, select, or_
from ..models.program import Program, SEOUL_TZ
from ..models.user import User
from ..schemas.program import ProgramCreate, ProgramUpdate

def create_program(session: Session, program: Program) -> Program:
    session.add(program)
    session.commit()
    session.refresh(program)
    return program

def get_program(session: Session, program_id: int) -> Optional[Program]:
    return session.get(Program, program_id)

def get_programs(
    session: Session,
    login_user: User,
    page: int = 1,
    size: int = 10,
    search_qry: str = "",
    teacher_username: Optional[str] = None,
    program_type: Optional[str] = None,
    is_active: Optional[bool] = None,
) -> Page[Program]:
    query = select(Program).where(Program.deleted_at.is_(None))
    
    # 검색 조건
    if search_qry:
        query = query.where(
            or_(
                Program.program_name.like(f"%{search_qry}%"),
                Program.description.like(f"%{search_qry}%")
            )
        )
    
    # 프로그램 유형 필터
    if program_type:
        query = query.where(Program.program_type == program_type)
    
    # 활성화 상태 필터
    if is_active is not None:
        query = query.where(Program.is_active == is_active)
    
    # 센터별 조회 제한
    if not login_user.is_superuser:
        if login_user.user_type == "1": # 센터  
            query = query.where(Program.center_username == login_user.username)
        else: # 상담사
            query = query.where(
                or_(
                    Program.teacher_username == login_user.username,
                    Program.is_all_teachers == True
                )
            )

    # 상담사별 조회 제한
    if teacher_username:
        query = query.where(
            or_(
                Program.teacher_username == teacher_username,
                Program.is_all_teachers == True
            )
        )

    
    query = query.order_by(Program.created_at.desc())
    return paginate(session, query)

def update_program(
    session: Session, 
    program: ProgramUpdate, 
    db_program: Program
) -> Program:
    program_data = program.dict(exclude_unset=True)
    
    # 전체 선생님 선택 시 teacher_username 초기화
    if program_data.get('is_all_teachers'):
        program_data['teacher_username'] = None
    
    for key, value in program_data.items():
        setattr(db_program, key, value)
    
    db_program.updated_at = datetime.now(SEOUL_TZ)
    session.add(db_program)
    session.commit()
    session.refresh(db_program)
    return db_program

def delete_program(session: Session, program_id: int) -> bool:
    program = session.get(Program, program_id)
    if program:
        # 소프트 삭제 구현
        program.deleted_at = datetime.now(SEOUL_TZ)
        program.is_active = False
        session.add(program)
        session.commit()
        return True
    return False
