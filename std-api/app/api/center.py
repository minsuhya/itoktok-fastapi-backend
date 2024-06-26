from typing import List, Union

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, desc, select

from ..core import get_session
from ..models.user import CenterDirector
from ..schemas.user import CenterDirectorCreate, CenterDirectorUpdate, CenterDirectorRead
from ..crud.center import create_center_director, get_center_director_by_id, get_center_directors, update_center_director, delete_center_director
from ..schemas import ErrorResponse, SuccessResponse

router = APIRouter(
    prefix="/center_directors",
    tags=["center_directors"],
    dependencies=[Depends(get_session)],
    responses={404: {
        "description": "API Not found"
    }},
)

@router.post("", response_model=CenterDirectorRead)
def register_center_director(director: CenterDirectorCreate, session: Session = Depends(get_session)):
    director_data = CenterDirector.model_validate(director)
    return create_center_director(session, director_data)

@router.get("/{director_id}", response_model=CenterDirectorRead)
def read_center_director(director_id: int, session: Session = Depends(get_session)):
    print("read", director_id)
    director = get_center_director_by_id(session, director_id)
    if not director:
        raise HTTPException(status_code=404, detail="Center Director not found")
    return director

@router.get("", response_model=List[CenterDirectorRead])
def read_center_directors(skip: int = 0, limit: int = 10, session: Session = Depends(get_session)):
    return get_center_directors(session, skip=skip, limit=limit)

@router.put("/{director_id}", response_model=SuccessResponse[CenterDirectorRead])
def update_center_director_endpoint(director_id: int, director: CenterDirectorUpdate, session: Session = Depends(get_session)):
    existing_director = get_center_director_by_id(session, director_id)
    if not existing_director:
        raise HTTPException(status_code=404, detail="Center Director not found")
    return SuccessResponse(data=update_center_director(session, director, existing_director))

@router.delete("/{director_id}", response_model=SuccessResponse[bool])
def delete_center_director_endpoint(director_id: int, session: Session = Depends(get_session)):
    if not delete_center_director(session, director_id):
        raise HTTPException(status_code=404, detail="Center Director not found")
    return SuccessResponse(data=True)
