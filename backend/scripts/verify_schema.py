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
