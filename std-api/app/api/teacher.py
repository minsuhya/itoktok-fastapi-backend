from typing import List, Union

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, desc, select

from ..core import get_session
from ..models.user import Teacher
from ..schemas.user import TeacherCreate, TeacherUpdate, TeacherRead
from ..crud.teacher import create_teacher, get_teacher_by_id, get_teacher_by_username, get_teachers, update_teacher, delete_teacher
from ..schemas import ErrorResponse, SuccessResponse

router = APIRouter(
    prefix="/teachers",
    tags=["teachers"],
    dependencies=[Depends(get_session)],
    responses={404: {
        "description": "API Not found"
    }},
)

@router.post("/", response_model=TeacherRead)
def register_teacher(teacher: TeacherCreate, session: Session = Depends(get_session)):
    teacher_data = Teacher.from_orm(teacher)
    return create_teacher(session, teacher_data)

@router.get("/{teacher_id}", response_model=TeacherRead)
def read_teacher(teacher_id: int, session: Session = Depends(get_session)):
    teacher = get_teacher_by_id(session, teacher_id)
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")
    return teacher

@router.get("/", response_model=List[TeacherRead])
def read_teachers(skip: int = 0, limit: int = 10, session: Session = Depends(get_session)):
    return get_teachers(session, skip=skip, limit=limit)

@router.put("/{teacher_id}", response_model=TeacherRead)
def update_teacher_endpoint(teacher_id: int, teacher: TeacherUpdate, session: Session = Depends(get_session)):
    existing_teacher = get_teacher_by_id(session, teacher_id)
    if not existing_teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")
    teacher_data = teacher.dict(exclude_unset=True)
    for key, value in teacher_data.items():
        setattr(existing_teacher, key, value)
    return update_teacher(session, teacher_id, existing_teacher)

@router.delete("/{teacher_id}", response_model=bool)
def delete_teacher_endpoint(teacher_id: int, session: Session = Depends(get_session)):
    if not delete_teacher(session, teacher_id):
        raise HTTPException(status_code=404, detail="Teacher not found")
    return True
