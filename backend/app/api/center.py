from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from ..core import get_session, oauth2_scheme
from ..crud.center import (
    create_center_info,
    delete_center_info,
    get_center_info_by_username,
    get_center_infos,
    update_center_info,
)
from ..models.user import CenterInfo
from ..schemas import ErrorResponse, SuccessResponse
from .auth import get_current_user
from ..schemas.user import (
    CenterInfoCreate,
    CenterInfoRead,
    CenterInfoUpdate,
)

router = APIRouter(
    prefix="/center",
    tags=["Center"],
    dependencies=[Depends(get_session), Depends(oauth2_scheme)],
    responses={404: {"description": "API Not found"}},
)


##### Center Info CRUD #####
@router.post("/info", response_model=CenterInfoRead)
def register_center_info(
    info: CenterInfoCreate,
    session: Session = Depends(get_session),
    current_user=Depends(get_current_user),
):
    info_data = CenterInfo.model_validate(info)
    return create_center_info(session, info_data)


@router.get("/info/{username}", response_model=SuccessResponse[CenterInfoRead])
def read_center_info(
    username: str,
    session: Session = Depends(get_session),
    current_user=Depends(get_current_user),
):
    print("read", username)
    info = get_center_info_by_username(session, username)
    if not info:
        raise HTTPException(status_code=404, detail="Center Info not found")
    return SuccessResponse(data=info)


@router.get("/info", response_model=List[CenterInfoRead])
def read_center_infos(
    skip: int = 0,
    limit: int = 10,
    session: Session = Depends(get_session),
    current_user=Depends(get_current_user),
):
    return get_center_infos(session, skip=skip, limit=limit)


@router.put("/info/{username}", response_model=SuccessResponse[CenterInfoRead])
def update_center_info_endpoint(
    username: str,
    info: CenterInfoUpdate,
    session: Session = Depends(get_session),
    current_user=Depends(get_current_user),
):
    existing_info = get_center_info_by_username(session, username)
    if not existing_info:
        new_center_info = CenterInfoCreate(**info.model_dump(exclude_unset=True))
        info_data = CenterInfo.model_validate(new_center_info)
        center_info = create_center_info(session, info_data)
    else:
        center_info = update_center_info(session, info, existing_info)
    return SuccessResponse(data=center_info)


@router.delete("/info/{username}", response_model=SuccessResponse[bool])
def delete_center_info_endpoint(
    username: str,
    session: Session = Depends(get_session),
    current_user=Depends(get_current_user),
):
    if not delete_center_info(session, username):
        raise HTTPException(status_code=404, detail="Center Info not found")
    return SuccessResponse(data=True)
