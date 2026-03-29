# ITokTok 시스템 아키텍처

> 아동 심리 상담센터 종합 관리 시스템의 기술 아키텍처 문서

---

## 1. 시스템 개요 및 아키텍처 다이어그램

ITokTok은 아동 심리 상담센터를 위한 풀스택 웹 애플리케이션입니다. 데스크톱 브라우저 기반의 관리 인터페이스를 제공하며, FastAPI 백엔드와 Vue 3 프론트엔드로 구성됩니다.

### 전체 시스템 구성도

```mermaid
graph TB
    subgraph 클라이언트
        B[브라우저\nVue 3 SPA]
    end

    subgraph Docker Network
        N[Nginx\nReverse Proxy\n:8081]
        A[FastAPI\nBackend\n:3000]
    end

    subgraph 외부 인프라
        DB[(MySQL\n외부 서버)]
        MG[(MongoDB\n선택적)]
    end

    B -->|HTTP 요청| N
    N -->|정적 파일 서빙| B
    N -->|/api/* 프록시| A
    A -->|SQLModel ORM| DB
    A -->|Motor/PyMongo| MG
```

### 요청 처리 흐름

```mermaid
sequenceDiagram
    participant 브라우저
    participant Nginx
    participant FastAPI
    participant MySQL

    브라우저->>Nginx: HTTP 요청 (Bearer 토큰 포함)
    Nginx->>FastAPI: API 요청 프록시
    FastAPI->>FastAPI: JWT 토큰 검증
    FastAPI->>MySQL: 데이터 조회/변경
    MySQL-->>FastAPI: 결과 반환
    FastAPI-->>Nginx: JSON 응답
    Nginx-->>브라우저: 응답 전달
```

---

## 2. 기술 스택 상세

### 백엔드

| 구분 | 기술 | 버전 | 역할 |
|------|------|------|------|
| 런타임 | Python | 3.12 | 서버 실행 환경 |
| 웹 프레임워크 | FastAPI | 최신 | REST API 서버 |
| ORM | SQLModel | 최신 | DB 모델 정의 및 쿼리 |
| DB 드라이버 | PyMySQL | 최신 | MySQL 연결 |
| 인증 | python-jose | 최신 | JWT 토큰 생성/검증 |
| 비밀번호 | passlib (bcrypt) | 최신 | 비밀번호 해싱 |
| 페이지네이션 | fastapi-pagination | 최신 | 목록 API 페이지네이션 |
| 패키지 관리 | Poetry | 최신 | 의존성 관리 |
| MongoDB | Motor/PyMongo | 최신 | 보조 데이터베이스 (선택적) |

### 프론트엔드

| 구분 | 기술 | 버전 | 역할 |
|------|------|------|------|
| 프레임워크 | Vue 3 | 최신 | UI 컴포넌트 |
| 빌드 도구 | Vite | 최신 | 번들링 및 개발 서버 |
| 상태 관리 | Pinia | 최신 | 전역 상태 관리 |
| 라우터 | Vue Router | 최신 | SPA 라우팅 |
| HTTP 클라이언트 | Axios | 최신 | API 통신 |
| CSS 프레임워크 | Tailwind CSS | 최신 | 스타일링 |
| 폼 검증 | VeeValidate + Yup | 최신 | 폼 유효성 검사 |
| 패키지 관리 | pnpm | 최신 | 의존성 관리 |

### 인프라

| 구분 | 기술 | 역할 |
|------|------|------|
| 컨테이너 | Docker | 서비스 컨테이너화 |
| 오케스트레이션 | Docker Compose | 멀티 컨테이너 관리 |
| 웹서버/프록시 | Nginx | 정적 파일 서빙, API 리버스 프록시 |
| 데이터베이스 | MySQL/MariaDB | 주 데이터 저장소 (외부 서버) |

---

## 3. 백엔드 레이어 구조

### 디렉토리 구성

```
backend/app/
├── main.py           # FastAPI 앱 엔트리 포인트, 라우터 등록
├── core/
│   ├── config.py     # 환경 변수 설정 (Settings 클래스)
│   └── database.py   # DB 연결 및 세션 관리
├── models/           # SQLModel 데이터베이스 모델
│   ├── user.py
│   ├── client.py
│   ├── schedule.py
│   ├── program.py
│   ├── record.py
│   ├── voucher.py
│   ├── announcement.py
│   ├── inquiry.py
│   └── customer.py
├── schemas/          # Pydantic 요청/응답 스키마
├── crud/             # 데이터베이스 CRUD 작업
│   ├── user.py
│   ├── center.py
│   ├── client.py
│   ├── teacher.py
│   ├── schedule.py
│   ├── program.py
│   ├── record.py
│   ├── voucher.py
│   ├── announcement.py
│   ├── inquiry.py
│   └── customer.py
└── api/              # API 라우트 엔드포인트 (14개 라우터)
    ├── auth.py       # 로그인, 토큰 발급
    ├── signup.py     # 회원가입 (센터장 등록)
    ├── users.py      # 사용자 관리
    ├── center.py     # 센터 정보 관리
    ├── teacher.py    # 선생님 관리
    ├── client.py     # 내담자 관리
    ├── program.py    # 프로그램 관리
    ├── schedule.py   # 일정 관리
    ├── record.py     # 상담 기록 관리
    ├── voucher.py    # 바우처 관리
    ├── announcement.py  # 공지사항
    ├── inquiry.py    # 문의사항
    ├── customer.py   # 고객 관리
    └── password.py   # 비밀번호 변경
```

### 레이어 의존성

```mermaid
graph LR
    API[api/\nRoute 핸들러] --> CRUD[crud/\n비즈니스 로직]
    CRUD --> MODELS[models/\nDB 모델]
    API --> SCHEMAS[schemas/\n요청/응답 스키마]
    MODELS --> DB[(MySQL)]
    CORE[core/\n설정 및 DB 연결] --> DB
```

### 주요 API 엔드포인트

| 경로 | 메서드 | 설명 |
|------|--------|------|
| `/auth/login` | POST | 로그인, JWT 토큰 발급 |
| `/signup` | POST | 센터장 회원가입 |
| `/users` | GET/POST/PUT/DELETE | 사용자 CRUD |
| `/centers` | GET/POST/PUT/DELETE | 센터 관리 |
| `/teachers` | GET/POST/PUT/DELETE | 선생님 관리 |
| `/clients` | GET/POST/PUT/DELETE | 내담자 관리 |
| `/programs` | GET/POST/PUT/DELETE | 프로그램 관리 |
| `/schedules` | GET/POST/PUT/DELETE | 일정 관리 |
| `/records` | GET/POST/PUT/DELETE | 상담 기록 관리 |
| `/vouchers` | GET/POST/PUT/DELETE | 바우처 관리 |
| `/announcements` | GET/POST/PUT/DELETE | 공지사항 |
| `/inquiries` | GET/POST/PUT/DELETE | 문의사항 |

---

## 4. 프론트엔드 레이어 구조

### 디렉토리 구성

```
frontend/src/
├── main.js             # Vue 앱 엔트리 포인트
├── App.vue             # 루트 컴포넌트
├── api/                # API 통신 레이어
│   ├── interceptors.js # axios 인터셉터 (토큰 자동 첨부, 401 처리)
│   └── *.js            # 도메인별 API 서비스
├── views/              # 페이지 컴포넌트
│   ├── MonthlyView.vue      # 월간 캘린더
│   ├── WeeklyView.vue       # 주간 캘린더
│   ├── DailyViewSliding.vue # 일간 상세 뷰
│   ├── ProgramView.vue      # 프로그램 관리
│   ├── ClientList.vue       # 내담자 목록
│   └── UserList.vue         # 사용자 목록
├── components/         # 재사용 UI 컴포넌트
│   ├── *FormSliding.vue     # 슬라이딩 패널 폼
│   └── ...
├── router/             # Vue Router 설정
│   ├── index.js        # 라우터 엔트리
│   └── admin/          # 데스크톱 라우트 정의
├── stores/             # Pinia 전역 상태
│   ├── auth.js         # 인증 상태 (user, token)
│   ├── calendarStore.js # 캘린더 상태
│   └── teacherStore.js  # 선생님 목록 상태
└── hooks/              # Composable 함수
```

### 컴포넌트 네이밍 규칙

| 패턴 | 예시 | 용도 |
|------|------|------|
| `*FormSliding.vue` | `ScheduleFormSliding.vue` | 등록/수정 슬라이딩 패널 |
| `*List.vue` | `ClientList.vue` | 목록 페이지 |
| `*View.vue` | `MonthlyView.vue` | 메인 뷰 페이지 |

### API 응답 처리 규칙

`src/api/interceptors.js`에서 axios 응답 인터셉터가 `response.data`를 자동으로 추출합니다. 따라서 API 호출부에서는 `.data`를 추가로 접근하지 않아야 합니다.

```javascript
// 잘못된 패턴 (오류 발생)
const data = response.data.items

// 올바른 패턴
const data = response.items
```

---

## 5. 인증 및 보안 아키텍처

### 인증 플로우

```mermaid
sequenceDiagram
    participant 사용자
    participant Vue앱
    participant localStorage
    participant axios인터셉터
    participant FastAPI

    사용자->>Vue앱: 로그인 (이메일/비밀번호)
    Vue앱->>FastAPI: POST /auth/login
    FastAPI->>FastAPI: bcrypt 비밀번호 검증
    FastAPI-->>Vue앱: JWT 액세스 토큰 반환
    Vue앱->>localStorage: 토큰 저장 (VITE_TOKEN_KEY)
    Vue앱->>Pinia(auth store): 사용자 정보 저장

    사용자->>Vue앱: API 요청
    Vue앱->>axios인터셉터: 요청 발생
    axios인터셉터->>localStorage: 토큰 조회
    axios인터셉터->>FastAPI: Authorization: Bearer {token} 헤더 첨부

    alt 토큰 유효
        FastAPI-->>Vue앱: 정상 응답
    else 401 Unauthorized
        FastAPI-->>axios인터셉터: 401 응답
        axios인터셉터->>localStorage: 토큰 삭제
        axios인터셉터->>Vue앱: /login 리다이렉트
    end
```

### JWT 토큰 설정

| 항목 | 설정 |
|------|------|
| 알고리즘 | HS256 |
| 만료 시간 | `ACCESS_TOKEN_EXPIRE_MINUTES` 환경 변수 |
| 서명 키 | `SECRET_KEY` 환경 변수 |
| 저장 위치 | 브라우저 localStorage |

### 사용자 권한 체계

```mermaid
graph TB
    SA[최고관리자\nis_superuser == 1] --> ALL[시스템 전체 접근]
    CM[센터장\nuser_type == 1] --> CENTER[자신의 센터 관리]
    CM --> TEACHERS_MGT[선생님 관리/조회]
    CM --> CLIENTS_MGT[센터 내담자 관리]
    T[선생님\n기본값] --> OWN_CLIENTS[담당 내담자만 관리]
    T --> OWN_SCHEDULE[자신의 일정만 관리]
    T --> RECORDS[상담 기록 작성]
```

### 데이터 격리 원칙

- 모든 API에서 센터 ID 기반 권한 검증 필수
- 선생님은 소속 센터 데이터만 접근 가능
- 센터장은 자신의 센터 데이터만 관리 가능
- 최고관리자만 전체 데이터 접근 가능

---

## 6. 데이터 플로우

### API 요청/응답 구조

```mermaid
graph LR
    FE[Vue 컴포넌트] -->|호출| API_SVC[api/*.js\nAPI 서비스]
    API_SVC -->|axios 요청| INTERCEPTOR[interceptors.js]
    INTERCEPTOR -->|Bearer 토큰 첨부| NGINX[Nginx]
    NGINX -->|프록시| FASTAPI[FastAPI]
    FASTAPI -->|쿼리| MYSQL[(MySQL)]
    MYSQL -->|결과| FASTAPI
    FASTAPI -->|JSON 응답| NGINX
    NGINX -->|응답| INTERCEPTOR
    INTERCEPTOR -->|response.data 추출| API_SVC
    API_SVC -->|데이터 반환| FE
```

### 페이지네이션 응답 형식

백엔드는 `fastapi-pagination`을 사용하여 표준화된 페이지네이션 응답을 반환합니다.

```json
{
  "items": [...],
  "total": 100,
  "page": 1,
  "size": 20
}
```

프론트엔드에서의 사용:
```javascript
const response = await getClients({ page: 1, size: 20 })
const items = response.items   // 목록 데이터
const total = response.total   // 전체 건수
```

### 상태 관리 흐름

```mermaid
graph TD
    COMP[Vue 컴포넌트] -->|dispatch| STORE[Pinia Store]
    STORE -->|API 호출| API_LAYER[API 레이어]
    API_LAYER -->|HTTP| BACKEND[FastAPI]
    BACKEND -->|응답| API_LAYER
    API_LAYER -->|데이터 반환| STORE
    STORE -->|상태 업데이트| COMP
```

**Pinia 스토어 목록:**

| 스토어 | 파일 | 관리 상태 |
|--------|------|-----------|
| auth | `stores/auth.js` | 로그인 사용자 정보, 인증 토큰 |
| calendar | `stores/calendarStore.js` | 캘린더 날짜, 일정 데이터 |
| teacher | `stores/teacherStore.js` | 선생님 목록, 선택된 선생님 |

---

## 7. 배포 아키텍처 (Docker)

### 컨테이너 구성

```mermaid
graph TB
    subgraph "Docker Compose Network"
        WEB[web\nNginx 컨테이너\n:8081 prod\n:2080 dev]
        API[api\nFastAPI 컨테이너\n:3000]
    end

    subgraph "호스트 볼륨"
        DIST[frontend/dist/\n빌드된 정적 파일]
        CONF[conf/nginx.conf\nNginx 설정]
    end

    subgraph "외부 서비스"
        MYSQL[(MySQL\n외부 서버)]
        MONGO[(MongoDB\n선택적)]
    end

    BROWSER[브라우저] -->|:8081| WEB
    WEB -->|정적 파일| DIST
    WEB -->|API 프록시| API
    API -->|CONN_URL| MYSQL
    API -->|MONGO_URI| MONGO
    CONF -->|마운트| WEB
```

### 환경별 설정

#### 프로덕션 (`docker-compose.yml`)

| 서비스 | 포트 | 설명 |
|--------|------|------|
| web (Nginx) | 8081 | 프론트엔드 서빙 + API 프록시 |
| api (FastAPI) | 3000 | REST API 서버 |

- 도메인: `www.itoktok.com:8081` (프론트엔드), `api.itoktok.com:3000` (API)
- Nginx 설정: `conf/nginx.conf`

#### 개발 (`docker-compose.dev.yml`)

| 서비스 | 포트 | 설명 |
|--------|------|------|
| web (Nginx) | 2080 | 프론트엔드 서빙 + API 프록시 |
| api (FastAPI) | 3000 | REST API 서버 (--reload) |

- 로컬 도메인: `localhost:2080` (프론트엔드), `localhost:3000` (API)
- Nginx 설정: `conf/nginx.dev.conf`

### Nginx 라우팅 규칙

```
www.itoktok.com:8081
  ├── /          → frontend/dist/ (정적 파일)
  └── /api/*     → http://api:3000 (FastAPI 프록시)
```

### 환경 변수

#### 백엔드 (`.env`)

```bash
# MySQL 연결 (필수)
CONN_URL=mysql+pymysql://user:password@host:port/database

# MongoDB 연결 (선택)
MONGO_URI=mongodb://host:port
MONGO_DB=database_name

# JWT 설정 (필수)
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

#### 프론트엔드

| 파일 | 변수 | 값 |
|------|------|-----|
| `.env.development` | `VITE_API_BASE_URL` | `http://localhost:2080` |
| `.env.production` | `VITE_API_BASE_URL` | `http://itoktok-api.gillilab.com` |
| 공통 | `VITE_TOKEN_KEY` | `access_token` |

### 빌드 및 배포 절차

```bash
# 1. 프론트엔드 빌드
cd frontend && pnpm build

# 2. Docker Compose 실행 (프로덕션)
cd .. && docker compose up -d

# Mac M1/M2 환경
env DOCKER_DEFAULT_PLATFORM=linux/amd64 docker compose build
```

---

## 8. 확장성 고려사항

### 현재 아키텍처의 특성

| 항목 | 현황 |
|------|------|
| 데이터베이스 | 단일 외부 MySQL 서버 |
| API 서버 | 단일 FastAPI 인스턴스 |
| 인증 | Stateless JWT (수평 확장 용이) |
| 파일 저장 | 현재 미구현 (로컬/S3 확장 가능) |

### 수평 확장 고려사항

**API 서버 확장:**
- JWT 기반 Stateless 인증으로 다중 인스턴스 운영 가능
- Nginx upstream 설정으로 로드 밸런싱 적용 가능
- Docker Compose scale 옵션으로 API 인스턴스 증설 가능

**데이터베이스 확장:**
- 읽기 트래픽 증가 시: MySQL Read Replica 추가 및 읽기/쓰기 분리
- 캐싱 레이어: Redis 도입으로 자주 조회되는 데이터 캐싱 가능
- 현재 외부 MySQL 서버 사용으로 DB 스케일업 독립적 진행 가능

**모바일 플랫폼:**
- Expo 기반 모바일 앱 신규 구축 예정
- 현재 REST API 그대로 재사용 가능 (별도 모바일 API 불필요)
- 필요 시 모바일 특화 엔드포인트 추가 (`/mobile/` 프리픽스 권장)

### 성능 최적화 포인트

- **Vue Router Lazy Loading**: 코드 스플리팅으로 초기 로딩 최소화
- **Nginx 정적 파일 캐싱**: `Cache-Control` 헤더로 브라우저 캐싱 활용
- **fastapi-pagination**: 대용량 목록 API 페이지네이션 처리
- **SQLModel 세션 관리**: 요청별 DB 세션 생성/해제로 커넥션 풀 효율화

### 보안 강화 로드맵

- HTTPS 적용 (현재 HTTP, Let's Encrypt 활용 가능)
- Refresh Token 도입 (현재 Access Token만 사용)
- Rate Limiting (Nginx 또는 FastAPI 미들웨어)
- 개인정보(내담자 데이터) 암호화 저장 고려

---

*최종 업데이트: 2026-03-30*
