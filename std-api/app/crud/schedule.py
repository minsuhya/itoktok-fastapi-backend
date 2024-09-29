import calendar
from datetime import date, datetime, timedelta, timezone
from typing import List, Optional

from sqlalchemy.orm import joinedload
from sqlmodel import Session, select

from ..models.schedule import Schedule, ScheduleList
from ..schemas.schedule import ScheduleCreate, ScheduleUpdate


def create_schedule_info(session: Session, schedule_create: ScheduleCreate) -> Schedule:
    # schedule 생성
    schedule = Schedule(**schedule_create.dict())
    session.add(schedule)
    session.commit()
    session.refresh(schedule)

    # schedule_list 생성
    current_date = schedule.start_date
    while current_date <= schedule.finish_date:
        schedule_list = ScheduleList(
            schedule_id=schedule.id,
            schedule_date=current_date,
            schedule_time=schedule.start_time,
            schedule_status="1",
            schedule_memo="",
        )
        session.add(schedule_list)
        current_date += timedelta(days=1)

    session.commit()
    return schedule


def get_schedule(session: Session, schedule_id: int) -> Optional[Schedule]:
    return session.exec(
        select(Schedule)
        .options(joinedload(Schedule.teacher))
        .options(joinedload(Schedule.clientinfo))
        .where(Schedule.id == schedule_id)
    ).first()


def get_schedules(session: Session, skip: int = 0, limit: int = 10) -> List[Schedule]:
    statement = select(Schedule).offset(skip).limit(limit)
    return session.exec(statement).all()


def update_schedule_info(
    session: Session, schedule_id: int, schedule_update: ScheduleUpdate
) -> Optional[Schedule]:

    # schedule 업데이트
    schedule = session.get(Schedule, schedule_id)
    if not schedule:
        return None

    update_data = schedule_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(schedule, key, value)

    schedule.updated_at = datetime.now(timezone.utc)
    session.commit()
    session.refresh(schedule)

    # 오늘 날짜 이후의 schedule_list 항목 업데이트
    today = datetime.now().date()
    if schedule.start_date <= today <= schedule.finish_date:
        current_date = today
    else:
        current_date = schedule.start_date

    # SQLModel 쿼리로 schedule_list 항목 삭제
    session.exec(
        select(ScheduleList)
        .where(ScheduleList.schedule_id == schedule.id)
        .where(ScheduleList.schedule_date >= current_date)
        .delete()
    )

    # schedule_list 항목 재생성
    while current_date <= schedule.finish_date:
        schedule_list = ScheduleList(
            schedule_id=schedule.id,
            schedule_date=current_date,
            schedule_time=schedule.start_time,
            schedule_status="1",
            schedule_memo="",
        )
        session.add(schedule_list)
        current_date += timedelta(days=1)

    session.commit()
    return schedule


def delete_schedule_info(session: Session, schedule_id: int) -> Optional[Schedule]:
    schedule = session.get(Schedule, schedule_id)
    if not schedule:
        return None

    # 오늘 날짜 이후의 schedule_list 항목 삭제
    today = datetime.now().date()
    session.exec(
        select(ScheduleList)
        .where(ScheduleList.schedule_id == schedule.id)
        .where(ScheduleList.schedule_date >= today)
        .delete()
    )

    # schedule 삭제
    session.delete(schedule)
    session.commit()

    return schedule


# 월별 스케줄 조회
def get_schedule_for_month(session: Session, year: int, month: int):
    first_day = date(year, month, 1)
    last_day = date(year, month, calendar.monthrange(year, month)[1])

    statement = select(ScheduleList).where(
        ScheduleList.schedule_date.between(first_day, last_day)
    )
    return session.exec(statement).all()


# 월별 캘린더 스케줄 생성
def generate_monthly_calendar_without_timeslots(year: int, month: int, schedule_data):
    # Get the first and last day of the month
    first_day, last_day = 1, calendar.monthrange(year, month)[1]

    # Get the day of the week the first day of the month starts on
    start_day_of_week = calendar.monthrange(year, month)[0]

    # Create a dictionary to hold the calendar data (date as key)
    calendar_data = {}

    # Fill in dates for the previous month to complete the first week
    if start_day_of_week > 0:
        prev_month_last_day = (date(year, month, 1) - timedelta(days=1)).day
        prev_month_year, prev_month = (year, month - 1) if month > 1 else (year - 1, 12)
        for day in range(
            prev_month_last_day - start_day_of_week + 1, prev_month_last_day + 1
        ):
            calendar_data[
                f"{prev_month_year}-{str(prev_month).zfill(2)}-{str(day).zfill(2)}"
            ] = []

    # Fill in dates for the current month
    for day in range(first_day, last_day + 1):
        calendar_data[f"{year}-{str(month).zfill(2)}-{str(day).zfill(2)}"] = []

    # Fill in dates for the next month to complete the last week
    next_month_day = 1
    next_month_year, next_month = (year, month + 1) if month < 12 else (year + 1, 1)
    while len(calendar_data) % 7 != 0:
        calendar_data[
            f"{next_month_year}-{str(next_month).zfill(2)}-{str(next_month_day).zfill(2)}"
        ] = []
        next_month_day += 1

    # Annotate the schedule with start time and event details
    for event in schedule_data:
        event_day = event.schedule_date.strftime("%Y-%m-%d")

        # Add the event to the correct day in the calendar
        if event_day in calendar_data:
            calendar_data[event_day].append(
                {
                    "id": event.id,
                    "schedule_id": event.schedule_id,
                    "schedule_date": event.schedule_date,
                    "schedule_time": event.schedule_time,
                    "schedule_status": event.schedule_status,
                    "schedule_memo": event.schedule_memo,
                    "teacher_username": event.schedule.teacher_username,
                    "teacher_fullname": event.schedule.teacher.full_name,
                    "teacher_expertise": event.schedule.teacher.expertise,
                    "teacher_usercolor": f"bg-[{event.schedule.teacher.usercolor}]",
                    # "teacher_usercolor": "bg-[#b77334]/50",
                    "client_id": event.schedule.client_id,
                    "client_name": event.schedule.clientinfo.client_name,
                    "title": event.schedule.title,
                    "start_date": event.schedule.start_date,
                    "finish_date": event.schedule.finish_date,
                    "start_time": event.schedule.start_time,
                    "finish_time": event.schedule.finish_time,
                    "memo": event.schedule.memo,
                    "created_by": event.schedule.created_by,
                    "updated_by": event.schedule.updated_by,
                }
            )

    return calendar_data


# 주별 스케줄 조회
# Function to get the schedule for the week from the database
def get_schedule_for_week(session: Session, start_date: date):
    end_date = start_date + timedelta(days=6)  # Get the end date (Sunday of that week)

    statement = select(ScheduleList).where(
        ScheduleList.schedule_date.between(start_date, end_date)
    )
    return session.exec(statement).all()


# 주별 캘린더 스케줄 생성
# Function to generate the weekly schedule data structure with empty days included
def generate_weekly_schedule_with_empty_days(start_date: date, schedule_data):
    # Dictionary to hold the weekly schedule with dates as keys
    weekly_schedule = {}

    # Create a list of days from Monday to Sunday for the given week
    week_days = [
        (start_date + timedelta(days=i)).strftime("%Y-%m-%d") for i in range(7)
    ]

    # Initialize the weekly_schedule with empty days
    for day in week_days:
        weekly_schedule[day] = {}  # Each day starts with an empty dictionary for times

    # Populate the weekly_schedule with actual schedule data
    for event in schedule_data:
        event_day = event.schedule_date.strftime("%Y-%m-%d")  # Get date as 'YYYY-MM-DD'
        event_time = event.schedule_date.strftime(
            "%H:%M"
        )  # Extract the time of the event

        # If the time is not in the day's dictionary, initialize it
        if event_time not in weekly_schedule[event_day]:
            weekly_schedule[event_day][event_time] = []

        # Append the event information to the corresponding date and time
        weekly_schedule[event_day][event_time].append(
            {
                "id": event.id,
                "title": event.title,
                "datetime": event.schedule_date,
            }
        )

    return weekly_schedule


# 일별 스케줄 조회
# Function to get the schedule for a specific day from the database
def get_schedule_for_day(session: Session, target_date: date):
    statement = select(ScheduleList).where(ScheduleList.schedule_date == target_date)
    return session.exec(statement).all()


# 일별 캘린더 스케줄 생성
# Function to generate the daily schedule data structure
def generate_daily_schedule_with_empty_times(target_date: date, schedule_data):
    # Dictionary to hold the daily schedule with hours as keys and minutes as sub-keys
    daily_schedule = {}

    # Create a list of times from 00:00 to 23:59 for the given day
    for hour in range(8, 19):
        daily_schedule[f"{hour:d}"] = {f"{minute:d}": [] for minute in range(0, 60, 10)}

    print("daily_schedule", daily_schedule)

    # Populate the daily_schedule with actual schedule data
    for event in schedule_data:
        event_hour = str(
            int(event.schedule_time.split(":")[0])
        )  # Extract the minute of the event
        event_minute = str(
            int(event.schedule_time.split(":")[1])
        )  # Extract the minute of the event

        # Append the event information to the corresponding hour and minute
        daily_schedule[event_hour][event_minute].append(
            {
                "id": event.id,
                "schedule_id": event.schedule_id,
                "schedule_date": event.schedule_date,
                "schedule_time": event.schedule_time,
                "schedule_status": event.schedule_status,
                "schedule_memo": event.schedule_memo,
                "teacher_username": event.schedule.teacher_username,
                "teacher_fullname": event.schedule.teacher.full_name,
                "teacher_expertise": event.schedule.teacher.expertise,
                "teacher_usercolor": f"bg-[{event.schedule.teacher.usercolor}]",
                # "teacher_usercolor": "bg-[#b77334]/50",
                "client_id": event.schedule.client_id,
                "client_name": event.schedule.clientinfo.client_name,
                "title": event.schedule.title,
                "start_date": event.schedule.start_date,
                "finish_date": event.schedule.finish_date,
                "start_time": event.schedule.start_time,
                "finish_time": event.schedule.finish_time,
                "memo": event.schedule.memo,
                "created_by": event.schedule.created_by,
                "updated_by": event.schedule.updated_by,
            }
        )

    return daily_schedule
