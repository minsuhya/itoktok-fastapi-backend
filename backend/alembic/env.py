import os
import sys
from logging.config import fileConfig
from pathlib import Path

from alembic import context
from dotenv import load_dotenv
from sqlalchemy import engine_from_config, pool
from sqlmodel import SQLModel

# backend/ 디렉토리를 sys.path에 추가
BASE_DIR = Path(__file__).parent.parent
sys.path.insert(0, str(BASE_DIR))

# .env 파일 로드
load_dotenv(BASE_DIR.parent / ".env")

# 모든 모델 import (메타데이터 등록을 위해 필수)
from app.models.user import User, CenterInfo, CenterDirector, Teacher, UserSearchSelectedTeacher  # noqa
from app.models.client import ClientInfo  # noqa
from app.models.schedule import Schedule, ScheduleList  # noqa
from app.models.program import Program  # noqa
from app.models.record import Record  # noqa
from app.models.voucher import Voucher  # noqa
from app.models.announcement import Announcement  # noqa
from app.models.inquiry import Inquiry  # noqa
from app.models.customer import Customer  # noqa

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# SQLModel 메타데이터 사용
target_metadata = SQLModel.metadata

# 환경변수에서 DB URL 읽기 (% 문자가 configparser와 충돌하므로 직접 엔진 생성)
db_url = os.environ.get("CONN_URL")


def run_migrations_offline() -> None:
    url = db_url or config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    if db_url:
        from sqlalchemy import create_engine
        connectable = create_engine(db_url, poolclass=pool.NullPool)
    else:
        connectable = engine_from_config(
            config.get_section(config.config_ini_section, {}),
            prefix="sqlalchemy.",
            poolclass=pool.NullPool,
        )
    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
        )
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
