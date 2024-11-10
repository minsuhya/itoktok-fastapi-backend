from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi_pagination import Page
from sqlmodel import Session

from ..core import get_session, oauth2_scheme
from ..crud.program import (
    create_program,
    get_program,
    get_programs,
    update_program,
    delete_program
)
from ..models.program import Program
from ..models.user import User
from ..schemas.program import ProgramCreate, ProgramRead, ProgramUpdate
from ..schemas import SuccessResponse
from .auth import get_current_user

router = APIRouter(
    prefix="/programs",
    tags=["Programs"],
    dependencies=[Depends(get_session), Depends(oauth2_scheme)],
    responses={404: {"description": "Not found"}},
)

@router.post("/", response_model=ProgramRead)
def create_program_endpoint(
    program: ProgramCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    if not current_user.is_active:
        raise HTTPException(status_code=403, detail="Inactive user")
    
    program_data = Program.from_orm(program)
    program_data.center_username = current_user.username
    print("program_data", program_data)
    return create_program(session, program_data)

@router.get("/{program_id}", response_model=SuccessResponse[ProgramRead])
def read_program_endpoint(
    program_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    program = get_program(session, program_id)
    if not program:
        raise HTTPException(status_code=404, detail="Program not found")
    
    # 권한 체크
    if not current_user.is_superuser and program.center_username != current_user.username:
        raise HTTPException(status_code=403, detail="Not authorized to access this program")
    
    return SuccessResponse(data=program)

@router.get("/", response_model=Page[ProgramRead])
def read_programs_endpoint(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    search_qry: str = "",
    program_type: Optional[str] = None,
    is_active: Optional[bool] = None,
):
    return get_programs(
        session,
        login_user=current_user,
        page=page,
        size=size,
        search_qry=search_qry,
        program_type=program_type,
        is_active=is_active
    )

@router.put("/{program_id}", response_model=ProgramRead)
def update_program_endpoint(
    program_id: int,
    program: ProgramUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    db_program = get_program(session, program_id)
    if not db_program:
        raise HTTPException(status_code=404, detail="Program not found")
    
    # 권한 체크
    if not current_user.is_superuser and db_program.center_username != current_user.username:
        raise HTTPException(status_code=403, detail="Not authorized to modify this program")
    
    return update_program(session, program, db_program)

@router.delete("/{program_id}", response_model=SuccessResponse[bool])
def delete_program_endpoint(
    program_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    db_program = get_program(session, program_id)
    if not db_program:
        raise HTTPException(status_code=404, detail="Program not found")
    
    # 권한 체크
    if not current_user.is_superuser and db_program.center_username != current_user.username:
        raise HTTPException(status_code=403, detail="Not authorized to delete this program")
    
    return SuccessResponse(data=delete_program(session, program_id))
