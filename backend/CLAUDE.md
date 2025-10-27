# CLAUDE.md

이 파일은 이 저장소에서 작업할 때 Claude Code (claude.ai/code)에 대한 가이드를 제공합니다.

## 프로젝트 개요

이 프로젝트는 SQLModel (SQLAlchemy + Pydantic)을 사용하여 데이터베이스를 관리하는 FastAPI 백엔드 애플리케이션입니다. PostgreSQL과 MongoDB 데이터베이스를 모두 지원하는 상담센터 관리 시스템을 위한 REST API를 제공합니다.

## 개발 명령어

### 환경 설정
```bash
# Poetry를 사용하여 의존성 설치
poetry install --no-root

# 가상 환경 활성화
poetry shell

# 핫 리로드와 함께 개발 서버 실행
poetry run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 테스트
```bash
# 모든 테스트 실행
poetry run pytest tests

# 상세한 출력과 디버그 로깅으로 테스트 실행
poetry run pytest tests --log-cli-level=DEBUG -vv

# 특정 테스트 파일 실행
poetry run pytest tests/main_test.py
```

### Docker
```bash
# Docker 이미지 빌드 (Mac M1 사용자는 플랫폼 플래그 필요)
env DOCKER_DEFAULT_PLATFORM=linux/amd64 docker compose build

# 컨테이너 실행
docker compose up
```

## 아키텍처

### 프로젝트 구조

```
app/
├── api/          # API 라우트 핸들러 (엔드포인트)
├── crud/         # 데이터베이스 CRUD 작업
├── models/       # SQLModel 데이터베이스 모델
├── schemas/      # 요청/응답용 Pydantic 스키마
├── core/         # 핵심 애플리케이션 설정 및 데이터베이스 연결
└── main.py       # 애플리케이션 진입점
```

### 데이터베이스 아키텍처

**이중 데이터베이스 지원:**
- **PostgreSQL**: SQLModel을 통해 관리되는 주요 관계형 데이터베이스
- **MongoDB**: 특정 사용 사례를 위한 보조 데이터베이스

**데이터베이스 연결 파일:**
- `app/core/mydb.py`: 현재 PostgreSQL 연결 설정
- `app/core/pgdb.py`: 대체 PostgreSQL 설정 (샘플 데이터 삽입 포함)
- `app/core/mgdb.py`: MongoDB 연결 설정

**필수 환경 변수:**
- `CONN_URL`: PostgreSQL 연결 문자열
- `MONGO_URI`: MongoDB 연결 문자열
- `MONGO_DB`: MongoDB 데이터베이스 이름
- `SECRET_KEY`: JWT 비밀 키
- `ALGORITHM`: JWT 알고리즘 (예: HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES`: JWT 토큰 만료 시간

### 애플리케이션 흐름

1. **시작** (`app/core/app.py:on_startup`):
   - `SQLModel.metadata.create_all()`을 통해 데이터베이스 테이블 생성
   - 프로덕션 환경에서는 자동으로 샘플 데이터를 삽입하지 않음

2. **라우터 등록** (`app/main.py`):
   - 모든 라우터는 main.py에 등록됨
   - 각 라우터는 하나의 리소스(고객, 사용자, 일정 등)에 대응

3. **요청 흐름**:
   - `app/api/`의 API 라우트가 요청을 수신
   - 라우트는 `app/crud/`의 CRUD 함수 호출
   - CRUD 함수는 `app/models/`의 모델과 상호작용
   - 응답은 `app/schemas/`의 스키마 사용

### 인증

- `python-jose`를 사용한 JWT 기반 인증
- OAuth2 password flow 구현
- 토큰 엔드포인트: `/auth/login`
- passlib을 통한 bcrypt 비밀번호 해싱
- 보호된 라우트는 `app/api/auth.py`의 `get_current_user` 의존성 사용

### 주요 도메인 모델

애플리케이션이 관리하는 항목:
- **Users**: 센터 관리자 및 상담사/교사
- **CenterInfo**: 상담센터 정보
- **ClientInfo**: 내담자/고객 정보
- **Programs**: 치료 프로그램
- **Schedules**: 예약 일정
- **Records**: 세션 기록
- **Vouchers**: 결제 바우처
- **Inquiries**: 고객 문의
- **Announcements**: 시스템 공지사항

## 중요한 개발 참고사항

### SQLModel 관계 모델

**중요**: 관계를 가진 모델들은 순환 import 오류를 방지하기 위해 반드시 같은 파일에 정의해야 합니다. 여러 파일로 분리하려고 시도하지 마세요.

### SQLModel 세션 관리

데이터베이스 세션 작업 시:
- 각 함수는 하나의 트랜잭션을 나타내야 함
- 트랜잭션당 한 번만 커밋
- `session.commit()` 이후, 모든 관련 객체에 대해 `session.refresh()` 호출 필요
- 커밋하면 세션의 모든 객체가 무효화됨

예시:
```python
team = Team(...)
session.add(team)
session.commit()
session.refresh(team)  # 필수

hero = Hero(...)
hero.team = team
session.add(hero)
session.commit()
session.refresh(hero)
session.refresh(team)  # team도 refresh 필요!
```

### 테스트 파일 구조

- 테스트는 `tests/` 디렉토리에 위치
- `app/`에서 import할 때, 테스트는 sys.path에 app 디렉토리를 추가해야 함:
```python
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(os.path.join(ROOT_DIR, "app"))
```

### Mac M1 Docker 이슈

Mac M1에서 PostgreSQL 연결 오류 발생 시:
- 빌드 방법: `env DOCKER_DEFAULT_PLATFORM=linux/amd64 docker compose build`
- 문제: SCRAM 인증에 올바른 libpq 버전 필요
- 해결책: aarch64 바이너리 문제를 피하기 위해 linux/amd64 플랫폼으로 빌드

### Poetry 설치

- Docker에서 "does not contain any element" 오류를 피하기 위해 `poetry install --no-root` 사용
- 가상 환경은 프로젝트 내에 생성되어야 함: `poetry config virtualenvs.in-project true`

## API 개발 패턴

### 페이지네이션

엔드포인트 전반에 걸쳐 일관된 페이지네이션을 위해 `fastapi-pagination` 사용:
```python
from fastapi_pagination import Page
from fastapi_pagination.ext.sqlalchemy import paginate

def get_resources(session: Session, page: int = 1, size: int = 10) -> Page[Resource]:
    query = select(Resource).order_by(desc(Resource.id))
    return paginate(session, query)
```

### CRUD 패턴

모든 데이터베이스 작업은 CRUD 패턴을 따름:
- Create: crud/의 `create_*` 함수
- Read: `get_*` 또는 `get_*s` 함수
- Update: `update_*` 함수
- Delete: `delete_*` 함수

### 응답 모델

- API 응답에는 모델이 아닌 Pydantic 스키마를 직접 사용
- 모델은 데이터베이스 테이블용
- 스키마는 API 계약용
