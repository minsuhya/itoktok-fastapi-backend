from typing import List, Union

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, desc, select

from ..core import get_session
from ..models.schedule import Schedule
from ..schemas.schedule import ScheduleCreate, ScheduleUpdate, ScheduleRead
from ..crud.schedule import create_schedule, get_schedule, get_schedules, update_schedule, delete_schedule
from ..schemas import ErrorResponse, SuccessResponse

router = APIRouter(
    prefix="/schedules",
    tags=["schedules"],
    dependencies=[Depends(get_session)],
    responses={404: {
        "description": "API Not found"
    }},
)
@router.post("/schedules/", response_model=ScheduleRead)
def create_schedule(schedule: ScheduleCreate, session: Session = Depends(get_session)):
    schedule_data = Schedule.from_orm(schedule)
    return create_schedule(session, schedule_data)

@router.get("/schedules/{schedule_id}", response_model=ScheduleRead)
def read_schedule(schedule_id: int, session: Session = Depends(get_session)):
    schedule = get_schedule(session, schedule_id)
    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")
    return schedule

@router.get("/schedules/", response_model=List[ScheduleRead])
def read_schedules(skip: int = 0, limit: int = 10, session: Session = Depends(get_session)):
    return get_schedules(session, skip=skip, limit=limit)

@router.put("/schedules/{schedule_id}", response_model=ScheduleRead)
def update_schedule(schedule_id: int, schedule: ScheduleUpdate, session: Session = Depends(get_session)):
    existing_schedule = get_schedule(session, schedule_id)
    if not existing_schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")
    schedule_data = schedule.dict(exclude_unset=True)
    for key, value in schedule_data.items():
        setattr(existing_schedule, key, value)
    return update_schedule(session, schedule_id, existing_schedule)

@router.delete("/schedules/{schedule_id}", response_model=bool)
def delete_schedule(schedule_id: int, session: Session = Depends(get_session)):
    if not delete_schedule(session, schedule_id):
        raise HTTPException(status_code=404, detail="Schedule not found")
    return True
