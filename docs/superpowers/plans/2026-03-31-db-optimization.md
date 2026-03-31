# DB 최적화 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 코드 기반 테이블 사용 현황 분석 → 스키마 정합성 확인 → Alembic 도입 → 레거시 테이블 안전 처리

**Architecture:** 분석 스크립트로 실제 사용 테이블을 확정한 후, Alembic을 도입하여 현재 상태를 베이스라인으로 설정하고, 레거시 테이블(`CenterDirector`, `Teacher`, `Customer`)을 코드에서 제거한다. 프로덕션 DB는 rename → 관찰 → 삭제 순서로 안전하게 처리한다.

**Tech Stack:** FastAPI, SQLModel, MySQL/MariaDB, Alembic, Python 3.9+, Poetry

---

## 파일 구조

### 새로 생성
- `backend/alembic.ini` — Alembic 설정
- `backend/alembic/env.py` — DB 연결 + SQLModel 메타데이터 연결
- `backend/alembic/script.py.mako` — migration 파일 템플릿
- `backend/alembic/versions/` — migration 파일 디렉토리
- `backend/scripts/analyze_db_usage.py` — 테이블 사용 현황 분석 스크립트
- `backend/scripts/verify_legacy_mapping.py` — 레거시 테이블 데이터 매핑 검증 SQL

### 수정
- `backend/pyproject.toml` — alembic 의존성 추가
- `backend/app/main.py` — customer_router, teacher_router 제거
- `backend/app/api/__init__.py` — customer, teacher export 제거
- `backend/app/models/user.py` — `CenterDirector`, `Teacher` 클래스 제거
- `backend/app/models/customer.py` — 파일 전체 삭제
- `backend/app/crud/customer.py` — 파일 전체 삭제
- `backend/app/crud/teacher.py` — 파일 전체 삭제
- `backend/app/api/customer.py` — 파일 전체 삭제
- `backend/app/api/teacher.py` — 파일 전체 삭제
- `backend/app/schemas/` — customer, teacher 관련 스키마 제거

---

## Task 1: 테이블 사용 현황 분석 스크립트 작성

**Files:**
- Create: `backend/scripts/analyze_db_usage.py`

- [ ] **Step 1: scripts 디렉토리 생성**

```bash
mkdir -p /Users/rupi/Colima/gillilab/itoktok/backend/scripts
touch /Users/rupi/Colima/gillilab/itoktok/backend/scripts/__init__.py
```

- [ ] **Step 2: 분석 스크립트 작성**

`backend/scripts/analyze_db_usage.py` 를 생성한다:

```python
"""
테이블 사용 현황 분석 스크립트
- 각 모델이 CRUD/API/프론트에서 실제 사용되는지 분석
- 실행: cd backend && poetry run python scripts/analyze_db_usage.py
"""
import os
import ast
import sys
from pathlib import Path

BASE_DIR = Path(__file__).parent.parent

MODELS = {
    "User": "user",
    "CenterInfo": "centerinfo",
    "ClientInfo": "clientinfo",
    "Schedule": "schedule",
    "ScheduleList": "schedulelist",
    "Program": "program",
    "Record": "record",
    "Voucher": "voucher",
    "Announcement": "announcement",
    "Inquiry": "inquiry",
    "CenterDirector": "centerdirector",
    "Teacher": "teacher",
    "Customer": "customer",
    "UserSearchSelectedTeacher": "user_search_selected_teacher",
}

def find_usages(directory: Path, keyword: str) -> list[str]:
    """디렉토리 내 Python 파일에서 keyword 사용 여부 반환"""
    usages = []
    for py_file in directory.rglob("*.py"):
        try:
            content = py_file.read_text(encoding="utf-8")
            if keyword in content:
                usages.append(str(py_file.relative_to(BASE_DIR)))
        except Exception:
            pass
    return usages

def main():
    crud_dir = BASE_DIR / "app" / "crud"
    api_dir = BASE_DIR / "app" / "api"
    frontend_api_dir = BASE_DIR.parent / "frontend" / "src" / "api"

    print("=" * 70)
    print(f"{'테이블/모델':<30} {'CRUD':^8} {'API':^8} {'프론트':^8} {'상태':^10}")
    print("=" * 70)

    for model_name, table_name in MODELS.items():
        crud_files = find_usages(crud_dir, model_name)
        api_files = find_usages(api_dir, model_name)
        frontend_files = find_usages(frontend_api_dir, table_name) if frontend_api_dir.exists() else []

        crud_mark = "✅" if crud_files else "❌"
        api_mark = "✅" if api_files else "❌"
        front_mark = "✅" if frontend_files else "❌"

        if crud_files and api_files and frontend_files:
            status = "사용중"
        elif not crud_files and not api_files:
            status = "레거시"
        elif crud_files and api_files and not frontend_files:
            status = "부분사용"
        else:
            status = "불명확"

        print(f"{model_name:<30} {crud_mark:^8} {api_mark:^8} {front_mark:^8} {status:^10}")

    print("=" * 70)
    print("\n[상세 정보]")
    for model_name, _ in MODELS.items():
        crud_files = find_usages(crud_dir, model_name)
        api_files = find_usages(api_dir, model_name)
        if not crud_files and not api_files:
            print(f"\n  {model_name}: CRUD/API 미사용 → 레거시 후보")

if __name__ == "__main__":
    main()
```

- [ ] **Step 3: 스크립트 실행 및 결과 확인**

```bash
cd /Users/rupi/Colima/gillilab/itoktok/backend
poetry run python scripts/analyze_db_usage.py
```

예상 출력: `Customer`, `CenterDirector`, `Teacher` 가 CRUD/API 에서 사용됨을 확인 (teacher_router, customer_router가 main.py에 등록되어 있으므로)

- [ ] **Step 4: 결과를 docs에 기록**

분석 결과를 `docs/superpowers/specs/2026-03-31-db-optimization-design.md` 의 단계 1 산출물 표에 실제 결과로 업데이트한다.

- [ ] **Step 5: 커밋**

```bash
cd /Users/rupi/Colima/gillilab/itoktok
git add backend/scripts/
git commit -m "chore: 테이블 사용 현황 분석 스크립트 추가"
```

---

## Task 2: 스키마 정합성 확인

**Files:**
- Create: `backend/scripts/verify_schema.py`
- Read: `database/itoktok-20260330-schema.sql`

- [x] **Step 1: SQL 덤프에서 테이블 목록 추출**

```bash
grep "^CREATE TABLE" /Users/rupi/Colima/gillilab/itoktok/database/itoktok-20260330-schema.sql | sed "s/CREATE TABLE[^'\`]*['\`]\([^'\`]*\)['\`].*/\1/"
```

예상 출력: DB에 실제 존재하는 테이블 목록

- [x] **Step 2: SQLModel 모델에서 테이블 목록 추출**

```bash
cd /Users/rupi/Colima/gillilab/itoktok/backend
poetry run python -c "
from app.models.user import User, CenterInfo, CenterDirector, Teacher, UserSearchSelectedTeacher
from app.models.client import ClientInfo
from app.models.schedule import Schedule, ScheduleList
from app.models.program import Program
from app.models.record import Record
from app.models.voucher import Voucher
from app.models.announcement import Announcement
from app.models.inquiry import Inquiry
from app.models.customer import Customer
from sqlmodel import SQLModel
for t in SQLModel.metadata.tables:
    print(t)
"
```

- [x] **Step 3: 스키마 정합성 검증 스크립트 작성**

`backend/scripts/verify_schema.py` 를 생성한다:

```python
"""
스키마 정합성 검증 스크립트
SQL 덤프와 SQLModel 모델 정의를 비교하여 불일치를 보고한다.
실행: cd backend && poetry run python scripts/verify_schema.py
"""
import re
from pathlib import Path

BASE_DIR = Path(__file__).parent.parent
SQL_DUMP = BASE_DIR.parent / "database" / "itoktok-20260330-schema.sql"


def parse_sql_tables(sql_path: Path) -> dict[str, list[str]]:
    """SQL 덤프에서 테이블명과 컬럼명 추출"""
    tables = {}
    current_table = None
    columns = []

    content = sql_path.read_text(encoding="utf-8")
    for line in content.splitlines():
        line = line.strip()
        # CREATE TABLE 감지
        m = re.match(r"CREATE TABLE[^`]*`([^`]+)`", line)
        if m:
            current_table = m.group(1)
            columns = []
            continue
        # 컬럼 정의 감지 (백틱으로 시작하는 라인)
        if current_table and line.startswith("`"):
            col_m = re.match(r"`([^`]+)`\s+(\S+)", line)
            if col_m:
                columns.append(f"{col_m.group(1)} ({col_m.group(2)})")
        # 테이블 끝 감지
        if current_table and line.startswith(")"):
            tables[current_table] = columns
            current_table = None

    return tables


def get_sqlmodel_tables() -> dict[str, list[str]]:
    """SQLModel 메타데이터에서 테이블/컬럼 추출"""
    import sys
    sys.path.insert(0, str(BASE_DIR))

    from app.models.user import User, CenterInfo, CenterDirector, Teacher, UserSearchSelectedTeacher
    from app.models.client import ClientInfo
    from app.models.schedule import Schedule, ScheduleList
    from app.models.program import Program
    from app.models.record import Record
    from app.models.voucher import Voucher
    from app.models.announcement import Announcement
    from app.models.inquiry import Inquiry
    from app.models.customer import Customer
    from sqlmodel import SQLModel

    result = {}
    for table_name, table in SQLModel.metadata.tables.items():
        result[table_name] = [f"{col.name} ({col.type})" for col in table.columns]
    return result


def main():
    print("스키마 정합성 검증")
    print("=" * 60)

    sql_tables = parse_sql_tables(SQL_DUMP)
    model_tables = get_sqlmodel_tables()

    sql_names = set(sql_tables.keys())
    model_names = set(model_tables.keys())

    # DB에만 있는 테이블
    only_in_db = sql_names - model_names
    if only_in_db:
        print(f"\n[경고] DB에만 있는 테이블 (모델 없음): {only_in_db}")

    # 모델에만 있는 테이블
    only_in_model = model_names - sql_names
    if only_in_model:
        print(f"\n[경고] 모델에만 있는 테이블 (DB 없음): {only_in_model}")

    # 공통 테이블 컬럼 비교
    common = sql_names & model_names
    print(f"\n[공통 테이블 {len(common)}개 컬럼 비교]")
    for table in sorted(common):
        sql_cols = set(c.split(" ")[0] for c in sql_tables[table])
        model_cols = set(c.split(" ")[0] for c in model_tables[table])
        only_sql = sql_cols - model_cols
        only_model = model_cols - sql_cols
        if only_sql or only_model:
            print(f"\n  {table}:")
            if only_sql:
                print(f"    DB에만 있는 컬럼: {only_sql}")
            if only_model:
                print(f"    모델에만 있는 컬럼: {only_model}")
        else:
            print(f"  {table}: OK")

    print("\n완료.")


if __name__ == "__main__":
    main()
```

- [x] **Step 4: 스크립트 실행**

```bash
cd /Users/rupi/Colima/gillilab/itoktok/backend
poetry run python scripts/verify_schema.py
```

- [x] **Step 5: 불일치 항목 기록**

실행 결과:
- 공통 테이블 14개: 전부 OK (컬럼 일치)
- DB에만 있는 테이블: `notice`, `config` (모델 없음 — 레거시/직접 관리 테이블)
- 모델에만 있고 DB에 없는 테이블/컬럼: 없음

- [x] **Step 6: 커밋**

---

## Task 3: Alembic 설치 및 초기화

**Files:**
- Modify: `backend/pyproject.toml`
- Create: `backend/alembic.ini`, `backend/alembic/env.py`, `backend/alembic/script.py.mako`

- [ ] **Step 1: alembic 의존성 추가**

`backend/pyproject.toml` 의 `[tool.poetry.dependencies]` 섹션에 다음을 추가한다:

```toml
alembic = "^1.13.0"
```

```bash
cd /Users/rupi/Colima/gillilab/itoktok/backend
poetry add alembic
```

- [ ] **Step 2: Alembic 초기화**

```bash
cd /Users/rupi/Colima/gillilab/itoktok/backend
poetry run alembic init alembic
```

예상 결과:
```
  Creating directory .../backend/alembic ...  done
  Creating directory .../backend/alembic/versions ...  done
  Generating .../backend/alembic.ini ...  done
  Generating .../backend/alembic/env.py ...  done
  Generating .../backend/alembic/README ...  done
  Generating .../backend/alembic/script.py.mako ...  done
```

- [ ] **Step 3: alembic.ini 설정**

`backend/alembic.ini` 에서 `sqlalchemy.url` 라인을 찾아 다음과 같이 수정한다 (환경변수 사용):

```ini
# sqlalchemy.url = driver://user:pass@localhost/dbname
sqlalchemy.url =
```

(실제 URL은 env.py에서 환경변수로 처리할 예정)

- [ ] **Step 4: env.py 수정**

`backend/alembic/env.py` 전체를 다음으로 교체한다:

```python
import os
import sys
from logging.config import fileConfig
from pathlib import Path

from alembic import context
from sqlalchemy import engine_from_config, pool
from sqlmodel import SQLModel

# backend/ 디렉토리를 sys.path에 추가
sys.path.insert(0, str(Path(__file__).parent.parent))

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

# 환경변수에서 DB URL 읽기
db_url = os.environ.get("CONN_URL")
if db_url:
    config.set_main_option("sqlalchemy.url", db_url)


def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
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
```

- [ ] **Step 5: env.py 동작 확인**

```bash
cd /Users/rupi/Colima/gillilab/itoktok/backend
# .env 파일의 CONN_URL 사용
export $(cat ../.env | grep CONN_URL | xargs)
poetry run alembic current
```

예상 출력: `INFO  [alembic.runtime.migration] Context impl MySQLImpl.` (오류 없이 실행됨)

- [ ] **Step 6: 커밋**

```bash
cd /Users/rupi/Colima/gillilab/itoktok
git add backend/pyproject.toml backend/poetry.lock backend/alembic.ini backend/alembic/
git commit -m "chore: Alembic 초기화 및 env.py 설정"
```

---

## Task 4: Alembic 베이스라인 설정

**Files:**
- Create: `backend/alembic/versions/<hash>_baseline.py` (자동 생성)

- [ ] **Step 1: 현재 상태로 baseline migration 생성**

```bash
cd /Users/rupi/Colima/gillilab/itoktok/backend
export $(cat ../.env | grep CONN_URL | xargs)
poetry run alembic revision --autogenerate -m "baseline"
```

예상 결과: `backend/alembic/versions/<hash>_baseline.py` 파일 생성

- [ ] **Step 2: 생성된 파일 수동 검토**

생성된 `versions/<hash>_baseline.py` 를 열어 확인한다:
- `upgrade()` 함수에 CREATE TABLE 문들이 있으면 — DB가 이미 존재하므로 `upgrade()`/`downgrade()` 내용을 모두 비워야 함
- 이미 DB에 존재하는 테이블을 다시 생성하지 않도록 주의

파일을 다음과 같이 수정한다 (내용을 비워 no-op으로):

```python
def upgrade() -> None:
    pass  # baseline: DB는 이미 존재함


def downgrade() -> None:
    pass  # baseline
```

- [ ] **Step 3: stamp head 적용 (DB 변경 없이 버전 마킹)**

```bash
cd /Users/rupi/Colima/gillilab/itoktok/backend
export $(cat ../.env | grep CONN_URL | xargs)
poetry run alembic stamp head
```

예상 출력:
```
INFO  [alembic.runtime.migration] Running stamp_revision -> <hash>
```

- [ ] **Step 4: 적용 확인**

```bash
poetry run alembic current
```

예상 출력: `<hash> (head)` — 현재 버전이 head로 설정됨

- [ ] **Step 5: 커밋**

```bash
cd /Users/rupi/Colima/gillilab/itoktok
git add backend/alembic/versions/
git commit -m "chore: Alembic baseline migration 설정"
```

---

## Task 5: 레거시 테이블 데이터 매핑 검증

**Files:**
- Create: `backend/scripts/verify_legacy_mapping.py`

- [ ] **Step 1: 검증 스크립트 작성**

`backend/scripts/verify_legacy_mapping.py` 를 생성한다:

```python
"""
레거시 테이블 데이터 매핑 검증 스크립트
CenterDirector, Teacher, Customer 데이터가 현행 테이블에 모두 존재하는지 확인.
실행: cd backend && CONN_URL=... poetry run python scripts/verify_legacy_mapping.py
"""
import os
import sys
from pathlib import Path

BASE_DIR = Path(__file__).parent.parent
sys.path.insert(0, str(BASE_DIR))

from dotenv import load_dotenv
load_dotenv(BASE_DIR.parent / ".env")

from sqlmodel import create_engine, Session, text

CONN_URL = os.environ.get("CONN_URL")
if not CONN_URL:
    print("오류: CONN_URL 환경변수가 없습니다.")
    sys.exit(1)

engine = create_engine(CONN_URL)


def check_table_exists(session: Session, table_name: str) -> bool:
    result = session.exec(
        text(f"SHOW TABLES LIKE '{table_name}'")
    ).fetchone()
    return result is not None


def verify_center_director(session: Session):
    print("\n[CenterDirector → User 매핑 검증]")
    if not check_table_exists(session, "centerdirector"):
        print("  centerdirector 테이블 없음 — 건너뜀")
        return

    total = session.exec(text("SELECT COUNT(*) FROM centerdirector WHERE deleted_at IS NULL")).scalar()
    orphaned = session.exec(text("""
        SELECT COUNT(*) FROM centerdirector cd
        LEFT JOIN user u ON cd.username = u.username
        WHERE cd.deleted_at IS NULL AND u.username IS NULL
    """)).scalar()
    print(f"  전체 레코드: {total}")
    print(f"  User 테이블에 없는 레코드: {orphaned}")
    if orphaned == 0:
        print("  ✅ 완전 중복 — 삭제 가능")
    else:
        print("  ⚠️  이전 필요한 데이터 있음")


def verify_teacher(session: Session):
    print("\n[Teacher → User 매핑 검증]")
    if not check_table_exists(session, "teacher"):
        print("  teacher 테이블 없음 — 건너뜀")
        return

    total = session.exec(text("SELECT COUNT(*) FROM teacher WHERE deleted_at IS NULL")).scalar()
    orphaned = session.exec(text("""
        SELECT COUNT(*) FROM teacher t
        LEFT JOIN user u ON t.username = u.username
        WHERE t.deleted_at IS NULL AND u.username IS NULL
    """)).scalar()
    print(f"  전체 레코드: {total}")
    print(f"  User 테이블에 없는 레코드: {orphaned}")
    if orphaned == 0:
        print("  ✅ 완전 중복 — 삭제 가능")
    else:
        print("  ⚠️  이전 필요한 데이터 있음")


def verify_customer(session: Session):
    print("\n[Customer → ClientInfo 매핑 검증]")
    if not check_table_exists(session, "customer"):
        print("  customer 테이블 없음 — 건너뜀")
        return

    total = session.exec(text("SELECT COUNT(*) FROM customer WHERE deleted_at IS NULL")).scalar()
    # Customer는 ClientInfo와 직접 FK가 없으므로 이름+생년월일로 비교
    orphaned = session.exec(text("""
        SELECT COUNT(*) FROM customer c
        LEFT JOIN clientinfo ci ON c.name = ci.client_name AND c.birthdate = ci.birth_date
        WHERE c.deleted_at IS NULL AND ci.id IS NULL
    """)).scalar()
    print(f"  전체 레코드: {total}")
    print(f"  ClientInfo에 없는 레코드 (이름+생년월일 기준): {orphaned}")
    if orphaned == 0:
        print("  ✅ 완전 중복 — 삭제 가능")
    else:
        print("  ⚠️  이전 필요한 데이터 있음 — 수동 확인 필요")


def main():
    print("레거시 테이블 매핑 검증")
    print("=" * 50)
    with Session(engine) as session:
        verify_center_director(session)
        verify_teacher(session)
        verify_customer(session)
    print("\n완료. ⚠️ 항목이 있으면 삭제 전 수동으로 데이터 이전 필요.")


if __name__ == "__main__":
    main()
```

- [ ] **Step 2: 스크립트 실행**

```bash
cd /Users/rupi/Colima/gillilab/itoktok/backend
poetry run python scripts/verify_legacy_mapping.py
```

- [ ] **Step 3: 결과에 따라 판단**

- 모두 `✅ 완전 중복` → Task 6 (코드 정리)로 진행
- `⚠️ 이전 필요` 항목이 있으면 → 해당 데이터를 현행 테이블로 수동 이전 후 재실행

- [ ] **Step 4: 커밋**

```bash
cd /Users/rupi/Colima/gillilab/itoktok
git add backend/scripts/verify_legacy_mapping.py
git commit -m "chore: 레거시 테이블 데이터 매핑 검증 스크립트 추가"
```

---

## Task 6: 레거시 코드 제거

**전제 조건:** Task 5 결과에서 모든 레거시 테이블이 `✅ 완전 중복` 확인 후 진행

**Files:**
- Delete: `backend/app/models/customer.py`
- Delete: `backend/app/crud/customer.py`
- Delete: `backend/app/crud/teacher.py`
- Delete: `backend/app/api/customer.py`
- Delete: `backend/app/api/teacher.py`
- Modify: `backend/app/models/user.py`
- Modify: `backend/app/main.py`
- Modify: `backend/app/api/__init__.py`
- Modify: `backend/app/schemas/` (customer, teacher 스키마)

- [ ] **Step 1: api/__init__.py 확인**

```bash
cat /Users/rupi/Colima/gillilab/itoktok/backend/app/api/__init__.py
```

- [ ] **Step 2: main.py에서 레거시 라우터 제거**

`backend/app/main.py` 에서 다음 두 줄을 제거한다:

```python
# 제거할 import
from .api import (
    ...
    customer_router,   # ← 제거
    ...
    teacher_router,    # ← 제거
    ...
)

# 제거할 include_router
app.include_router(customer_router)  # ← 제거
app.include_router(teacher_router)   # ← 제거
```

- [ ] **Step 3: models/user.py에서 레거시 클래스 제거**

`backend/app/models/user.py` 에서 다음을 제거한다:
- `CenterDirector` 클래스 전체 (116~135번 라인)
- `Teacher` 클래스 전체 (138~154번 라인)
- `Role` enum 클래스 (102~104번 라인)
- `UserBase` 클래스 (107~113번 라인)
- `TYPE_CHECKING` 블록에서 불필요한 import 정리

- [ ] **Step 4: 레거시 파일 삭제**

```bash
cd /Users/rupi/Colima/gillilab/itoktok/backend
rm app/models/customer.py
rm app/crud/customer.py
rm app/crud/teacher.py
rm app/api/customer.py
rm app/api/teacher.py
```

- [ ] **Step 5: schemas에서 레거시 스키마 확인 및 제거**

```bash
ls /Users/rupi/Colima/gillilab/itoktok/backend/app/schemas/
grep -r "Customer\|TeacherCreate\|TeacherRead\|TeacherUpdate" /Users/rupi/Colima/gillilab/itoktok/backend/app/schemas/
```

customer, teacher 관련 스키마가 있으면 해당 파일에서 제거한다.

- [ ] **Step 6: FastAPI 앱 시작 확인**

```bash
cd /Users/rupi/Colima/gillilab/itoktok/backend
export $(cat ../.env | xargs)
poetry run uvicorn app.main:app --host 0.0.0.0 --port 3000 --reload
```

예상: 오류 없이 시작됨. `http://localhost:3000/docs` 에서 `/customers`, `/teachers` 엔드포인트가 사라짐을 확인.

Ctrl+C 로 종료.

- [ ] **Step 7: 커밋**

```bash
cd /Users/rupi/Colima/gillilab/itoktok
git add -A
git commit -m "refactor: 레거시 Customer, CenterDirector, Teacher 코드 제거"
```

---

## Task 7: 레거시 테이블 rename (DB 안전 처리)

**전제 조건:** Task 6 완료 후, 앱이 정상 동작함을 확인한 후 진행

**Files:**
- Create: `backend/alembic/versions/<hash>_rename_legacy_tables.py`

- [ ] **Step 1: rename migration 생성**

```bash
cd /Users/rupi/Colima/gillilab/itoktok/backend
export $(cat ../.env | grep CONN_URL | xargs)
poetry run alembic revision -m "rename_legacy_tables"
```

- [ ] **Step 2: 생성된 migration 파일 수정**

생성된 `versions/<hash>_rename_legacy_tables.py` 를 다음과 같이 작성한다:

```python
"""rename_legacy_tables

Revision ID: <자동생성된 ID>
Revises: <이전 revision ID>
Create Date: 2026-03-31
"""
from alembic import op

revision = '<자동생성된 ID>'
down_revision = '<이전 revision ID>'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # 레거시 테이블을 _deprecated suffix로 rename
    # 1~2주 관찰 후 drop_legacy_tables migration으로 최종 삭제
    op.rename_table("centerdirector", "centerdirector_deprecated_20260331")
    op.rename_table("teacher", "teacher_deprecated_20260331")
    op.rename_table("customer", "customer_deprecated_20260331")


def downgrade() -> None:
    # 롤백: 원래 이름으로 복원
    op.rename_table("centerdirector_deprecated_20260331", "centerdirector")
    op.rename_table("teacher_deprecated_20260331", "teacher")
    op.rename_table("customer_deprecated_20260331", "customer")
```

- [ ] **Step 3: DB 백업 (필수)**

프로덕션 DB 전체 백업을 수행한다. 방법은 DB 호스팅 환경에 따라 다르지만 일반적으로:

```bash
# 예시 (실제 접속 정보로 교체)
mysqldump -h <host> -u <user> -p<password> <database> > backup_before_rename_$(date +%Y%m%d_%H%M%S).sql
```

백업 파일이 생성되었음을 확인한다.

- [ ] **Step 4: migration 적용**

```bash
cd /Users/rupi/Colima/gillilab/itoktok/backend
export $(cat ../.env | grep CONN_URL | xargs)
poetry run alembic upgrade head
```

예상 출력:
```
INFO  [alembic.runtime.migration] Running upgrade <prev> -> <hash>, rename_legacy_tables
```

- [ ] **Step 5: 적용 확인**

```bash
poetry run alembic current
```

예상: 최신 revision이 head로 표시됨

- [ ] **Step 6: 앱 정상 동작 확인**

```bash
cd /Users/rupi/Colima/gillilab/itoktok/backend
export $(cat ../.env | xargs)
poetry run uvicorn app.main:app --host 0.0.0.0 --port 3000 --reload
```

`http://localhost:3000/docs` 접속하여 주요 API(users, clients, schedules) 동작 확인 후 Ctrl+C 종료.

- [ ] **Step 7: 커밋**

```bash
cd /Users/rupi/Colima/gillilab/itoktok
git add backend/alembic/versions/
git commit -m "chore: 레거시 테이블 rename migration (관찰 기간 시작)"
```

---

## Task 8: 최종 삭제 migration (1~2주 관찰 후)

**전제 조건:** Task 7 완료 후 1~2주 운영 관찰, 이상 없음 확인 후 진행

**Files:**
- Create: `backend/alembic/versions/<hash>_drop_legacy_tables.py`

- [ ] **Step 1: 최종 삭제 migration 생성**

```bash
cd /Users/rupi/Colima/gillilab/itoktok/backend
export $(cat ../.env | grep CONN_URL | xargs)
poetry run alembic revision -m "drop_legacy_tables"
```

- [ ] **Step 2: migration 파일 작성**

생성된 파일을 다음과 같이 작성한다:

```python
"""drop_legacy_tables

Revision ID: <자동생성된 ID>
Revises: <rename migration ID>
Create Date: <최종 삭제 날짜>
"""
from alembic import op

revision = '<자동생성된 ID>'
down_revision = '<rename migration ID>'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.drop_table("centerdirector_deprecated_20260331")
    op.drop_table("teacher_deprecated_20260331")
    op.drop_table("customer_deprecated_20260331")


def downgrade() -> None:
    # 롤백 불가 (데이터 영구 삭제) — 필요시 백업에서 복원
    raise NotImplementedError("이 migration의 downgrade는 지원하지 않습니다. 백업에서 복원하세요.")
```

- [ ] **Step 3: DB 백업 (필수)**

```bash
mysqldump -h <host> -u <user> -p<password> <database> > backup_before_drop_$(date +%Y%m%d_%H%M%S).sql
```

- [ ] **Step 4: migration 적용**

```bash
cd /Users/rupi/Colima/gillilab/itoktok/backend
export $(cat ../.env | grep CONN_URL | xargs)
poetry run alembic upgrade head
```

- [ ] **Step 5: 최종 확인**

```bash
poetry run alembic current
# DB에서 deprecated 테이블이 없음을 확인
mysql -h <host> -u <user> -p<password> <database> -e "SHOW TABLES LIKE '%deprecated%';"
```

예상 출력: 빈 결과 (deprecated 테이블 없음)

- [ ] **Step 6: 커밋**

```bash
cd /Users/rupi/Colima/gillilab/itoktok
git add backend/alembic/versions/
git commit -m "chore: 레거시 테이블 최종 삭제 migration 적용"
```

---

## 성공 기준 체크리스트

- [ ] `analyze_db_usage.py` 실행 결과가 docs에 반영됨
- [ ] `verify_schema.py` 실행 결과 불일치 0건 (또는 모두 처리됨)
- [ ] `alembic current` 가 정상적으로 head revision을 출력함
- [ ] `/customers`, `/teachers` 엔드포인트가 Swagger UI에서 사라짐
- [ ] FastAPI 앱이 오류 없이 시작됨
- [ ] 레거시 테이블이 `_deprecated_20260331` suffix로 rename됨
- [ ] 1~2주 관찰 후 deprecated 테이블 최종 삭제 완료
- [ ] 프로덕션 데이터 손실 0건

---

## 참고: Alembic 운영 명령어 치트시트

```bash
# 현재 버전 확인
alembic current

# 마이그레이션 히스토리
alembic history

# 최신으로 업그레이드
alembic upgrade head

# 한 단계 롤백
alembic downgrade -1

# 특정 revision으로 롤백
alembic downgrade <revision_id>

# 모델 변경 후 새 migration 자동 생성
alembic revision --autogenerate -m "설명"

# DB 변경 없이 버전만 마킹
alembic stamp head
```
