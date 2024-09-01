from typing import List, Union

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, desc, select

from ..core import get_session
from ..crud.center import (  # center director; center info
    create_center_director,
    create_center_info,
    delete_center_director,
    delete_center_info,
    get_center_director_by_id,
    get_center_directors,
    get_center_info_by_id,
    get_center_infos,
    update_center_director,
    update_center_info,
)
from ..models.user import CenterDirector, CenterInfo
from ..schemas import ErrorResponse, SuccessResponse
from ..schemas.user import (  # center director; center info
    CenterDirectorCreate,
    CenterDirectorRead,
    CenterDirectorUpdate,
    CenterInfoCreate,
    CenterInfoRead,
    CenterInfoUpdate,
)

router = APIRouter(
    prefix="/center",
    tags=["center"],
    dependencies=[Depends(get_session)],
    responses={404: {"description": "API Not found"}},
)


##### Center Director CRUD #####
@router.post("/register", response_model=CenterDirectorRead)
def register_center_director(
    director: CenterDirectorCreate, session: Session = Depends(get_session)
):
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
def read_center_directors(
    skip: int = 0, limit: int = 10, session: Session = Depends(get_session)
):
    return get_center_directors(session, skip=skip, limit=limit)


@router.put("/{director_id}", response_model=SuccessResponse[CenterDirectorRead])
def update_center_director_endpoint(
    director_id: int,
    director: CenterDirectorUpdate,
    session: Session = Depends(get_session),
):
    existing_director = get_center_director_by_id(session, director_id)
    if not existing_director:
        raise HTTPException(status_code=404, detail="Center Director not found")
    return SuccessResponse(
        data=update_center_director(session, director, existing_director)
    )


@router.delete("/{director_id}", response_model=SuccessResponse[bool])
def delete_center_director_endpoint(
    director_id: int, session: Session = Depends(get_session)
):
    if not delete_center_director(session, director_id):
        raise HTTPException(status_code=404, detail="Center Director not found")
    return SuccessResponse(data=True)


##### Center Info CRUD #####
@router.post("/info", response_model=CenterInfoRead)
def register_center_info(
    info: CenterInfoCreate, session: Session = Depends(get_session)
):
    info_data = CenterInfo.model_validate(info)
    return create_center_info(session, info_data)


@router.get("/info/{id}", response_model=CenterInfoRead)
def read_center_info(info_id: int, session: Session = Depends(get_session)):
    print("read", info_id)
    info = get_center_info_by_id(session, info_id)
    if not info:
        raise HTTPException(status_code=404, detail="Center Info not found")
    return info


@router.get("/info", response_model=List[CenterInfoRead])
def read_center_infos(
    skip: int = 0, limit: int = 10, session: Session = Depends(get_session)
):
    return get_center_infos(session, skip=skip, limit=limit)


@router.put("/{info_id}", response_model=SuccessResponse[CenterInfoRead])
def update_center_info_endpoint(
    info_id: int,
    info: CenterInfoUpdate,
    session: Session = Depends(get_session),
):
    existing_info = get_center_info_by_id(session, info_id)
    if not existing_info:
        raise HTTPException(status_code=404, detail="Center Info not found")
    return SuccessResponse(data=update_center_info(session, info, existing_info))


@router.delete("/{info_id}", response_model=SuccessResponse[bool])
def delete_center_info_endpoint(info_id: int, session: Session = Depends(get_session)):
    if not delete_center_info(session, info_id):
        raise HTTPException(status_code=404, detail="Center Info not found")
    return SuccessResponse(data=True)
