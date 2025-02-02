import calendar
from collections import OrderedDict
from datetime import date, datetime, timedelta, timezone
from typing import List, Optional, Union

from sqlalchemy import inspect
from sqlalchemy.orm import joinedload
from sqlmodel import Session, delete, select

from ..models.schedule import Schedule, ScheduleList
from ..models.user import User
from ..schemas.schedule import ScheduleCreate, ScheduleUpdate


def hex_to_rgba(hex_color, alpha=1.0):
    hex_color = hex_color.lstrip("#")
    if len(hex_color) != 6:
        raise ValueError("Input #{} is not in #RRGGBB format".format(hex_color))

    r = int(hex_color[0:2], 16)
    g = int(hex_color[2:4], 16)
    b = int(hex_color[4:6], 16)

    return f"rgba({r}, {g}, {b}, {alpha})"


def create_schedule_info(session: Session, schedule_create: ScheduleCreate) -> Schedule:
    # schedule_data 준비
    schedule_data = schedule_create.dict()
    if isinstance(schedule_data.get('repeat_days'), dict):
        schedule_data['repeat_days'] = str(schedule_data['repeat_days'])

    # schedule 생성 
    schedule = Schedule(**schedule_data)
    session.add(schedule)
    session.commit()
    session.refresh(schedule)

    # schedule_list 생성
    current_date = schedule.start_date
    while current_date <= schedule.finish_date:
        create_schedule = False
        
        if schedule.repeat_type == 1:  # 매일
            create_schedule = True
        elif schedule.repeat_type == 2:  # 매주
            repeat_days = eval(schedule.repeat_days)
            weekday = current_date.weekday()
            weekday_map = {
                0: 'mon', 1: 'tue', 2: 'wed', 
                3: 'thu', 4: 'fri', 5: 'sat', 6: 'sun'
            }
            if repeat_days[weekday_map[weekday]]:
                create_schedule = True
        elif schedule.repeat_type == 3:  # 매월
            if current_date.day == schedule.start_date.day:
                create_schedule = True
        else:  # 반복 없음
            create_schedule = True
            
        if create_schedule:
            schedule_list = ScheduleList(
                title = "", # 제목 제거
                teacher_username=schedule.teacher_username,
                client_id=schedule.client_id,
                program_id=schedule_create.program_id,
                schedule_id=schedule.id,
                schedule_date=current_date,
                schedule_time=schedule.start_time,
                schedule_status="1",
                schedule_memo=schedule_create.memo or "",
                created_by=schedule.created_by
            )
            session.add(schedule_list)
            
        current_date += timedelta(days=1)

    session.commit()
    return schedule


def get_schedule(session: Session, schedule_list_id: int) -> Optional[ScheduleList]:
    statement = select(ScheduleList)\
        .options(joinedload(ScheduleList.schedule))\
        .options(joinedload(ScheduleList.teacher))\
        .options(joinedload(ScheduleList.clientinfo))\
        .options(joinedload(ScheduleList.program))\
        .where(ScheduleList.id == schedule_list_id)
    
    print("Raw SQL Query:", statement.compile(compile_kwargs={"literal_binds": True}))
    
    result = session.exec(statement).first()
    print("result:", result)
    return result


def get_schedules(session: Session, skip: int = 0, limit: int = 10) -> List[Schedule]:
    statement = select(Schedule).offset(skip).limit(limit)
    return session.exec(statement).all()


def update_schedule_info(
    session: Session,
    schedule_id: int,
    schedule_update: ScheduleUpdate,
    schedule_list_id: Union[int, None] = None,
) -> Optional[Schedule]:
    # 기존 schedule 조회
    schedule = session.get(Schedule, schedule_id)
    if not schedule:
        return None

    # 현재 선택된 schedule_list 조회
    schedule_list = session.get(ScheduleList, schedule_list_id)
    if not schedule_list:
        return None

    # schedule 업데이트
    update_data = schedule_update.model_dump(exclude_unset=True)
    schedule_fields = Schedule.__fields__.keys()
    for key, value in update_data.items():
        if key in schedule_fields:
            if key == 'repeat_days' and isinstance(value, dict):
                value = str(value)
            setattr(schedule, key, value)
    
    schedule.finish_date = schedule_update.finish_date
    session.add(schedule)
    session.commit()

    # 선택된 일정 이후의 schedule_list 항목 삭제
    delete_query = (
        delete(ScheduleList)
        .where(ScheduleList.schedule_id == schedule.id)
        .where(
            (ScheduleList.schedule_date > schedule_list.schedule_date) |
            ((ScheduleList.schedule_date == schedule_list.schedule_date) &
             (ScheduleList.schedule_time >= schedule_list.schedule_time))
        )
    )
    session.exec(delete_query)
    session.commit()

    # 새로운 schedule_list 생성 - 지난 일정 유지, 새로운 일정 생성
    current_date = schedule_list.schedule_date
    while current_date <= schedule.finish_date:
        create_schedule = False
        
        if schedule.repeat_type == 1:
            create_schedule = True
        elif schedule.repeat_type == 2:
            repeat_days = eval(schedule.repeat_days)
            weekday = current_date.weekday()
            weekday_map = {0: 'mon', 1: 'tue', 2: 'wed', 
                          3: 'thu', 4: 'fri', 5: 'sat', 6: 'sun'}
            if repeat_days[weekday_map[weekday]]:
                create_schedule = True
        elif schedule.repeat_type == 3:
            if current_date.day == schedule.start_date.day:
                create_schedule = True
            
        if create_schedule:
            schedule_list = ScheduleList(
                title="",
                teacher_username=schedule_update.teacher_username,
                client_id=schedule_update.client_id,
                program_id=schedule_update.program_id,
                schedule_id=schedule.id,
                schedule_date=current_date,
                schedule_time=schedule.start_time,
                schedule_status="1",
                schedule_memo=schedule_update.memo or "",
                updated_by=schedule.updated_by
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


def delete_schedule_list_info(session: Session, schedule_list_id: int):
    # schedule 삭제
    session.exec(delete(ScheduleList).where(ScheduleList.id == schedule_list_id))
    session.commit()

    return


# 월별 스케줄 조회
def get_schedule_for_month(session: Session, year: int, month: int, login_user, selected_teachers=None):
    first_day = date(year, month, 1)
    last_day = date(year, month, calendar.monthrange(year, month)[1])

    statement = select(ScheduleList).where(
        ScheduleList.schedule_date.between(first_day, last_day)
    )

    statement = statement.join(Schedule).where(
        ScheduleList.schedule_id == Schedule.id
    )

    # 해당 센터 일정 조정
    statement = (
        statement.join(User)
        .where(Schedule.teacher_username == User.username)
        .where(User.center_username == login_user.center_username)
    )
    
    if selected_teachers:  # 선택된 상담사가 있는 경우
        statement = statement.where(Schedule.teacher_username.in_([t.strip() for t in selected_teachers.split(',')]))
        
    # 쿼리 출력
    print("Generated SQL:", statement.compile(compile_kwargs={"literal_binds": True}))

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
                    "teacher_usercolor": hex_to_rgba(
                        event.schedule.teacher.usercolor, 0.4
                    ),
                    # "teacher_usercolor": f"bg-[{event.schedule.teacher.usercolor}]",
                    # "teacher_usercolor": "bg-[#b77334]/50",
                    "client_id": event.schedule.client_id,
                    "client_name": event.schedule.clientinfo.client_name,
                    "title": event.title,
                    "program_name": event.program.program_name,
                    "start_date": event.schedule.start_date,
                    "finish_date": event.schedule.finish_date,
                    "start_time": event.schedule.start_time,
                    "finish_time": event.schedule.finish_time,
                    "memo": event.schedule_memo,
                    "created_by": event.created_by,
                    "updated_by": event.updated_by,
                }
            )

    return calendar_data


# 주별 스케줄 조회
# Function to get the schedule for the week from the database
def get_schedule_for_week(session: Session, start_date: date, login_user, selected_teachers=None):
    end_date = start_date + timedelta(days=6)  # Get the end date (Sunday of that week)

    statement = select(ScheduleList).where(
        ScheduleList.schedule_date.between(start_date, end_date)
    )

    statement = statement.join(Schedule).where(
        ScheduleList.schedule_id == Schedule.id
    )

    # 해당 센터 일정 조정
    statement = (
        statement.join(User)
        .where(Schedule.teacher_username == User.username)
        .where(User.center_username == login_user.center_username)
    )

    if selected_teachers:  # 선택된 상담사가 있는 경우
        statement = statement.where(Schedule.teacher_username.in_([t.strip() for t in selected_teachers.split(',')]))

    return session.exec(statement).all()


# 주별 캘린더 스케줄 생성
# Function to generate the weekly schedule data structure with empty days included
def generate_weekly_schedule_with_empty_days(start_date: date, schedule_data):
    # Dictionary to hold the weekly schedule with dates as keys
    weekly_schedule_by_day = {}

    # Create a list of days from Monday to Sunday for the given week
    week_days = [
        (start_date + timedelta(days=i)).strftime("%Y-%m-%d") for i in range(7)
    ]

    # Initialize the weekly_schedule with empty days and times
    for day in week_days:
        weekly_schedule_by_day[day] = OrderedDict(
            sorted({f"{hour:d}": [] for hour in range(8, 19)}.items())
        )  # Each day starts with an empty dictionary for times from 09:00 to 18:00

    # Populate the weekly_schedule with actual schedule data
    for event in schedule_data:
        event_day = event.schedule_date.strftime("%Y-%m-%d")  # Get date as 'YYYY-MM-DD'
        event_time = int(event.schedule_time.split(":")[0])  # Extract the time of the event
        # event_time = event.schedule_date.strftime(
        #     "%H:%M"
        # )  # Extract the time of the event

        # If the time is not in the day's dictionary, initialize it
        if event_time not in weekly_schedule_by_day[event_day]:
            weekly_schedule_by_day[event_day][event_time] = []

        # Append the event information to the corresponding date and time
        weekly_schedule_by_day[event_day][event_time].append(
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
                "teacher_usercolor": hex_to_rgba(event.schedule.teacher.usercolor, 0.4),
                # "teacher_usercolor": f"bg-[{event.schedule.teacher.usercolor}]",
                # "teacher_usercolor": "bg-[#b77334]/50",
                "client_id": event.schedule.client_id,
                "client_name": event.schedule.clientinfo.client_name,
                "title": event.title,
                "program_name": event.program.program_name,
                "start_date": event.schedule.start_date,
                "finish_date": event.schedule.finish_date,
                "start_time": event.schedule.start_time,
                "finish_time": event.schedule.finish_time,
                "memo": event.schedule_memo,
                "created_by": event.created_by,
                "updated_by": event.updated_by,
            }
        )
        # # 기존 weekly_schedule 구조
        # weekly_schedule = {
        #     "Monday": {
        #         "09:00": [{"id": 1, "title": "Math Class"}],
        #         "10:00": [{"id": 2, "title": "Science Class"}]
        #     },
        #     "Tuesday": {
        #         "09:00": [{"id": 3, "title": "History Class"}],
        #         "11:00": [{"id": 4, "title": "Art Class"}]
        #     }
        # }

        # 새로운 구조를 저장할 딕셔너리
        # weekly_schedule_by_time = {}
        #
        # # 기존 구조를 순회하며 새로운 구조로 변환
        # for event_day, times in weekly_schedule_by_day.items():
        #     for event_time, events in times.items():
        #         if event_time not in weekly_schedule_by_time:
        #             weekly_schedule_by_time[event_time] = {}
        #         weekly_schedule_by_time[event_time][event_day] = events
        #
        # # 변환된 구조 출력
        # # print(weekly_schedule_by_time)

    return weekly_schedule_by_day


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
                "teacher_usercolor": hex_to_rgba(event.schedule.teacher.usercolor, 0.4),
                # "teacher_usercolor": "bg-[#b77334]/50",
                "client_id": event.schedule.client_id,
                "client_name": event.schedule.clientinfo.client_name,
                "title": event.title,
                "program_name": event.program.program_name,
                "start_date": event.schedule.start_date,
                "finish_date": event.schedule.finish_date,
                "start_time": event.schedule.start_time,
                "finish_time": event.schedule.finish_time,
                "memo": event.schedule_memo,
                "created_by": event.created_by,
                "updated_by": event.updated_by,
            }
        )

    return daily_schedule
