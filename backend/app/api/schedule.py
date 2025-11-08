from datetime import date, datetime, timedelta
from typing import List, Optional, Union

from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlmodel import Session, desc, select

from ..core import get_session
from ..crud.schedule import (
    create_schedule_info,
    delete_schedule_info,
    delete_schedule_list_info,
    generate_daily_schedule_with_empty_times,
    generate_monthly_calendar_without_timeslots,
    generate_weekly_schedule_with_empty_days,
    get_schedule,
    get_schedule_for_day,
    get_schedule_for_month,
    get_schedule_for_week,
    get_schedules,
    update_schedule_info,
)
from ..models.schedule import Schedule, ScheduleList
from ..models.user import User
from ..schemas import ErrorResponse, SuccessResponse
from ..schemas.schedule import (
    ScheduleCreate,
    ScheduleListCreate,
    ScheduleListRead,
    ScheduleListUpdate,
    ScheduleRead,
    ScheduleUpdate,
)
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


@router.delete(
    "/{schedule_id}/{schedule_list_id}", response_model=SuccessResponse[ScheduleRead]
)
def delete_schedule(
    schedule_id: int,
    schedule_list_id: int,
    update_range: str,
    session: Session = Depends(get_session),
):
    schedule = delete_schedule_info(
        session, schedule_id, schedule_list_id, update_range
    )
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
        selected_teachers=selected_teachers,
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
        session,
        start_of_week,
        login_user=current_user,
        selected_teachers=selected_teachers,
    )
    weekly_calendar_data = generate_weekly_schedule_with_empty_days(
        start_of_week, schedule_data
    )

    return SuccessResponse(data=weekly_calendar_data)


# get daily calendar
@router.get("/calendar/daily/{year}/{month}/{day}")
def get_daily_calendar(
    year: int,
    month: int,
    day: int,
    selected_teachers: Optional[str] = Query(None),
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    target_date = date(year, month, day)

    schedule_data = get_schedule_for_day(
        session,
        target_date,
        login_user=current_user,
        selected_teachers=selected_teachers,
    )
    daily_calendar_data = generate_daily_schedule_with_empty_times(
        target_date, schedule_data
    )

    return SuccessResponse(data=daily_calendar_data)


@router.put("/update-date")
async def update_schedule_date(
    request: Request,
    schedule_id: int,
    schedule_list_id: int,
    new_date: str,
    update_all_future: bool = False,
    db: Session = Depends(get_session),
):
    try:
        # 현재 일정 정보 조회
        current_schedule = (
            db.query(ScheduleList)
            .filter(
                ScheduleList.id == schedule_list_id,
                ScheduleList.schedule_id == schedule_id,
            )
            .first()
        )

        if not current_schedule:
            raise HTTPException(status_code=404, detail="Schedule not found")

        if update_all_future:
            # 현재 일정 이후의 모든 일정 업데이트
            future_schedules = (
                db.query(ScheduleList)
                .filter(
                    ScheduleList.schedule_id == schedule_id,
                    ScheduleList.schedule_date >= current_schedule.schedule_date,
                )
                .all()
            )

            for schedule in future_schedules:
                # 날짜 차이 계산
                current_date = datetime.strptime(
                    current_schedule.schedule_date, "%Y-%m-%d"
                )
                schedule_date = datetime.strptime(schedule.schedule_date, "%Y-%m-%d")
                date_diff = (schedule_date - current_date).days

                # 새로운 날짜 계산
                new_schedule_date = datetime.strptime(new_date, "%Y-%m-%d") + timedelta(
                    days=date_diff
                )
                schedule.schedule_date = new_schedule_date.strftime("%Y-%m-%d")

        else:
            # 현재 일정만 업데이트
            current_schedule.schedule_date = new_date

        db.commit()
        return SuccessResponse(
            data={"success": True, "message": "Schedule updated successfully"}
        )

    except Exception as e:
        db.rollback()
        return ErrorResponse(
            status_code=500,
            message="일정 업데이트 중 오류가 발생했습니다",
            error=str(e),
        )


@router.put("/update-date-time")
async def update_schedule_date_time(
    request: Request,
    schedule_id: int,
    schedule_list_id: int,
    new_date: str,
    new_time: int,
    update_all_future: bool = False,
    db: Session = Depends(get_session),
):
    try:
        # 현재 일정 정보 조회
        current_schedule = (
            db.query(ScheduleList)
            .filter(
                ScheduleList.id == schedule_list_id,
                ScheduleList.schedule_id == schedule_id,
            )
            .first()
        )

        if not current_schedule:
            raise HTTPException(status_code=404, detail="Schedule not found")

        # 기존 schedule_time과 schedule_finish_time 파싱
        orig_start = datetime.strptime(current_schedule.schedule_time, "%H:%M")
        orig_finish = datetime.strptime(current_schedule.schedule_finish_time, "%H:%M")
        time_delta = orig_finish - orig_start

        # 기존 분 추출하여 새로운 시작 시간 생성
        current_schedule_minutes = current_schedule.schedule_time.split(":")[1]
        schedule_time = f"{new_time:02d}:{current_schedule_minutes}"
        new_start = datetime.strptime(schedule_time, "%H:%M")
        # 새로운 종료 시간 계산하여 HH:MM 형식으로 저장
        schedule_finish_time = (new_start + time_delta).strftime("%H:%M")

        if update_all_future:
            # 현재 일정 이후의 모든 일정 업데이트
            future_schedules = (
                db.query(ScheduleList)
                .filter(
                    ScheduleList.schedule_id == schedule_id,
                    ScheduleList.schedule_date >= current_schedule.schedule_date,
                )
                .all()
            )

            for schedule in future_schedules:
                # 날짜 차이 계산
                current_date = datetime.strptime(
                    current_schedule.schedule_date, "%Y-%m-%d"
                )
                schedule_date = datetime.strptime(schedule.schedule_date, "%Y-%m-%d")
                date_diff = (schedule_date - current_date).days

                # 새로운 날짜 계산
                new_schedule_date = datetime.strptime(new_date, "%Y-%m-%d") + timedelta(
                    days=date_diff
                )
                schedule.schedule_date = new_schedule_date.strftime("%Y-%m-%d")

                # 시간 업데이트
                schedule.schedule_time = schedule_time
                schedule.schedule_finish_time = schedule_finish_time
        else:
            # 현재 일정만 업데이트
            current_schedule.schedule_date = new_date
            current_schedule.schedule_time = schedule_time
            current_schedule.schedule_finish_time = schedule_finish_time

        db.commit()
        return SuccessResponse(
            data={"success": True, "message": "Schedule updated successfully"}
        )

    except Exception as e:
        db.rollback()
        return ErrorResponse(
            status_code=500,
            message="일정 업데이트 중 오류가 발생했습니다",
            error=str(e),
        )
