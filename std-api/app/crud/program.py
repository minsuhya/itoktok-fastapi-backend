from sqlmodel import Session, select
from ..models.program import Program
from typing import List, Optional

def create_program(session: Session, program: Program) -> Program:
    session.add(program)
    session.commit()
    session.refresh(program)
    return program

def get_program(session: Session, program_id: int) -> Optional[Program]:
    return session.get(Program, program_id)

def get_programs(session: Session, skip: int = 0, limit: int = 10) -> List[Program]:
    statement = select(Program).offset(skip).limit(limit)
    results = session.exec(statement)
    return results.all()

def update_program(session: Session, program_id: int, program_data: Program) -> Optional[Program]:
    program = session.get(Program, program_id)
    if program:
        for key, value in program_data.dict(exclude_unset=True).items():
            setattr(program, key, value)
        session.commit()
        session.refresh(program)
    return program

def delete_program(session: Session, program_id: int) -> bool:
    program = session.get(Program, program_id)
    if program:
        session.delete(program)
        session.commit()
        return True
    return False
