# itoktok project

아동심리 상담센터 프로그램으로, 심리 상담/치료 예약 및 일정을 관리하는 시스템입니다.

## 핵심 기능

### 1. 사용자 관리
- 회원가입 및 로그인
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

### 4. 고객 관리
- 고객 정보 관리
- 상담/치료 기록 관리
- 바우처 관리

### 5. 프로그램 관리
- 프로그램 등록/수정/삭제
- 프로그램별 일정 관리
- 프로그램별 고객 관리

### 6. 기타 기능
- 공지사항 관리
- 문의사항 관리
- 알림 기능

## API 구조

### 인증 관련
- auth.py: 로그인, 토큰 관리
- signup.py: 회원가입
- users.py: 사용자 관리

### 센터 관련
- center.py: 센터 관리
- teacher.py: 선생님 관리
- program.py: 프로그램 관리

### 일정 관련
- schedule.py: 일정 관리
- record.py: 상담/치료 기록

### 고객 관련
- customer.py: 고객 관리
- client.py: 클라이언트 관리
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
- ClientList: 고객 목록
- UserList: 사용자 목록

### 폼 컴포넌트
- ScheduleFormSliding: 일정 등록/수정
- ProgramFormSliding: 프로그램 등록/수정
- UserFormSliding: 사용자 등록/수정
- ClientFormSliding: 고객 등록/수정

## 시스템 구성

### 사용자 등급 및 권한
1. 최고관리자
   - 시스템 전체 설정
   - 모든 센터 관리
   - 모든 사용자 관리

2. 센터장
   - 센터 생성 및 관리
   - 센터 내 선생님 일정 관리
   - 고객 관리

3. 선생님
   - 자신의 고객 관리
   - 상담/치료 일정 관리

### 주요 기능
- 심리 상담/치료 예약 관리
- 일정 관리
- 고객 관리
- 센터 관리

## 기술 스택

### Backend
- FastAPI (Python 3.12)
- Poetry (의존성 관리)
- MySQL (데이터베이스)
- Docker

### Frontend
- Vue.js
- Vite
- Tailwind CSS
- pnpm (패키지 관리)

## 개발 환경 설정

### /etc/hosts 설정
```bash
$ vi /etc/hosts
# itoktok
127.0.1.1	api.itoktok.com www.itoktok.com
```

### 도메인 설정
- FastAPI Backend: api.itoktok.com:8000
- Vue Frontend: www.itoktok.com:8000

### 백엔드 개발
1. API 문서: api.itoktok.com:8000/docs
2. Docker Compose로 실행
3. 개발 환경: docker-compose.dev.yml 사용
4. 테스트: Docker 컨테이너 내에서 실행

### 프론트엔드 개발
1. 로컬 개발: pnpm dev로 실행
2. 프로덕션: Docker Compose로 실행

## 프로젝트 구조

### Backend (/backend)
- app/: 메인 애플리케이션 코드
  - api/: API 엔드포인트
  - crud/: 데이터베이스 CRUD 작업
  - schemas/: 데이터 스키마
  - models/: 데이터베이스 모델
  - core/: 핵심 기능
- tests/: 테스트 코드
- poetry.lock, pyproject.toml: Python 의존성 관리
- Dockerfile: 백엔드 컨테이너 설정

### Frontend (/frontend)
- src/: 소스 코드
  - api/: API 통신
  - views/: 페이지 컴포넌트
  - router/: 라우팅 설정
  - stores/: 상태 관리
  - components/: 재사용 컴포넌트
  - assets/: 정적 자원
- public/: 정적 파일
- vite.config.js: Vite 설정
- tailwind.config.js: Tailwind CSS 설정
- package.json: Node.js 의존성 관리

### 기타 디렉토리
- database/: 데이터베이스 관련 파일
- conf/: 설정 파일
- data/: 데이터 파일

## 개발 워크플로우

### 백엔드 개발
1. Docker Compose로 환경 구성
2. 컨테이너 내에서 테스트
3. API 개발 및 테스트

### 프론트엔드 개발
1. 로컬에서 pnpm dev로 실행
2. 실시간 코드 변경 확인
3. API 연동 테스트

## 주의사항
- .gitignore에 정의된 파일들은 버전 관리에서 제외
- 환경별 설정 파일 확인 필요
- 데이터베이스 마이그레이션 및 백업 정책 확인 필요
- 권한 체계에 따른 기능 접근 제어 확인
- 센터별 데이터 격리 확인
- 개인정보 보호 정책 준수
