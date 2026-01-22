# AGENTS.md

이 문서는 이 저장소에서 작업하는 에이전트를 위한 운영 규칙입니다.
한국어로 답변합니다. (루트 `CLAUDE.md` 기준)

## 프로젝트 개요
- ITokTok: 아동 심리 상담센터 관리 시스템
- Backend: FastAPI + SQLModel + Poetry
- Frontend: Vue 3 + Vite + Tailwind + Pinia + pnpm
- Database: MySQL/MariaDB(주), MongoDB(보조)
- Auth: JWT (python-jose, passlib/bcrypt)

## 에이전트 규칙 소스
- 루트 `CLAUDE.md`, `backend/CLAUDE.md`, `frontend/CLAUDE.md` 준수
- Cursor 규칙: `.cursor/rules/project.mdc` 내용 포함
- Copilot 규칙: 없음 (`.github/copilot-instructions.md` 미존재)

## 공통 개발 명령어
### Docker Compose
```bash
docker compose up -d
docker compose -f docker-compose.dev.yml up -d
env DOCKER_DEFAULT_PLATFORM=linux/amd64 docker compose build
```

## Backend (Python/FastAPI)
### 설치/실행
```bash
cd backend
poetry install --no-root
poetry run uvicorn app.main:app --host 0.0.0.0 --port 3000 --reload
```

### 테스트 (단일 테스트 포함)
```bash
poetry run pytest tests
poetry run pytest tests/main_test.py
poetry run pytest tests --log-cli-level=DEBUG -vv
```

### 코드 스타일/규칙
- 임포트 순서: 표준 라이브러리 → 서드파티 → 로컬 모듈
- 네이밍: snake_case(함수/변수), PascalCase(클래스), UPPER_SNAKE_CASE(상수)
- SQLModel 관계 모델은 반드시 같은 파일에 정의 (순환 import 방지)
- 트랜잭션: commit 1회, commit 후 관련 객체 전부 refresh
- CRUD 흐름: `crud/` → `api/` → `schemas/`
- 페이지네이션: `fastapi-pagination` 사용
- 테스트에서 app import 필요 시 sys.path에 `app/` 추가

### 예시 (세션 refresh)
```python
def create_resource(session: Session, data: Resource) -> Resource:
    session.add(data)
    session.commit()
    session.refresh(data)
    return data
```

## Frontend (Vue 3)
### 설치/실행
```bash
cd frontend
pnpm install
pnpm dev
pnpm build
pnpm preview
```

### 린트/포맷
```bash
pnpm lint
pnpm format
```

### 코드 스타일/규칙
- ESLint: `plugin:vue/vue3-essential`, `eslint:recommended` 적용
- Prettier: semi=false, singleQuote=true, printWidth=100, trailingComma=none
- 네이밍: PascalCase(컴포넌트 파일), camelCase(함수/변수)
- 컴포넌트 규칙
  - 슬라이딩 폼: `*FormSliding.vue`
  - 리스트 뷰: `*List.vue` 또는 `*ListView.vue`
  - 메인 뷰: `*View.vue`

### API 응답 처리 (중요)
- axios 인터셉터가 `response.data`를 이미 반환
- 호출부에서는 `response`를 직접 사용 (`response.data` 금지)

### 인증/상태
- 토큰은 localStorage의 `VITE_TOKEN_KEY`에 저장
- 401 응답 시 자동 로그아웃 및 로그인 리다이렉트
- `userStore`(Pinia)에 사용자 정보 저장

## Cursor 규칙 요약 (`.cursor/rules/project.mdc`)
- 구조
  - `backend/`: FastAPI + SQLModel + Poetry
  - `frontend/`: Vite + Tailwind + pnpm
  - `conf/`, `data/`, `docker-compose.yml` 존재
- 코딩 컨벤션
  - Python: Poetry 사용, 테스트는 `tests/`
  - JS: ESLint + Prettier, Tailwind
- 개발 환경
  - dev/prod compose 분리 (`docker-compose.dev.yml`)
- 권한 체계: 최고관리자/센터장/선생님
- 핵심 기능: 사용자/센터/일정/고객/프로그램/공지/문의

## 환경 변수
### Backend (.env)
- `CONN_URL` (MySQL/MariaDB 연결)
- `SECRET_KEY`, `ALGORITHM`, `ACCESS_TOKEN_EXPIRE_MINUTES`
- `MONGO_URI`, `MONGO_DB` (선택)

### Frontend (.env.development / .env.production)
- `VITE_API_BASE_URL`
- `VITE_TOKEN_KEY`

## 프로젝트 구조
### Backend
```
backend/app/
├── api/          # API 엔드포인트
├── crud/         # 데이터베이스 CRUD
├── models/       # SQLModel 모델
├── schemas/      # Pydantic 스키마
└── core/         # 설정, DB 연결
```

### Frontend
```
frontend/src/
├── api/          # API 통신 (axios)
├── views/        # 데스크톱 뷰
├── components/   # 공통 컴포넌트
├── router/       # Vue Router
└── stores/       # Pinia 상태
```

## 에러/응답 처리
- FastAPI 라우트는 `HTTPException`으로 에러 응답
- API 응답은 SQLModel 모델이 아닌 스키마 사용
- 프론트는 인터셉터가 데이터 추출하므로 `response.data` 금지

## 테스트 주의사항
```python
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(os.path.join(ROOT_DIR, "app"))
```

## 작업 시 주의사항
- 민감 정보(.env 등) 커밋 금지
- 기존 파일의 패턴을 우선 존중
- 백엔드에 별도 린터/포매터 설정은 없음
- 모바일은 Expo 프레임워크로 신규 구축 예정 (현 저장소 제외)

## 참고 문서
- `CLAUDE.md`
- `backend/CLAUDE.md`
- `frontend/CLAUDE.md`
