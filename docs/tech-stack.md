# ITokTok 기술 스택 상세

> 최종 업데이트: 2026-02-22
> 관련 문서: [프로젝트 현황](./project-status.md) | [분석 보고서](./ANALYSIS_REPORT.md)

---

## 1. 아키텍처 개요

```
┌─────────────────────────────────────────────────────────────────┐
│                        클라이언트 레이어                          │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐    │
│  │  Vue 3 SPA   │  │ Expo Mobile  │  │  브라우저 (직접)     │    │
│  │  (웹 관리자)  │  │ (모바일 앱)   │  │  /docs (Swagger)   │    │
│  └──────┬───────┘  └──────┬───────┘  └────────┬───────────┘    │
│         │                 │                    │                │
└─────────┼─────────────────┼────────────────────┼────────────────┘
          │                 │                    │
    ┌─────┴─────────────────┴────────────────────┴─────┐
    │              Nginx 리버스 프록시                    │
    │    www.itoktok.com → frontend (port 5173/80)     │
    │    api.itoktok.com → backend  (port 3000/8000)   │
    └──────────────────────┬───────────────────────────┘
                           │
    ┌──────────────────────┴───────────────────────────┐
    │              FastAPI Backend                      │
    │  ┌────────┐ ┌────────┐ ┌─────────┐ ┌─────────┐ │
    │  │  API   │ │  CRUD  │ │ Schemas │ │ Models  │ │
    │  │(Routes)│→│(Logic) │→│(Pydantic)│ │(SQLModel)│ │
    │  └────────┘ └────────┘ └─────────┘ └────┬────┘ │
    │                                          │      │
    │  ┌────────────┐  ┌──────────────┐       │      │
    │  │ JWT Auth   │  │ Pagination   │       │      │
    │  │(python-jose│  │(fastapi-     │       │      │
    │  │ +passlib)  │  │ pagination)  │       │      │
    │  └────────────┘  └──────────────┘       │      │
    └─────────────────────────────────────────┼──────┘
                                              │
    ┌─────────────────────────────────────────┴──────┐
    │              데이터베이스 레이어                   │
    │  ┌───────────────────┐  ┌───────────────────┐  │
    │  │  MySQL / MariaDB  │  │    MongoDB         │  │
    │  │  (주 데이터베이스)  │  │  (보조, 선택적)     │  │
    │  └───────────────────┘  └───────────────────┘  │
    └────────────────────────────────────────────────┘
```

---

## 2. Backend 기술 스택

### 2.1 런타임 및 프레임워크

| 기술 | 버전 | 용도 | 비고 |
|------|------|------|------|
| Python | ^3.9 | 런타임 | 3.9 EOL 예정, 3.11+ 권장 |
| FastAPI | ^0.111.0 | 웹 프레임워크 | 전체 기능 설치 (`[full]`) |
| Uvicorn | ^0.18.3 | ASGI 서버 | 개발 시 `--reload` 사용 |

### 2.2 ORM / 데이터베이스

| 기술 | 버전 | 용도 | 비고 |
|------|------|------|------|
| SQLModel | ^0.0.19 | ORM (SQLAlchemy + Pydantic) | 모델/스키마 통합 |
| Pydantic | ^2.7.3 | 데이터 검증 | email extras 포함 |
| PyMySQL | ^1.1.0 | MySQL 드라이버 | 순수 Python 구현 |
| psycopg2-binary | ^2.9.3 | PostgreSQL 드라이버 | 레거시 잔재 (미사용) |
| PyMongo | ^4.2.0 | MongoDB 드라이버 | 보조 DB 연결 |

### 2.3 인증 / 보안

| 기술 | 버전 | 용도 | 비고 |
|------|------|------|------|
| python-jose | ^3.3.0 | JWT 토큰 생성/검증 | cryptography extras |
| passlib | ^1.7.4 | 비밀번호 해싱 | bcrypt extras |
| bcrypt | 4.0.1 | 해싱 알고리즘 | 버전 고정 (passlib 호환) |
| python-multipart | ^0.0.7 | OAuth2 폼 파싱 | FastAPI 인증 의존 |

### 2.4 유틸리티

| 기술 | 버전 | 용도 | 비고 |
|------|------|------|------|
| loguru | ^0.6.0 | 구조화 로깅 | 표준 logging 대체 |
| python-dotenv | ^0.21.0 | 환경 변수 로드 | .env 파일 관리 |
| fastapi-pagination | ^0.12.34 | 페이지네이션 | 표준 Page 응답 |

### 2.5 개발/테스트 의존성

| 기술 | 버전 | 용도 |
|------|------|------|
| pytest | ^7.1.3 | 테스트 프레임워크 |
| httpx | ^0.23.0 | 비동기 HTTP 테스트 클라이언트 |
| requests | ^2.28.1 | HTTP 클라이언트 |
| aiohttp | ^3.8.3 | 비동기 HTTP |
| ipykernel | ^6.16.0 | Jupyter 노트북 |

### 2.6 의존성 관리

| 도구 | 설정 파일 | 비고 |
|------|-----------|------|
| Poetry | `pyproject.toml` | 가상환경 in-project 설정 |
| pip | - | Poetry 통해 관리 |

---

## 3. Frontend 기술 스택

### 3.1 코어 프레임워크

| 기술 | 버전 | 용도 | 비고 |
|------|------|------|------|
| Vue | ^3.4.38 | UI 프레임워크 | Composition API |
| Vue Router | ^4.4.3 | SPA 라우팅 | History 모드 |
| Pinia | ^2.2.2 | 상태 관리 | Vuex 후속 |
| Vite | ^5.4.2 | 빌드 도구 | HMR 지원 |

### 3.2 UI / 스타일링

| 기술 | 버전 | 용도 | 비고 |
|------|------|------|------|
| Tailwind CSS | ^3.4.14 | 유틸리티 CSS | 커스텀 애니메이션 포함 |
| @tailwindcss/forms | ^0.5.7 | 폼 스타일 플러그인 | |
| @tailwindcss/typography | ^0.5.14 | 타이포그래피 플러그인 | |
| @heroicons/vue | ^2.1.5 | 아이콘 라이브러리 | SVG 아이콘 |
| PostCSS | ^8.4.47 | CSS 후처리 | |
| Autoprefixer | ^10.4.20 | CSS 벤더 프리픽스 | |

### 3.3 HTTP / 데이터

| 기술 | 버전 | 용도 | 비고 |
|------|------|------|------|
| Axios | ^1.7.5 | HTTP 클라이언트 | 인터셉터 기반 인증 |
| @vueuse/core | ^11.0.3 | Vue 유틸리티 | Composition API 훅 |

### 3.4 폼 / 검증

| 기술 | 버전 | 용도 | 비고 |
|------|------|------|------|
| VeeValidate | ^4.13.2 | 폼 검증 프레임워크 | 전역 규칙 등록 |
| @vee-validate/rules | ^4.13.2 | 검증 규칙 컬렉션 | |
| Yup | ^1.4.0 | 스키마 검증 | VeeValidate 연동 |

### 3.5 개발 도구

| 기술 | 버전 | 용도 |
|------|------|------|
| ESLint | ^8.57.0 | 코드 린트 |
| eslint-plugin-vue | ^9.27.0 | Vue 전용 린트 규칙 |
| @vue/eslint-config-prettier | ^9.0.0 | ESLint-Prettier 통합 |
| Prettier | ^3.3.3 | 코드 포맷팅 |
| @vitejs/plugin-vue | ^5.1.2 | Vite Vue 플러그인 |
| vite-plugin-vue-devtools | ^7.3.9 | Vue DevTools 통합 |
| @rushstack/eslint-patch | ^1.10.4 | ESLint 패치 |

### 3.6 의존성 관리

| 도구 | 설정 파일 | 비고 |
|------|-----------|------|
| pnpm | `package.json` | lockfile: `pnpm-lock.yaml` |

---

## 4. Mobile 기술 스택

### 4.1 코어 프레임워크

| 기술 | 버전 | 용도 | 비고 |
|------|------|------|------|
| Expo | ~54.0.32 | 개발 플랫폼 | 매니지드 워크플로 |
| React Native | 0.81.5 | 네이티브 UI | |
| React | 19.1.0 | UI 라이브러리 | |
| TypeScript | ~5.9.2 | 타입 시스템 | |

### 4.2 네비게이션 / 라우팅

| 기술 | 버전 | 용도 |
|------|------|------|
| expo-router | ~6.0.22 | 파일 기반 라우팅 |
| @react-navigation/native | ^7.1.8 | 네비게이션 코어 |
| react-native-screens | ~4.16.0 | 네이티브 화면 관리 |

### 4.3 UI / 애니메이션

| 기술 | 버전 | 용도 |
|------|------|------|
| react-native-reanimated | ~4.1.1 | 고성능 애니메이션 |
| react-native-gesture-handler | ^2.30.0 | 제스처 처리 |
| expo-blur | ~15.0.8 | 블러 효과 |
| expo-haptics | ~15.0.8 | 햅틱 피드백 |
| @expo/vector-icons | ^15.0.3 | 아이콘 |

### 4.4 폰트

| 기술 | 버전 | 용도 |
|------|------|------|
| @expo-google-fonts/outfit | ^0.4.3 | Outfit 폰트 |
| @expo-google-fonts/plus-jakarta-sans | ^0.4.2 | Plus Jakarta Sans 폰트 |
| expo-font | ~14.0.11 | 폰트 로딩 |

### 4.5 유틸리티 / 기능

| 기술 | 버전 | 용도 |
|------|------|------|
| axios | ^1.13.2 | HTTP 클라이언트 |
| date-fns | ^4.1.0 | 날짜 유틸리티 |
| react-native-calendars | ^1.1313.0 | 캘린더 위젯 |
| expo-secure-store | ~15.0.8 | 보안 토큰 저장 |
| expo-constants | ~18.0.13 | 앱 상수 |
| expo-linking | ~8.0.11 | 딥링크 |
| expo-splash-screen | ~31.0.13 | 스플래시 화면 |
| expo-status-bar | ~3.0.9 | 상태바 제어 |
| expo-web-browser | ~15.0.10 | 인앱 브라우저 |
| react-native-safe-area-context | ~5.6.0 | 안전 영역 |
| react-native-web | ~0.21.0 | 웹 호환성 |
| react-native-worklets | 0.5.1 | 워클릿 |

### 4.6 의존성 관리

| 도구 | 설정 파일 | 비고 |
|------|-----------|------|
| pnpm | `package.json` | Expo와 함께 사용 |

---

## 5. 인프라 / DevOps

### 5.1 컨테이너

| 기술 | 용도 | 설정 파일 |
|------|------|-----------|
| Docker | 컨테이너 런타임 | `backend/Dockerfile` |
| Docker Compose | 멀티 서비스 오케스트레이션 | `docker-compose.yml` (prod) |
| Docker Compose (dev) | 개발 환경 | `docker-compose.dev.yml` |

### 5.2 서비스 구성 (Docker Compose)

```yaml
# 프로덕션 서비스
services:
  nginx:        # 리버스 프록시 (포트 8000 → backend/frontend)
  backend:      # FastAPI 서버 (포트 3000)
  frontend:     # Vue 3 SPA (빌드 후 정적 서빙)
  mariadb:      # 주 데이터베이스
  mongodb:      # 보조 데이터베이스 (선택)
```

### 5.3 웹 서버

| 기술 | 용도 | 설정 위치 |
|------|------|-----------|
| Nginx | 리버스 프록시 | `conf/` 디렉토리 |
| 도메인 라우팅 | api.itoktok.com / www.itoktok.com | Nginx 설정 |

### 5.4 CI/CD (미구성)

현재 CI/CD 파이프라인이 설정되어 있지 않습니다. 권장 구성:

```
[미구성 — 향후 계획]
- GitHub Actions 또는 GitLab CI
- 자동 테스트 → 빌드 → 배포
- 환경별 분리 (dev / staging / prod)
```

---

## 6. 데이터베이스 스키마 개요

### 6.1 주요 테이블 (MySQL/MariaDB)

| 테이블 | 설명 | 주요 관계 |
|--------|------|-----------|
| `user` | 사용자 (관리자, 센터장, 선생님) | → center_info, schedule |
| `center_info` | 상담센터 정보 | → user (센터장), teacher |
| `center_director` | 센터장 정보 | → center_info, user |
| `teacher` | 선생님 정보 | → center_info, user, schedule |
| `client_info` | 내담자(고객) 정보 | → schedule, voucher |
| `program_info` | 치료 프로그램 | → schedule |
| `schedule_list` | 상담 일정 | → user, client, program, teacher |
| `schedule_record` | 상담 기록 | → schedule_list |
| `voucher` | 바우처 정보 | → client_info |
| `announcement` | 공지사항 | → user (작성자) |
| `inquiry` | 문의사항 | → user |

### 6.2 ERD 요약 (핵심 관계)

```
User ──┬── CenterDirector ── CenterInfo
       │                         │
       │                    Teacher ────── Schedule
       │                         │            │
       └── Schedule ─────── ClientInfo    Program
                                │
                            Voucher
                            Record
```

### 6.3 보조 데이터베이스 (MongoDB)

- 연결 설정: `app/core/mgdb.py`
- 현재 활성 사용 여부: 미확인 (선택적 구성)
- 환경 변수: `MONGO_URI`, `MONGO_DB`

---

## 7. 환경 변수 명세

### 7.1 Backend (.env)

| 변수명 | 용도 | 예시 |
|--------|------|------|
| `CONN_URL` | MySQL/MariaDB 연결 문자열 | `mysql+pymysql://user:pass@host/db` |
| `SECRET_KEY` | JWT 시크릿 키 | (임의 문자열) |
| `ALGORITHM` | JWT 알고리즘 | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | 토큰 만료 시간(분) | `120` |
| `MONGO_URI` | MongoDB 연결 문자열 | `mongodb://host:27017` |
| `MONGO_DB` | MongoDB 데이터베이스 이름 | `itoktok` |

### 7.2 Frontend (.env.development)

| 변수명 | 용도 | 값 |
|--------|------|-----|
| `VITE_API_BASE_URL` | 개발 API 주소 | `http://localhost:2080` |
| `VITE_TOKEN_KEY` | JWT 토큰 localStorage 키 | `access_token` |

### 7.3 Frontend (.env.production)

| 변수명 | 용도 | 값 |
|--------|------|-----|
| `VITE_API_BASE_URL` | 운영 API 주소 | `http://itoktok-api.gillilab.com` |
| `VITE_TOKEN_KEY` | JWT 토큰 localStorage 키 | `access_token` |

### 7.4 Mobile (.env)

| 변수명 | 용도 | 값 |
|--------|------|-----|
| `EXPO_PUBLIC_API_URL` | API 주소 | `http://localhost:3000` |
| `EXPO_PUBLIC_TOKEN_KEY` | 토큰 저장 키 | `access_token` |

---

## 8. 개발 환경 설정

### 8.1 호스트 파일 설정

```bash
# /etc/hosts
127.0.1.1    api.itoktok.com www.itoktok.com
```

### 8.2 로컬 개발 포트

| 서비스 | 포트 | 비고 |
|--------|------|------|
| Backend (직접 실행) | 3000 또는 8000 | `uvicorn --port 3000` |
| Frontend (Vite dev) | 5173 | `pnpm dev` |
| Nginx (Docker) | 8000 | 리버스 프록시 |
| MariaDB | 3306 | Docker 서비스 |
| MongoDB | 27017 | Docker 서비스 (선택) |
| Expo Dev Server | 8081 | `pnpm start` |

### 8.3 빌드 명령어

```bash
# Backend
cd backend && poetry install --no-root
poetry run uvicorn app.main:app --host 0.0.0.0 --port 3000 --reload

# Frontend
cd frontend && pnpm install && pnpm dev      # 개발
cd frontend && pnpm build                     # 프로덕션 빌드

# Mobile
cd mobile && pnpm install && pnpm start       # Expo 개발 서버

# Docker (전체)
docker compose up -d                          # 프로덕션
docker compose -f docker-compose.dev.yml up -d  # 개발

# Docker 빌드 (Mac M1)
env DOCKER_DEFAULT_PLATFORM=linux/amd64 docker compose build
```

---

*이 문서는 프로젝트에 사용된 모든 기술과 의존성을 상세히 기록합니다. 버전 업데이트 시 이 문서도 함께 갱신하세요.*
