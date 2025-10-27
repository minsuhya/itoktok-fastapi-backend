# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

ITokTok은 아동 심리 상담센터를 위한 종합 관리 시스템입니다. FastAPI 백엔드와 Vue 3 프론트엔드로 구성된 풀스택 애플리케이션으로, 센터 운영, 상담사 관리, 내담자 관리, 일정 관리를 지원합니다.

**주요 사용자 역할:**
- **최고관리자**: 시스템 전체 관리 권한
- **센터장**: 센터 생성/관리, 선생님 및 내담자 관리, 일정 관리
- **선생님**: 담당 내담자 및 개인 일정 관리

## 개발 환경 설정

### 도메인 설정

`/etc/hosts` 파일에 다음 도메인을 추가해야 합니다:

```bash
127.0.1.1	api.itoktok.com www.itoktok.com
```

### Docker Compose 실행

**프로덕션 모드:**
```bash
docker compose up
# Frontend: http://www.itoktok.com:8081
# Backend API: http://api.itoktok.com:3000
# API Docs: http://api.itoktok.com:3000/docs
```

**개발 모드:**
```bash
docker compose -f docker-compose.dev.yml up
# Frontend: http://localhost:2080
# Backend API: http://localhost:3000
```

## 백엔드 개발 (FastAPI)

자세한 내용은 `backend/CLAUDE.md`를 참조하세요.

### 핵심 명령어

```bash
cd backend

# 의존성 설치
poetry install --no-root

# 개발 서버 실행
poetry run uvicorn app.main:app --host 0.0.0.0 --port 3000 --reload

# 테스트 실행
poetry run pytest tests
poetry run pytest tests --log-cli-level=DEBUG -vv

# 특정 테스트 파일 실행
poetry run pytest tests/main_test.py
```

### Docker 빌드 (Mac M1/M2)

```bash
# Mac M1/M2에서는 플랫폼 플래그 필요
env DOCKER_DEFAULT_PLATFORM=linux/amd64 docker compose build
```

### 아키텍처 개요

```
backend/app/
├── api/          # API 라우트 (엔드포인트)
├── crud/         # 데이터베이스 CRUD 작업
├── models/       # SQLModel 데이터베이스 모델
├── schemas/      # Pydantic 요청/응답 스키마
├── core/         # 앱 설정, DB 연결
└── main.py       # 엔트리 포인트
```

**데이터베이스:**
- MySQL (주 데이터베이스, SQLModel/SQLAlchemy 사용)
- MongoDB (보조 데이터베이스, 선택적 사용)

**인증:**
- JWT 토큰 기반 (python-jose)
- OAuth2 password flow
- bcrypt 비밀번호 해싱

### 주요 API 엔드포인트

- `/auth/login` - 로그인, JWT 토큰 발급
- `/signup` - 회원가입 (센터장 등록)
- `/users` - 사용자 관리
- `/centers` - 센터 정보 관리
- `/teachers` - 선생님 관리
- `/clients` - 내담자 관리
- `/programs` - 프로그램 관리
- `/schedules` - 일정 관리
- `/records` - 상담 기록 관리
- `/vouchers` - 바우처 관리
- `/announcements` - 공지사항
- `/inquiries` - 문의사항

## 프론트엔드 개발 (Vue 3)

자세한 내용은 `frontend/CLAUDE.md`를 참조하세요.

### 핵심 명령어

```bash
cd frontend

# 의존성 설치 (pnpm 사용)
pnpm install

# 개발 서버 실행
pnpm dev

# 프로덕션 빌드
pnpm build

# 린트
pnpm lint

# 코드 포맷팅
pnpm format
```

### 아키텍처 개요

```
frontend/src/
├── api/          # API 통신 (axios)
├── views/        # 페이지 컴포넌트
├── components/   # 재사용 컴포넌트
├── router/       # Vue Router 설정
├── stores/       # Pinia 상태 관리
├── hooks/        # Composable 함수
└── assets/       # 정적 자원
```

**주요 기술:**
- Vue 3 (Composition API)
- Vue Router (SPA 라우팅)
- Pinia (상태 관리)
- Vite (빌드 도구)
- Tailwind CSS (스타일링)
- VeeValidate + Yup (폼 검증)
- Axios (HTTP 클라이언트)

### 인증 흐름

1. `useAuth()` 훅으로 로그인
2. JWT 토큰을 localStorage에 저장
3. axios 인터셉터가 모든 요청에 토큰 자동 첨부
4. 401 응답 시 자동 로그아웃 및 로그인 페이지로 리다이렉트

### 주요 뷰 컴포넌트

- **MonthlyView**: 월간 일정 캘린더
- **WeeklyView**: 주간 일정 뷰
- **DailyViewSliding**: 일간 일정 상세 뷰
- **ProgramView**: 프로그램 관리
- **ClientList**: 내담자 목록
- **UserList**: 사용자 목록

### 폼 컴포넌트

슬라이딩 패널 형태로 구현:
- **ScheduleFormSliding**: 일정 등록/수정
- **ProgramFormSliding**: 프로그램 등록/수정
- **UserFormSliding**: 사용자 등록/수정
- **ClientFormSliding**: 내담자 등록/수정

## 환경 변수

### 백엔드 (.env)

```bash
# Database
CONN_URL=mysql+pymysql://user:password@host:port/database

# MongoDB (선택 사항)
MONGO_URI=mongodb://localhost:27017
MONGO_DB=database_name

# JWT Authentication
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### 프론트엔드

**.env.development:**
```bash
VITE_API_BASE_URL=http://localhost:2080
VITE_TOKEN_KEY=itoktok_token
```

**.env.production:**
```bash
VITE_API_BASE_URL=http://itoktok-api.gillilab.com
VITE_TOKEN_KEY=itoktok_token
```

## 프로젝트 구조

```
itoktok/
├── backend/              # FastAPI 백엔드
│   ├── app/             # 애플리케이션 코드
│   ├── tests/           # 테스트
│   ├── pyproject.toml   # Poetry 설정
│   └── Dockerfile       # 백엔드 컨테이너
├── frontend/            # Vue 3 프론트엔드
│   ├── src/            # 소스 코드
│   ├── public/         # 정적 파일
│   ├── package.json    # pnpm 설정
│   └── dist/           # 빌드 결과 (git 제외)
├── conf/               # Nginx 설정
├── data/               # 데이터 파일
├── docker-compose.yml         # 프로덕션 설정
└── docker-compose.dev.yml     # 개발 설정
```

## 비즈니스 로직 핵심

### 권한 체계

**최고관리자 (is_superuser == 1):**
- 시스템 전체 설정
- 모든 센터 관리
- 모든 사용자 관리

**센터장 (user_type == 1):**
- 회원가입으로 등록
- 자신의 센터 생성 및 관리
- 센터 소속 선생님 관리 및 일정 조회
- 센터 내담자 관리

**선생님 (기본값):**
- 센터장이 생성
- 자신의 담당 내담자만 관리
- 자신의 일정만 등록/수정
- 상담 기록 작성

### 데이터 격리

- 센터별 데이터 격리가 필수
- 선생님은 자신이 소속된 센터의 데이터만 접근
- 센터장은 자신의 센터 데이터만 관리
- 최고관리자만 전체 데이터 접근 가능

## 개발 워크플로우

### 백엔드 작업

1. Docker Compose로 전체 스택 실행
2. 컨테이너 내에서 테스트 실행
3. API 문서로 엔드포인트 확인: http://localhost:3000/docs
4. CRUD 패턴 준수: `crud/` → `api/` → `schemas/`

### 프론트엔드 작업

1. 로컬에서 `pnpm dev`로 실행 (핫 리로드)
2. API 연동 테스트
3. 빌드 후 Docker로 프로덕션 테스트
4. `pnpm lint` 및 `pnpm format`으로 코드 품질 유지

## 중요 개발 참고사항

### SQLModel 관계 모델
- 관계를 가진 모델들은 **반드시 같은 파일에 정의**
- 순환 import 오류 방지를 위함
- 여러 파일로 분리 금지

### SQLModel 세션 관리
```python
# 올바른 패턴
team = Team(...)
session.add(team)
session.commit()
session.refresh(team)  # 필수!

hero = Hero(...)
hero.team = team
session.add(hero)
session.commit()
session.refresh(hero)
session.refresh(team)  # 관련 객체도 refresh 필요!
```

### Vue 컴포넌트 네이밍
- 슬라이딩 폼: `*FormSliding.vue`
- 리스트 뷰: `*List.vue`
- 메인 뷰: `*View.vue`

### 페이지네이션
- 백엔드: `fastapi-pagination` 사용
- 프론트엔드: API 응답의 `items`, `total`, `page`, `size` 활용

## 테스트

### 백엔드 테스트
```bash
cd backend

# 전체 테스트
poetry run pytest tests

# 상세 로그
poetry run pytest tests --log-cli-level=DEBUG -vv

# 특정 테스트
poetry run pytest tests/main_test.py
```

### 프론트엔드 린트
```bash
cd frontend

# ESLint 검사 및 자동 수정
pnpm lint

# Prettier 포맷팅
pnpm format
```

## 배포

### 프로덕션 빌드

```bash
# 프론트엔드 빌드
cd frontend
pnpm build

# Docker Compose로 전체 스택 실행
cd ..
docker compose up -d
```

### Nginx 설정

- 프로덕션: `conf/nginx.conf`
- 개발: `conf/nginx.dev.conf`
- 프론트엔드 빌드 결과는 `frontend/dist/`를 서빙

## 추가 참고사항

- 개인정보 보호: 내담자 정보는 민감 데이터로 처리
- 센터별 데이터 격리: 철저한 권한 검증 필수
- 바우처 관리: 결제 관련 정보 정확성 보장
- 일정 충돌 방지: 선생님별 시간대 중복 체크
