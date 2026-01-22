# ITokTok 코드베이스 분석 보고서

## 범위
- backend/app, backend/README.md, backend/pyproject.toml
- frontend/src, frontend/package.json, frontend/README.md
- database/README.md, 루트 README.md

## 방법
- 문서/구성 파일 검토
- 정적 검색(Grep/AST-grep)
- 핵심 흐름 코드 정독(인증, 사용자, 스케줄, API 인터셉터)

## 시스템 개요
- Backend: FastAPI + SQLModel + MySQL(MariaDB) + JWT
- Frontend: Vue 3 + Pinia + Vue Router + Axios + Tailwind
- 권한: 최고관리자(is_superuser=1) / 센터장(user_type=1) / 선생님(user_type=2)

## 주요 발견사항

### 1) API 응답 규약 불일치 (High)
- 증거: `frontend/src/api/interceptors.js`는 `response.data`만 반환
- 증거: 여러 API 모듈이 `response.data`를 다시 참조함
  - 예: `frontend/src/api/user.js`, `frontend/src/api/center.js`
- 영향: 일부 API 호출에서 `undefined` 또는 잘못된 데이터가 전달될 가능성
- 개선: 인터셉터 반환 규약에 맞게 API 모듈과 뷰 코드 일관화

### 2) 인증/권한 처리 분산 및 중복 (High)
- 증거: 비밀번호 해싱 로직이 API(`backend/app/api/users.py`)와 CRUD(`backend/app/crud/user.py`)에 중복
- 영향: 정책 변경 시 이중 수정 필요, 보안 정책 불일치 위험
- 개선: 해싱을 단일 계층(CRUD 또는 서비스 계층)로 집중

### 3) 예외 처리/트랜잭션 일관성 부족 (High)
- 증거: `backend/app/core/mydb.py`는 세션 제공만 수행, 예외 롤백 규약 없음
- 증거: 일부 엔드포인트는 try/except 롤백, 다수는 없음
- 영향: DB 예외 발생 시 롤백 누락, 데이터 정합성/연결 안정성 저하
- 개선: 공통 트랜잭션 헬퍼 또는 서비스 계층에서 rollback 규약화

### 4) Pydantic v2 사용과 구식 API 혼재 (Medium)
- 증거: `backend/app/api/schedule.py`에서 `schedule_create.dict(...)` 사용
- 영향: v2에서 권장되지 않는 API 사용, 향후 업그레이드 리스크
- 개선: `model_dump()`로 통일

### 5) 프론트 상태/토큰 저장 전략 분산 (Medium)
- 증거: `frontend/src/stores/auth.js`에서 로컬스토리지 직접 관리
- 증거: `frontend/src/utils/token.js`에서도 로컬스토리지 직접 접근
- 영향: 저장 규칙이 분산되어 변경 비용 증가, 버그 유발
- 개선: 저장 레이어를 단일 유틸/컴포저블로 통합

### 6) 디버그 로그/알림 처리의 운영 적합성 (Low)
- 증거: `frontend/src/api/interceptors.js`에 `console.log`, `alert` 존재
- 영향: 운영 환경에서 노이즈/UX 저하
- 개선: 로깅 레벨 구분 또는 제거, 사용자 알림 통합

### 7) 문서/스택 불일치 (Medium)
- 증거: `backend/README.md`, `database/README.md`가 PostgreSQL 튜토리얼 기반
- 영향: 실제 운영(MySQL/MariaDB)과 문서 불일치로 온보딩/운영 혼선
- 개선: 현재 스택에 맞는 문서 정리

### 8) API 에러 응답 포맷 일관성 부족 (Medium)
- 증거: 일부 엔드포인트는 `SuccessResponse`, 일부는 직접 모델 반환
- 영향: 클라이언트 처리 복잡화
- 개선: 응답 스키마 통일(성공/에러 포맷 표준화)

## 개선 우선순위 (권장)
1. API 응답 규약 통일 (High, 사용자 영향)
2. 인증/권한 및 해싱 중복 제거 (High, 보안/유지보수)
3. 트랜잭션/예외 처리 표준화 (High, 데이터 정합성)
4. Pydantic v2 API 통일 (Medium, 안정성)
5. 프론트 상태/토큰 저장 단일화 (Medium, 유지보수)
6. 문서 정합성 개선 (Medium, 운영/온보딩)

## 후속 구현 시 검증 기준(초안)
- API 호출에서 `undefined` 데이터가 발생하지 않음
- 사용자 생성/수정 시 해싱 로직이 단일 경로로만 수행
- DB 예외 발생 시 롤백이 일관적으로 적용
- 프론트에서 에러 처리 UX가 데스크톱 기준으로 일관되게 동작
