from typing import List, Union

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, desc, select

from ..core import get_session
from ..crud.teacher import (
    create_teacher,
    delete_teacher,
    get_teacher_by_id,
    get_teacher_by_username,
    get_teachers,
    update_teacher,
)
from ..models.user import Teacher
from ..schemas import ErrorResponse, SuccessResponse
from ..schemas.user import TeacherCreate, TeacherRead, TeacherUpdate

router = APIRouter(
    prefix="/teachers",
    tags=["teachers"],
    dependencies=[Depends(get_session)],
    responses={404: {"description": "API Not found"}},
)


@router.post("", response_model=TeacherRead)
def register_teacher(teacher: TeacherCreate, session: Session = Depends(get_session)):
    teacher_data = Teacher.model_validate(teacher)
    return create_teacher(session, teacher_data)


@router.get("/{teacher_id}", response_model=TeacherRead)
def read_teacher(teacher_id: int, session: Session = Depends(get_session)):
    teacher = get_teacher_by_id(session, teacher_id)
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")
    return teacher


@router.get("", response_model=SuccessResponse[List[TeacherRead]])
def read_teachers(
    skip: int = 0, limit: int = 10, session: Session = Depends(get_session)
):
    results = get_teachers(session, skip=skip, limit=limit)
    return SuccessResponse(data={"total": len(results), "list": results})


@router.put("/{teacher_id}", response_model=SuccessResponse[TeacherRead])
def update_teacher_endpoint(
    teacher_id: int, teacher: TeacherUpdate, session: Session = Depends(get_session)
):
    existing_teacher = get_teacher_by_id(session, teacher_id)
    if not existing_teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")
    return SuccessResponse(data=update_teacher(session, teacher, existing_teacher))


@router.delete("/{teacher_id}", response_model=SuccessResponse[bool])
def delete_teacher_endpoint(teacher_id: int, session: Session = Depends(get_session)):
    if not delete_teacher(session, teacher_id):
        raise HTTPException(status_code=404, detail="Teacher not found")
    return SuccessResponse(data=True)
