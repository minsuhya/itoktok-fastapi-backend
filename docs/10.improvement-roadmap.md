# ITokTok 개선 로드맵

> 최종 업데이트: 2026-02-22
> 관련 문서: [분석 보고서](./ANALYSIS_REPORT.md) | [프로젝트 현황](./project-status.md) | [리팩터 계획](./refactor-plan.md)

---

## 개요

이 로드맵은 [분석 보고서](./ANALYSIS_REPORT.md)에서 식별된 11개 이슈와 [리팩터 계획](./refactor-plan.md)의 6개 Phase를 통합하여, 우선순위와 의존 관계를 고려한 단계적 개선 계획을 제시합니다.

### 원칙

1. **안정성 우선**: 신규 기능보다 기존 기능의 안정화를 우선
2. **점진적 적용**: 한 번에 대규모 변경보다 작은 단위로 검증하며 진행
3. **의존성 순서**: 하위 인프라(DB, 인증)를 먼저 정비하고 상위 레이어로 진행
4. **모바일 제외**: 모바일은 신규 구축 중이므로 이 로드맵에서는 웹+백엔드에 집중

---

## Phase 0: 기반 정비 (1주)

> **목표**: 이후 작업의 안전망을 마련한다.

| # | 작업 | 심각도 | 노력 | 산출물 |
|---|------|--------|------|--------|
| 0-1 | .env 파일 Git 제외 | Medium | 낮음 | `.gitignore` 업데이트, `.env.example` 작성 |
| 0-2 | API 경로 중복 버그 수정 | Medium | 낮음 | 4개 라우터 경로 수정 |
| 0-3 | CORS 정책 강화 | Medium | 낮음 | `allow_origins` 화이트리스트 |
| 0-4 | 미사용 파일 정리 | Low | 낮음 | 템플릿 잔재, .bak 파일 삭제 |

### 작업 상세

**0-1: .env 보안 처리**
```bash
# .gitignore에 추가
.env
.env.*
!.env.example

# 각 레이어에 .env.example 생성 (민감 값은 플레이스홀더)
```

**0-2: API 경로 중복 수정**
- `backend/app/api/record.py`: `/records/records/` → `/`
- `backend/app/api/voucher.py`: `/vouchers/vouchers/` → `/`
- `backend/app/api/announcement.py`: `/announcements/announcements/` → `/`
- `backend/app/api/inquiry.py`: `/inquiries/inquiries/` → `/`

**0-3: CORS 화이트리스트**
```python
# backend/app/core/app.py
allow_origins = [
    "http://localhost:5173",
    "http://www.itoktok.com",
    "https://www.itoktok.com",
]
```

**0-4: 미사용 파일 삭제 목록**
- `frontend/src/components/HelloWorld.vue`
- `frontend/src/components/TheWelcome.vue`
- `frontend/src/components/icons/*.vue` (5개)
- `frontend/src/stores/counter.js`
- `frontend/src/views/MonthlyView.bak.vue`

### 검증
- [ ] `.env` 파일이 git status에 나타나지 않음
- [ ] 4개 API 경로가 정상 동작 (`/records/`, `/vouchers/` 등)
- [ ] 프론트에서 CORS 에러 없이 API 호출 성공
- [ ] 삭제된 파일 참조가 코드에 남아있지 않음

---

## Phase 1: 인증/권한 일관화 (2주)

> **목표**: 모든 보호된 API에 인증/권한 체크를 일관 적용한다.
> **참조**: [refactor-plan.md Phase 1](./refactor-plan.md#phase-1-권한인증-일관화-backend)

| # | 작업 | 심각도 | 노력 | 산출물 |
|---|------|--------|------|--------|
| 1-1 | 인증 누락 엔드포인트에 `get_current_user` 적용 | High | 중간 | 모든 API에 인증 의존성 |
| 1-2 | 비밀번호 해싱 단일화 | High | 낮음 | CRUD 계층 한 곳으로 통합 |
| 1-3 | 역할별 데이터 접근 필터 보강 | High | 중간 | CRUD 레벨 role 필터 |
| 1-4 | 권한 매트릭스 문서화 | - | 낮음 | 역할 × API 접근 표 |

### 의존 관계
```
[0-2 API 경로 수정] → [1-1 인증 적용] → [1-3 역할 필터]
                                        ↗
                   [1-2 해싱 통합] ─────┘
```

### 검증
- [ ] 인증 없이 보호된 API 호출 시 401 반환
- [ ] 센터장이 타 센터 데이터 접근 불가
- [ ] 선생님이 타인의 일정/고객 접근 불가
- [ ] 비밀번호 해싱 경로가 하나만 존재

---

## Phase 2: 예외/트랜잭션 표준화 + 응답 규약 통일 (2주)

> **목표**: DB 트랜잭션 안전성을 확보하고 API 응답 구조를 일관화한다.
> **참조**: [refactor-plan.md Phase 2](./refactor-plan.md#phase-2-응답-스키마프론트-정합성)

| # | 작업 | 심각도 | 노력 | 산출물 |
|---|------|--------|------|--------|
| 2-1 | 공통 트랜잭션 헬퍼 작성 | High | 중간 | 트랜잭션 데코레이터/컨텍스트 매니저 |
| 2-2 | 기존 CRUD에 트랜잭션 패턴 적용 | High | 중간 | 예외 시 자동 롤백 |
| 2-3 | API 응답 규약 통일 | High | 낮음 | 인터셉터/API 모듈 정리 |
| 2-4 | Deprecated API 전환 | Medium | 중간 | lifespan, model_dump() |

### 작업 상세

**2-1: 트랜잭션 헬퍼 패턴**
```python
# backend/app/core/transaction.py
from contextlib import contextmanager

@contextmanager
def transaction(session):
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
```

**2-3: 응답 규약**
- axios 인터셉터: `response.data` 반환 (유지)
- API 모듈: `unwrapResponseData` 패턴 통일 (일부 완료)
- 뷰 레이어: `response.data` 직접 접근 금지

**2-4: Deprecated 전환**
- `@app.on_event("startup")` → `lifespan` context manager
- `.dict()` → `.model_dump()`
- `.from_orm()` → `.model_validate()`

### 검증
- [ ] DB 예외 발생 시 롤백 확인 (의도적 에러 주입)
- [ ] 프론트에서 `undefined` 데이터 발생 없음
- [ ] 서버 시작/종료가 lifespan으로 정상 동작

---

## Phase 3: 테스트 기반 확립 (3주)

> **목표**: 핵심 비즈니스 로직에 대한 최소 테스트 커버리지를 확보한다.

| # | 작업 | 심각도 | 노력 | 산출물 |
|---|------|--------|------|--------|
| 3-1 | 테스트 인프라 설정 | High | 낮음 | conftest.py, 테스트 DB 설정 |
| 3-2 | 인증 플로우 테스트 | High | 중간 | 로그인/토큰 검증/권한 테스트 |
| 3-3 | 핵심 CRUD 테스트 | High | 높음 | 사용자/내담자/일정/프로그램 |
| 3-4 | 프론트 스모크 테스트 | - | 중간 | 주요 화면 렌더링 확인 |

### 최소 테스트 목록 (우선순위순)

```
1. 인증
   ├── 로그인 성공/실패
   ├── 토큰 만료 처리
   └── 권한별 접근 제어

2. 사용자 CRUD
   ├── 생성 (비밀번호 해싱 확인)
   ├── 조회 (역할별 필터)
   └── 수정/삭제

3. 일정 CRUD
   ├── 생성 (필수 필드 검증)
   ├── 조회 (날짜 범위, 상담사별)
   └── 수정/삭제 (404 처리)

4. 내담자/프로그램 CRUD
   └── 기본 CRUD 동작 검증
```

### 검증
- [ ] `poetry run pytest tests` 전체 통과
- [ ] 인증 관련 테스트 최소 5개
- [ ] 각 핵심 도메인 CRUD 테스트 최소 3개씩

---

## Phase 4: DB 마이그레이션 도입 (1주)

> **목표**: Alembic을 도입하여 스키마 변경을 안전하게 관리한다.

| # | 작업 | 심각도 | 노력 | 산출물 |
|---|------|--------|------|--------|
| 4-1 | Alembic 초기 설정 | High | 낮음 | `alembic.ini`, `migrations/` |
| 4-2 | 현재 스키마 기준 초기 마이그레이션 생성 | High | 낮음 | 초기 revision 파일 |
| 4-3 | `create_all()` 제거 및 마이그레이션으로 전환 | High | 중간 | startup 로직 변경 |
| 4-4 | 마이그레이션 워크플로 문서화 | - | 낮음 | 가이드 문서 |

### 작업 상세
```bash
# Alembic 설치 및 초기화
poetry add alembic
alembic init migrations

# 초기 마이그레이션 생성
alembic revision --autogenerate -m "initial schema"

# 적용
alembic upgrade head
```

### 검증
- [ ] `alembic upgrade head` 성공
- [ ] `alembic downgrade -1` 후 `upgrade head` 재적용 성공
- [ ] `create_all()` 코드 제거 확인
- [ ] 새 모델 필드 추가 시 마이그레이션 생성 확인

---

## Phase 5: 웹 프론트엔드 정비 (2주)

> **목표**: 라우팅/메뉴 불일치 해소, 검색/필터 공통화, 폼 정합성 개선
> **참조**: [refactor-plan.md Phase 3~5](./refactor-plan.md)

| # | 작업 | 노력 | 산출물 |
|---|------|------|--------|
| 5-1 | 라우팅/메뉴 불일치 정리 | 낮음 | 미사용 라우트 제거, 가드 추가 |
| 5-2 | 폼 필드/스키마 정합성 정리 | 중간 | 필드명 표준화, 유효성 검증 동기화 |
| 5-3 | 검색/필터 공통 컴포넌트 | 중간 | 재사용 가능한 검색 컴포넌트 |
| 5-4 | 일정 도메인 모듈화 | 중간 | 캘린더 유틸, 일정 API 호출 가이드 |

### 검증
- [ ] 메뉴에 없는 화면이 라우터에도 없음 (또는 가드 적용)
- [ ] 폼 입력 → API 전송 → DB 저장 시 필드명 불일치 없음
- [ ] 검색 컴포넌트가 3개 이상 목록에서 재사용됨
- [ ] `pnpm lint` 통과

---

## Phase 6: DevOps / 운영 안정화 (2주)

> **목표**: CI/CD 파이프라인 구축 및 운영 환경 안정화

| # | 작업 | 노력 | 산출물 |
|---|------|------|--------|
| 6-1 | GitHub Actions CI 구성 | 중간 | 자동 테스트 + 린트 |
| 6-2 | Docker 빌드 최적화 | 낮음 | 멀티스테이지 빌드, 캐시 |
| 6-3 | 기본 모니터링/로깅 | 중간 | 구조화 로그, 헬스체크 |
| 6-4 | 배포 파이프라인 (선택) | 높음 | 스테이징/프로덕션 분리 |

### CI 파이프라인 예시
```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: '3.11' }
      - run: pip install poetry && poetry install --no-root
        working-directory: backend
      - run: poetry run pytest tests
        working-directory: backend

  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install && pnpm lint && pnpm build
        working-directory: frontend
```

### 검증
- [ ] PR 생성 시 자동으로 테스트/린트 실행
- [ ] Docker 빌드 시간 50% 이하로 단축
- [ ] 서버 헬스체크 엔드포인트 응답 확인

---

## 타임라인 요약

```
Phase 0 ████ (1주)
Phase 1 ████████ (2주)
Phase 2 ████████ (2주)
Phase 3 ████████████ (3주)
Phase 4 ████ (1주)
Phase 5 ████████ (2주)
Phase 6 ████████ (2주)
        ─────────────────────────
총 예상: 약 13주 (3개월)
```

### Phase 의존 관계

```
Phase 0 (기반 정비)
    │
    ├── Phase 1 (인증/권한)
    │       │
    │       └── Phase 2 (예외/응답)
    │               │
    │               └── Phase 3 (테스트)
    │                       │
    │                       └── Phase 4 (마이그레이션)
    │
    └── Phase 5 (프론트 정비) ─── [Phase 2 완료 후]
                                    │
                                    └── Phase 6 (DevOps) ─── [Phase 3 완료 후]
```

---

## 우선순위 판단 기준

| 순위 | Phase | 이유 |
|------|-------|------|
| 1 | Phase 0 | 즉시 수정 가능한 보안/버그 이슈 (ROI 최고) |
| 2 | Phase 1 | 보안 기본기, 이후 모든 작업의 전제 |
| 3 | Phase 2 | 데이터 안정성 확보, 프론트 오류 제거 |
| 4 | Phase 3 | 안전망 확보 후 이후 리팩토링 가속 |
| 5 | Phase 4 | 프로덕션 배포 필수 조건 |
| 6 | Phase 5 | UX 개선, 코드 품질 향상 |
| 7 | Phase 6 | 장기 운영 안정성 |

---

## 리스크 및 대응

| 리스크 | 영향 | 대응 |
|--------|------|------|
| 권한 강화로 기존 기능 접근 오류 | 사용자 불편 | 점진 적용 + 역할별 회귀 테스트 |
| 응답 스키마 통일 시 프론트 런타임 오류 | 서비스 장애 | 어댑터 계층으로 단계적 전환 |
| 운영 DB 대상 변경 시 데이터 불일치 | 데이터 손실 | 작업 전 백업, 변경 로그 기록 |
| Alembic 도입 시 기존 데이터 충돌 | 스키마 불일치 | 초기 마이그레이션을 현재 상태 기준으로 생성 |
| 단일 개발자 리소스 부족 | 일정 지연 | Phase별 독립 실행 가능하도록 설계 |

---

## 성공 기준

- [ ] 보호된 모든 API에 인증/권한 적용
- [ ] 핵심 CRUD 테스트 커버리지 > 50%
- [ ] DB 스키마 변경이 마이그레이션으로 관리됨
- [ ] CI 파이프라인에서 테스트/린트 자동 실행
- [ ] `.env` 파일이 Git에 포함되지 않음
- [ ] CORS가 화이트리스트 기반으로 동작
- [ ] API 응답 규약이 일관되어 프론트 오류 없음

---

*이 로드맵은 현재 프로젝트 상태를 기준으로 작성되었으며, 진행 상황에 따라 조정될 수 있습니다. 각 Phase의 상세 작업은 [refactor-plan.md](./refactor-plan.md)와 함께 참조하세요.*
