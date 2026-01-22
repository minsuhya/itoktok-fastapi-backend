from typing import List, Union

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, desc, select

from ..core import get_session, oauth2_scheme
from ..models.announcement import Announcement
from ..schemas.announcement import (
    AnnouncementCreate,
    AnnouncementUpdate,
    AnnouncementRead,
)
from ..crud.announcement import (
    create_announcement as create_announcement_crud,
    get_announcement,
    get_announcements,
    update_announcement as update_announcement_crud,
    delete_announcement as delete_announcement_crud,
)
from ..schemas import ErrorResponse, SuccessResponse
from .auth import get_current_user

router = APIRouter(
    prefix="/announcements",
    tags=["announcements"],
    dependencies=[Depends(get_session), Depends(oauth2_scheme)],
    responses={404: {"description": "API Not found"}},
)


@router.post("/", response_model=AnnouncementRead)
def create_announcement(
    announcement: AnnouncementCreate,
    db_session: Session = Depends(get_session),
    current_user=Depends(get_current_user),
):
    announcement_data = Announcement.from_orm(announcement)
    return create_announcement_crud(db_session, announcement_data)


@router.get("/{announcement_id}", response_model=AnnouncementRead)
def read_announcement(
    announcement_id: int,
    db_session: Session = Depends(get_session),
    current_user=Depends(get_current_user),
):
    announcement = get_announcement(db_session, announcement_id)
    if not announcement:
        raise HTTPException(status_code=404, detail="Announcement not found")
    return announcement


@router.get("/", response_model=List[AnnouncementRead])
def read_announcements(
    skip: int = 0,
    limit: int = 10,
    db_session: Session = Depends(get_session),
    current_user=Depends(get_current_user),
):
    return get_announcements(db_session, skip=skip, limit=limit)


@router.put("/{announcement_id}", response_model=AnnouncementRead)
def update_announcement(
    announcement_id: int,
    announcement: AnnouncementUpdate,
    db_session: Session = Depends(get_session),
    current_user=Depends(get_current_user),
):
    existing_announcement = get_announcement(db_session, announcement_id)
    if not existing_announcement:
        raise HTTPException(status_code=404, detail="Announcement not found")
    announcement_data = announcement.dict(exclude_unset=True)
    for key, value in announcement_data.items():
        setattr(existing_announcement, key, value)
    return update_announcement_crud(db_session, announcement_id, existing_announcement)


@router.delete("/{announcement_id}", response_model=bool)
def delete_announcement(
    announcement_id: int,
    db_session: Session = Depends(get_session),
    current_user=Depends(get_current_user),
):
    if not delete_announcement_crud(db_session, announcement_id):
        raise HTTPException(status_code=404, detail="Announcement not found")
    return True
