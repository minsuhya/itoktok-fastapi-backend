from datetime import date, datetime, timedelta
from typing import List, Union

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, desc, select

from ..core import get_session
from ..crud.schedule import (create_schedule_info, delete_schedule_info,
                             generate_monthly_calendar_without_timeslots,
                             generate_weekly_schedule_with_empty_days,
                             get_schedule, get_schedule_for_month,
                             get_schedule_for_week, get_schedules,
                             update_schedule_info)
from ..models.schedule import Schedule
from ..schemas import ErrorResponse, SuccessResponse
from ..schemas.schedule import (ScheduleCreate, ScheduleListCreate,
                                ScheduleListRead, ScheduleListUpdate,
                                ScheduleRead, ScheduleUpdate)

router = APIRouter(
    prefix="/schedules",
    tags=["schedules"],
    dependencies=[Depends(get_session)],
    responses={404: {"description": "API Not found"}},
)


@router.post("", response_model=ScheduleRead)
def create_schedule(
    schedule_create: ScheduleCreate, session: Session = Depends(get_session)
):
    schedule = create_schedule_info(session, schedule_create)
    return schedule


@router.get("/{schedule_id}", response_model=ScheduleRead)
def read_schedule(schedule_id: int, session: Session = Depends(get_session)):
    schedule = get_schedule(session, schedule_id)
    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")
    return schedule


@router.get("", response_model=List[ScheduleRead])
def read_schedules(
    skip: int = 0, limit: int = 10, session: Session = Depends(get_session)
):
    return get_schedules(session, skip=skip, limit=limit)


@router.put("/{schedule_id}", response_model=SuccessResponse[ScheduleRead])
def update_schedule(
    schedule_id: int,
    schedule_update: ScheduleUpdate,
    session: Session = Depends(get_session),
):
    schedule = update_schedule_info(session, schedule_id, schedule_update)
    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")
    return SuccessResponse(data=schedule)


@router.delete("/{schedule_id}", response_model=SuccessResponse[ScheduleRead])
def delete_schedule(schedule_id: int, session: Session = Depends(get_session)):
    schedule = delete_schedule_info(session, schedule_id)
    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")
    return SuccessResponse(data=schedule)


# get monthly calendar
@router.get("/calendar/{year}/{month}")
def get_monthly_calendar(
    year: int, month: int, session: Session = Depends(get_session)
):
    schedule_data = get_schedule_for_month(session, year, month)
    print("schedule_data", schedule_data)
    monthly_calendar_data = generate_monthly_calendar_without_timeslots(
        year, month, schedule_data
    )

    return SuccessResponse(data=monthly_calendar_data)


# get weekly calendar
@router.get("/calendar/{year}/{month}/{day}")
def get_weekly_calendar(
    year: int, month: int, day: int, session: Session = Depends(get_session)
):
    today = date(year, month, day)

    start_of_week = today - timedelta(
        days=today.weekday()
    )  # Monday of the current week

    schedule_data = get_schedule_for_week(session, start_of_week)
    weekly_calendar_data = generate_weekly_schedule_with_empty_days(
        start_of_week, schedule_data
    )

    return SuccessResponse(data=weekly_calendar_data)
