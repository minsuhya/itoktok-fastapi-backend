from typing import List, Union

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, desc, select

from ..core import get_session
from ..models.program import Program
from ..schemas.program import ProgramCreate, ProgramUpdate, ProgramRead
from ..crud.program import create_program, get_program, get_programs, update_program, delete_program
from ..schemas import ErrorResponse, SuccessResponse

router = APIRouter(
    prefix="/programs",
    tags=["programs"],
    dependencies=[Depends(get_session)],
    responses={404: {
        "description": "API Not found"
    }},
)

@router.post("/", response_model=ProgramRead)
def create_program(program: ProgramCreate, session: Session = Depends(get_session)):
    program_data = Program.from_orm(program)
    return create_program(session, program_data)

@router.get("/{program_id}", response_model=ProgramRead)
def read_program(program_id: int, session: Session = Depends(get_session)):
    program = get_program(session, program_id)
    if not program:
        raise HTTPException(status_code=404, detail="Program not found")
    return program

@router.get("/", response_model=List[ProgramRead])
def read_programs(skip: int = 0, limit: int = 10, session: Session = Depends(get_session)):
    return get_programs(session, skip=skip, limit=limit)

@router.put("/{program_id}", response_model=ProgramRead)
def update_program(program_id: int, program: ProgramUpdate, session: Session = Depends(get_session)):
    existing_program = get_program(session, program_id)
    if not existing_program:
        raise HTTPException(status_code=404, detail="Program not found")
    program_data = program.dict(exclude_unset=True)
    for key, value in program_data.items():
        setattr(existing_program, key, value)
    return update_program(session, program_id, existing_program)

@router.delete("/{program_id}", response_model=bool)
def delete_program(program_id: int, session: Session = Depends(get_session)):
    if not delete_program(session, program_id):
        raise HTTPException(status_code=404, detail="Program not found")
    return True
