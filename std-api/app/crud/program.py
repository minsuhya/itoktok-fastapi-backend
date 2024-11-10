from typing import List, Optional
from fastapi_pagination import Page
from fastapi_pagination.ext.sqlalchemy import paginate
from sqlmodel import Session, select
from sqlalchemy.orm import joinedload
from ..models.program import Program
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
    program_type: Optional[str] = None,
    is_active: Optional[bool] = None
) -> Page[Program]:
    query = select(Program).options(joinedload(Program.teacher))
    if search_qry:
        query = query.where(Program.program_name.like(f"%{search_qry}%"))
    if program_type:
        query = query.where(Program.program_type == program_type)
    if is_active is not None:
        query = query.where(Program.is_active == is_active)

    if login_user.is_superuser != 1:  # 최고관리자가 아닐 경우 센터 정보만
        query = query.where(Program.center_username == login_user.username)
    return paginate(session, query)

def update_program(
    session: Session, 
    program: ProgramUpdate, 
    db_program: Program
) -> Program:
    program_data = program.dict(exclude_unset=True)
    for key, value in program_data.items():
        setattr(db_program, key, value)
    session.add(db_program)
    session.commit()
    session.refresh(db_program)
    return db_program

def delete_program(session: Session, program_id: int) -> bool:
    program = session.get(Program, program_id)
    if program:
        session.delete(program)
        session.commit()
        return True
    return False
