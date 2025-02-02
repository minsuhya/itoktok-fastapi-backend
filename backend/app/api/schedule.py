from datetime import date, datetime, timedelta
from typing import List, Optional, Union

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, desc, select

from ..core import get_session
from ..crud.schedule import (create_schedule_info, delete_schedule_info,
                             delete_schedule_list_info,
                             generate_daily_schedule_with_empty_times,
                             generate_monthly_calendar_without_timeslots,
                             generate_weekly_schedule_with_empty_days,
                             get_schedule, get_schedule_for_day,
                             get_schedule_for_month, get_schedule_for_week,
                             get_schedules, update_schedule_info)
from ..models.schedule import Schedule
from ..models.user import User
from ..schemas import ErrorResponse, SuccessResponse
from ..schemas.schedule import (ScheduleCreate, ScheduleListCreate,
                                ScheduleListRead, ScheduleListUpdate,
                                ScheduleRead, ScheduleUpdate)
from .auth import get_current_user

router = APIRouter(
    prefix="/schedules",
    tags=["schedules"],
    dependencies=[Depends(get_session)],
    responses={404: {"description": "API Not found"}},
)


@router.post("", response_model=Schedule)
def create_schedule(
    schedule_create: ScheduleCreate, session: Session = Depends(get_session)
):
    # exclude_unset=True 옵션을 사용하여 세팅되지 않은 필드 제외
    schedule_data = schedule_create.dict(exclude_unset=True)
    schedule = create_schedule_info(session, ScheduleCreate(**schedule_data))
    return schedule


@router.get("/{schedule_list_id}", response_model=ScheduleListRead)
def read_schedule(schedule_list_id: int, session: Session = Depends(get_session)):
    schedule_list_info = get_schedule(session, schedule_list_id)
    print("schedule_list_info:", schedule_list_info)
    if not schedule_list_info:
        raise HTTPException(status_code=404, detail="Schedule not found")
    return schedule_list_info


@router.get("", response_model=List[ScheduleRead])
def read_schedules(
    skip: int = 0, limit: int = 10, session: Session = Depends(get_session)
):
    return get_schedules(session, skip=skip, limit=limit)


@router.put(
    "/{schedule_id}/{schedule_list_id}", response_model=SuccessResponse[ScheduleRead]
)
def update_schedule(
    schedule_id: int,
    schedule_update: ScheduleUpdate,
    schedule_list_id: Optional[int] = None,
    session: Session = Depends(get_session),
):
    schedule = update_schedule_info(
        session, schedule_id, schedule_update, schedule_list_id=schedule_list_id
    )
    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")
    return SuccessResponse(data=schedule)


@router.delete("/{schedule_id}", response_model=SuccessResponse[ScheduleRead])
def delete_schedule(schedule_id: int, session: Session = Depends(get_session)):
    schedule = delete_schedule_info(session, schedule_id)
    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")
    return SuccessResponse(data=schedule)


@router.delete("/list/{schedule_list_id}", response_model=SuccessResponse[ScheduleRead])
def delete_schedule_list(
    schedule_list_id: int, session: Session = Depends(get_session)
):
    delete_schedule_list_info(session, schedule_list_id)
    return SuccessResponse(data={})


# get monthly calendar
@router.get("/calendar/{year}/{month}")
def get_monthly_calendar(
    year: int,
    month: int,
    selected_teachers: Optional[str] = Query(None),
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    schedule_data = get_schedule_for_month(
        session, 
        year, 
        month, 
        login_user=current_user,
        selected_teachers=selected_teachers
    )
    monthly_calendar_data = generate_monthly_calendar_without_timeslots(
        year, month, schedule_data
    )

    return SuccessResponse(data=monthly_calendar_data)


# get weekly calendar
@router.get("/calendar/{year}/{month}/{day}")
def get_weekly_calendar(
    year: int,
    month: int,
    day: int,
    selected_teachers: Optional[str] = Query(None),
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    today = date(year, month, day)

    start_of_week = today - timedelta(
        days=today.weekday()
    )  # Monday of the current week

    schedule_data = get_schedule_for_week(
        session, start_of_week, login_user=current_user, selected_teachers=selected_teachers
    )
    weekly_calendar_data = generate_weekly_schedule_with_empty_days(
        start_of_week, schedule_data
    )

    return SuccessResponse(data=weekly_calendar_data)


# get daily calendar
@router.get("/calendar/daily/{year}/{month}/{day}")
def get_daily_calendar(
    year: int, month: int, day: int, session: Session = Depends(get_session)
):
    target_date = date(year, month, day)

    schedule_data = get_schedule_for_day(session, target_date)
    daily_calendar_data = generate_daily_schedule_with_empty_times(
        target_date, schedule_data
    )

    return SuccessResponse(data=daily_calendar_data)
