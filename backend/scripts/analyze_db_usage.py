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

def find_usages(directory: Path, keyword: str, extensions: list[str] | None = None) -> list[str]:
    """디렉토리 내 파일에서 keyword 사용 여부 반환"""
    if extensions is None:
        extensions = [".py"]
    usages = []
    for ext in extensions:
        for target_file in directory.rglob(f"*{ext}"):
            try:
                content = target_file.read_text(encoding="utf-8")
                if keyword in content:
                    rel = target_file.relative_to(BASE_DIR.parent) if BASE_DIR.parent in target_file.parents else target_file
                    usages.append(str(rel))
            except Exception:
                pass
    return usages

def main():
    crud_dir = BASE_DIR / "app" / "crud"
    api_dir = BASE_DIR / "app" / "api"
    frontend_src_dir = BASE_DIR.parent / "frontend" / "src"

    print("=" * 70)
    print(f"{'테이블/모델':<30} {'CRUD':^8} {'API':^8} {'프론트':^8} {'상태':^10}")
    print("=" * 70)

    for model_name, table_name in MODELS.items():
        crud_files = find_usages(crud_dir, model_name)
        api_files = find_usages(api_dir, model_name)
        frontend_files = find_usages(frontend_src_dir, table_name, [".js", ".vue", ".ts"]) if frontend_src_dir.exists() else []

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
    for model_name, table_name in MODELS.items():
        crud_files = find_usages(crud_dir, model_name)
        api_files = find_usages(api_dir, model_name)
        frontend_files = find_usages(frontend_src_dir, table_name, [".js", ".vue", ".ts"]) if frontend_src_dir.exists() else []
        if not crud_files and not api_files:
            print(f"\n  {model_name}: CRUD/API 미사용 → 레거시 후보")
        elif not frontend_files:
            print(f"\n  {model_name}: 프론트엔드 미사용 → 백엔드 전용 또는 레거시 후보")

if __name__ == "__main__":
    main()
