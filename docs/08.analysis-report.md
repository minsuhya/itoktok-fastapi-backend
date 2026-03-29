# ITokTok 코드베이스 분석 보고서

> 최종 업데이트: 2026-02-22
> 분석 범위: backend/, frontend/, mobile/, 인프라 (Docker, Nginx)
> 분석 방법: 정적 검색(Grep/AST-grep), 파일 구조 탐색, 코드 정독, Git 이력 분석

---

## 1. 시스템 개요

| 항목 | 내용 |
|------|------|
| 프로젝트명 | ITokTok (아동 심리 상담센터 관리 시스템) |
| Backend | FastAPI + SQLModel + MySQL(MariaDB) + JWT |
| Frontend | Vue 3 + Pinia + Vue Router + Axios + Tailwind CSS |
| Mobile | Expo (SDK 54) + React Native 0.81 + TypeScript |
| 권한 체계 | 최고관리자(is_superuser=1) / 센터장(user_type=1) / 선생님(user_type=2) |

---

## 2. 주요 발견사항

### 2.1 API 응답 규약 불일치 (High)

- **증거**: `frontend/src/api/interceptors.js`는 `response.data`만 반환
- **증거**: 여러 API 모듈이 `response.data`를 다시 참조하여 이중 추출
  - 예: `frontend/src/api/user.js`, `frontend/src/api/center.js`
- **영향**: 일부 API 호출에서 `undefined` 또는 잘못된 데이터가 전달될 가능성
- **개선**: 인터셉터 반환 규약에 맞게 API 모듈과 뷰 코드 일관화

### 2.2 인증/권한 처리 분산 및 중복 (High)

- **증거**: 비밀번호 해싱 로직이 API(`backend/app/api/users.py`)와 CRUD(`backend/app/crud/user.py`)에 중복
- **영향**: 정책 변경 시 이중 수정 필요, 보안 정책 불일치 위험
- **개선**: 해싱을 단일 계층(CRUD 또는 서비스 계층)으로 집중

### 2.3 예외 처리/트랜잭션 일관성 부족 (High)

- **증거**: `backend/app/core/mydb.py`는 세션 제공만 수행, 예외 롤백 규약 없음
- **증거**: 일부 엔드포인트는 try/except 롤백, 다수는 없음
- **영향**: DB 예외 발생 시 롤백 누락, 데이터 정합성/연결 안정성 저하
- **개선**: 공통 트랜잭션 헬퍼 또는 서비스 계층에서 rollback 규약화

### 2.4 테스트 부재 (High)

- **증거**: `backend/tests/` 에 3개 파일 존재하나 모두 Hero 튜토리얼 샘플
- **증거**: 실제 비즈니스 로직(인증, CRUD, 권한) 테스트 0개
- **증거**: 프론트엔드/모바일 테스트 코드 0개
- **영향**: 리팩토링/기능 추가 시 회귀 버그 감지 불가
- **개선**: 최소 인증 + 핵심 CRUD 테스트 작성

### 2.5 DB 마이그레이션 부재 (High)

- **증거**: Alembic 미설정, `create_all()`로 직접 테이블 생성
- **영향**: 스키마 변경 시 데이터 손실 위험, 프로덕션 배포 어려움
- **개선**: Alembic 도입하여 스키마 버전 관리

### 2.6 CORS 완전 개방 (Medium)

- **증거**: `backend/app/core/app.py`에서 `allow_origins=["*"]` + `allow_credentials=True`
- **영향**: 보안 취약 — 임의 도메인에서 인증된 요청 가능
- **개선**: 프로덕션 도메인 화이트리스트로 제한

### 2.7 Deprecated API 사용 (Medium)

- **증거**: `@app.on_event("startup/shutdown")` 사용 중 (FastAPI lifespan으로 전환 필요)
- **증거**: `schedule_create.dict(...)` 등 Pydantic v1 API 혼재
- **영향**: 향후 FastAPI/Pydantic 업그레이드 시 호환성 문제
- **개선**: lifespan context manager 전환, `model_dump()` 통일

### 2.8 API 경로 중복 버그 (Medium)

- **증거**: 4개 라우터에서 prefix와 데코레이터 경로 중복
  - `/records/records/`, `/vouchers/vouchers/`, `/announcements/announcements/`, `/inquiries/inquiries/`
- **영향**: 프론트엔드 연동 시 잘못된 경로 호출
- **개선**: 데코레이터 경로를 `/`로 수정

### 2.9 중복 모델 구조 (Medium)

- **증거**: `User`, `CenterDirector`, `Teacher` 3개 모델이 유사한 사용자 역할 표현
- **증거**: `UserBase`를 상속하지만 `User` 모델과 별도 테이블
- **영향**: 데이터 정합성 관리 어려움, 쿼리 복잡화
- **개선**: 단일 User 모델 + 역할 기반 필드 확장 검토

### 2.10 프론트엔드 템플릿 잔재 (Low)

- **증거**: `HelloWorld.vue`, `TheWelcome.vue`, `counter.js`, 아이콘 컴포넌트 5개 등
- **증거**: `MonthlyView.bak.vue` 백업 파일 존재
- **영향**: 코드베이스 불필요한 복잡도 증가
- **개선**: 미사용 파일 정리

### 2.11 .env 파일 Git 포함 (Medium)

- **증거**: `.env`, `frontend/.env.development`, `frontend/.env.production`, `mobile/.env` 등이 git tracked
- **영향**: 민감 정보(DB 접속 정보, 시크릿 키) 노출 위험
- **개선**: `.gitignore`에 추가, 시크릿 관리 체계 수립

---

## 3. 개선 우선순위

| 순위 | 항목 | 심각도 | 노력도 |
|------|------|--------|--------|
| 1 | API 응답 규약 통일 | High | 낮음 |
| 2 | 인증/권한 및 해싱 중복 제거 | High | 중간 |
| 3 | 트랜잭션/예외 처리 표준화 | High | 중간 |
| 4 | 핵심 비즈니스 로직 테스트 작성 | High | 높음 |
| 5 | Alembic 마이그레이션 도입 | High | 중간 |
| 6 | API 경로 중복 버그 수정 | Medium | 낮음 |
| 7 | CORS 정책 강화 | Medium | 낮음 |
| 8 | Deprecated API 전환 | Medium | 중간 |
| 9 | .env 보안 처리 | Medium | 낮음 |
| 10 | 미사용 파일 정리 | Low | 낮음 |

---

## 4. 검증 기준 (초안)

- API 호출에서 `undefined` 데이터가 발생하지 않음
- 사용자 생성/수정 시 해싱 로직이 단일 경로로만 수행
- DB 예외 발생 시 롤백이 일관적으로 적용
- 프론트에서 에러 처리 UX가 일관되게 동작
- 스키마 변경 시 마이그레이션 스크립트로 관리
- 인증이 필요한 모든 API에 JWT 검증 적용
