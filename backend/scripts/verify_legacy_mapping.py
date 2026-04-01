"""
레거시 테이블 데이터 매핑 검증 스크립트
CenterDirector, Teacher, Customer 데이터가 현행 테이블에 모두 존재하는지 확인.
실행: cd backend && .venv/bin/python scripts/verify_legacy_mapping.py
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
    print("error: CONN_URL environment variable is not set.")
    sys.exit(1)

engine = create_engine(CONN_URL)


def check_table_exists(session, table_name):
    result = session.exec(
        text("SHOW TABLES LIKE :name"), params={"name": table_name}
    ).fetchone()
    return result is not None


def verify_center_director(session):
    print("\n[CenterDirector -> User mapping verification]")
    if not check_table_exists(session, "centerdirector"):
        print("  centerdirector table not found - skipping")
        return

    total = session.exec(text("SELECT COUNT(*) FROM centerdirector WHERE deleted_at IS NULL")).scalar()
    orphaned = session.exec(text(
        "SELECT COUNT(*) FROM centerdirector cd"
        " LEFT JOIN user u ON cd.username = u.username"
        " WHERE cd.deleted_at IS NULL AND u.username IS NULL"
    )).scalar()
    print(f"  total records: {total}")
    print(f"  records not in User table: {orphaned}")
    if orphaned == 0:
        print("  OK - fully duplicated, safe to remove")
    else:
        print("  WARNING - data migration needed")


def verify_teacher(session):
    print("\n[Teacher -> User mapping verification]")
    if not check_table_exists(session, "teacher"):
        print("  teacher table not found - skipping")
        return

    total = session.exec(text("SELECT COUNT(*) FROM teacher WHERE deleted_at IS NULL")).scalar()
    orphaned = session.exec(text(
        "SELECT COUNT(*) FROM teacher t"
        " LEFT JOIN user u ON t.username = u.username"
        " WHERE t.deleted_at IS NULL AND u.username IS NULL"
    )).scalar()
    print(f"  total records: {total}")
    print(f"  records not in User table: {orphaned}")
    if orphaned == 0:
        print("  OK - fully duplicated, safe to remove")
    else:
        print("  WARNING - data migration needed")


def verify_customer(session):
    print("\n[Customer -> ClientInfo mapping verification]")
    if not check_table_exists(session, "customer"):
        print("  customer table not found - skipping")
        return

    total = session.exec(text("SELECT COUNT(*) FROM customer WHERE deleted_at IS NULL")).scalar()
    orphaned = session.exec(text(
        "SELECT COUNT(*) FROM customer c"
        " LEFT JOIN clientinfo ci ON c.name = ci.client_name AND c.birthdate = ci.birth_date"
        " WHERE c.deleted_at IS NULL AND ci.id IS NULL"
    )).scalar()
    print(f"  total records: {total}")
    print(f"  records not in ClientInfo (by name+birthdate): {orphaned}")
    if orphaned == 0:
        print("  OK - fully duplicated, safe to remove")
    else:
        print("  WARNING - data migration needed, manual check required")


def main():
    print("Legacy table mapping verification")
    print("=" * 50)
    with Session(engine) as session:
        verify_center_director(session)
        verify_teacher(session)
        verify_customer(session)
    print("\nDone. If WARNING items exist, manual data migration needed before removal.")


if __name__ == "__main__":
    main()
