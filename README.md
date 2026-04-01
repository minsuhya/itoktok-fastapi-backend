# itoktok project

아동심리 상담센터 프로그램으로, 심리 상담/치료 예약 및 일정을 관리하는 시스템입니다.

## 핵심 기능

### 1. 사용자 관리
- 회원가입 및 로그인
- 비밀번호 재설정
- 사용자 등급별 권한 관리
- 마이페이지 관리

### 2. 센터 관리
- 센터 정보 관리
- 센터별 프로그램 관리
- 센터별 선생님 관리

### 3. 일정 관리
- 월간/주간/일간 일정 조회
- 상담/치료 일정 등록/수정/삭제
- 선생님별 일정 관리

### 4. 내담자 관리
- 내담자 정보 관리
- 상담/치료 기록 관리
- 바우처 관리

### 5. 프로그램 관리
- 프로그램 등록/수정/삭제
- 프로그램별 일정 관리

### 6. 기타 기능
- 공지사항 관리
- 문의사항 관리

## 기술 스택

### Backend
- FastAPI (Python 3.9+)
- SQLModel (SQLAlchemy + Pydantic)
- Poetry (의존성 관리)
- MySQL/MariaDB (외부 AWS RDS)
- MongoDB (보조, 선택적)
- Alembic (DB 마이그레이션)
- Docker

### Frontend
- Vue 3 (Composition API)
- Vite
- Tailwind CSS
- Pinia (상태 관리)
- VeeValidate + Yup (폼 검증)
- pnpm (패키지 관리)

## 시스템 구성

### 사용자 등급 및 권한

1. **최고관리자** (is_superuser == 1)
   - 시스템 전체 설정
   - 모든 센터 관리
   - 모든 사용자 관리

2. **센터장** (user_type == 1)
   - 센터 생성 및 관리
   - 센터 내 선생님 일정 관리
   - 내담자 관리

3. **선생님** (기본값)
   - 자신의 내담자 관리
   - 상담/치료 일정 관리

## API 구조

### 인증 관련
- auth.py: 로그인, 토큰 관리
- signup.py: 회원가입
- password.py: 비밀번호 재설정
- users.py: 사용자 관리 (선생님 관리 포함)

### 센터 관련
- center.py: 센터 관리
- program.py: 프로그램 관리

### 일정 관련
- schedule.py: 일정 관리
- record.py: 상담/치료 기록

### 내담자 관련
- client.py: 내담자 관리
- voucher.py: 바우처 관리

### 기타
- announcement.py: 공지사항
- inquiry.py: 문의사항

## 프론트엔드 구조

### 주요 뷰
- MonthlyView: 월간 일정
- WeeklyView: 주간 일정
- DailyViewSliding: 일간 일정
- ProgramView: 프로그램 관리
- ClientList: 내담자 목록
- UserList: 사용자 목록
- MyPageView: 마이페이지

### 폼 컴포넌트
- ScheduleFormSliding: 일정 등록/수정
- ProgramFormSliding: 프로그램 등록/수정
- UserFormSliding: 사용자 등록/수정
- ClientFormSliding: 내담자 등록/수정

## 프로젝트 구조

### Backend (/backend)
- app/: 메인 애플리케이션 코드
  - api/: API 엔드포인트
  - crud/: 데이터베이스 CRUD 작업
  - schemas/: 데이터 스키마
  - models/: 데이터베이스 모델
  - core/: 핵심 기능 (설정, DB 연결)
- alembic/: DB 마이그레이션
- tests/: 테스트 코드
- pyproject.toml: Poetry 의존성 관리
- Dockerfile: 백엔드 컨테이너 설정

### Frontend (/frontend)
- src/: 소스 코드
  - api/: API 통신 (axios)
  - views/: 페이지 컴포넌트
  - router/: 라우팅 설정
  - stores/: Pinia 상태 관리
  - components/: 재사용 컴포넌트
  - hooks/: Composable 함수
  - composables/: Composable 함수
  - assets/: 정적 자원
- public/: 정적 파일
- vite.config.js: Vite 설정
- tailwind.config.js: Tailwind CSS 설정
- package.json: pnpm 의존성 관리

### 기타 디렉토리
- conf/: Nginx 설정 파일
- data/: 데이터 파일
- database/: 데이터베이스 관련 파일

## 개발 환경 설정

### 도메인 설정 (프로덕션)
- Frontend: itoktok-www.gillilab.com
- Backend API: itoktok-api.gillilab.com

### 백엔드 개발
```bash
cd backend
poetry install --no-root
poetry run uvicorn app.main:app --host 0.0.0.0 --port 3000 --reload
```

### 프론트엔드 개발
```bash
cd frontend
pnpm install
pnpm dev
```

### Docker Compose
```bash
# 프로덕션
docker compose up -d

# 개발
docker compose -f docker-compose.dev.yml up -d
```

## 주의사항
- .gitignore에 정의된 파일들은 버전 관리에서 제외
- 환경별 설정 파일 확인 필요 (.env, .env.development, .env.production)
- 데이터베이스는 외부 MySQL 서버 사용 (Docker 내 DB 없음)
- 센터별 데이터 격리 필수
- 개인정보 보호 정책 준수
