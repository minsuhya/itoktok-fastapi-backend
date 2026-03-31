# DB 최적화 설계 문서

**날짜:** 2026-03-31
**프로젝트:** ITokTok
**범위:** 데이터베이스 정리 및 Alembic 마이그레이션 도입
**접근 방식:** 코드 분석 우선 → 스키마 정합성 확인 → Alembic 도입 → 레거시 테이블 처리

---

## 배경

ITokTok 프로젝트는 초기 설계 없이 개발된 후 역공학으로 문서화되었다. 현재 기능은 대부분 완성되었으나 데이터베이스가 정리되지 않은 상태이다:

- 어떤 테이블이 실제로 사용되는지 불명확
- Python SQLModel 코드와 실제 DB 스키마 간 불일치 가능성
- 스키마 변경 추적 체계(Alembic) 미구성
- 레거시 테이블(`CenterDirector`, `Teacher`, `Customer`)에 실제 데이터 존재하나 현행 코드와의 관계 불명확

**환경:** 프로덕션 DB만 존재 (개발/스테이징 환경 없음) → 모든 작업은 신중하게 진행

---

## 설계 목표

1. 코드 기반으로 실제 사용 테이블 확정
2. Python 모델과 DB 스키마 정합성 확보
3. Alembic으로 이후 스키마 변경 안전 관리
4. 레거시 테이블 데이터 안전 처리 후 코드베이스 정리

---

## 단계별 설계

### 단계 1: 테이블 사용 현황 분석

**목적:** 코드를 "진실의 원천"으로 삼아 각 테이블의 실제 사용 여부를 확정한다.

**분석 방법:**

1. **백엔드 CRUD 레이어 분석**
   - `backend/app/crud/` 의 각 파일에서 실제로 쿼리하는 모델 목록화
   - 사용되지 않는 CRUD 파일 식별

2. **API 라우터 분석**
   - `backend/app/api/` 의 각 라우터가 사용하는 CRUD/모델 매핑
   - 등록은 되어 있으나 프론트에서 호출하지 않는 API 식별

3. **프론트엔드 API 호출 분석**
   - `frontend/src/api/` 에서 실제로 호출하는 엔드포인트 목록화
   - 백엔드에 존재하나 프론트에서 미사용 API 목록화

4. **레거시 모델 특별 분석**
   - `CenterDirector` ↔ `User(user_type=1)` 역할 중복 여부
   - `Teacher` ↔ `User(user_type=default)` 역할 중복 여부
   - `Customer` ↔ `ClientInfo` 데이터 중복 여부

**산출물:**

| 테이블 | CRUD 사용 | API 존재 | 프론트 호출 | 상태 |
|--------|-----------|----------|-------------|------|
| user | ✅ | ✅ | ✅ | 사용중 |
| center_info | ✅ | ✅ | ✅ | 사용중 |
| client_info | ✅ | ✅ | ✅ | 사용중 |
| schedule | ✅ | ✅ | ✅ | 사용중 |
| schedule_list | ✅ | ✅ | ✅ | 사용중 |
| program | ✅ | ✅ | ✅ | 사용중 |
| record | ✅ | ✅ | ❌ | 부분사용 |
| voucher | ✅ | ✅ | ❌ | 부분사용 |
| announcement | ✅ | ✅ | ❌ | 부분사용 |
| inquiry | ✅ | ✅ | ❌ | 부분사용 |
| center_director | ❓ | ❌ | ❌ | 레거시 |
| teacher | ❓ | ❌ | ❌ | 레거시 |
| customer | ❓ | ❌ | ❌ | 레거시 |

*위 표는 초기 추정이며, 분석 후 정확한 상태로 업데이트된다.*

---

### 단계 2: 스키마 정합성 확인

**목적:** Python SQLModel 정의와 실제 DB 스키마가 일치하는지 확인한다.

**방법:**

1. Python 모델 코드에서 기대 스키마 추출 (테이블명, 컬럼명, 타입, FK, 인덱스)
2. `database/itoktok-20260330-schema.sql` 에서 실제 스키마 추출
3. 차이점 목록화 및 위험도 분류

**차이점 분류:**

| 유형 | 설명 | 위험도 | 처리 |
|------|------|--------|------|
| 코드에만 있는 컬럼 | DB에 없음 → 런타임 오류 가능 | 높음 | 즉시 migration 추가 |
| DB에만 있는 컬럼 | 코드에 없음 → 데이터 유실 가능 | 높음 | 모델에 추가 또는 삭제 |
| 타입 불일치 | 데이터 변환 오류 가능 | 중간 | migration으로 수정 |
| 인덱스 누락 | 성능 저하 | 낮음 | migration으로 추가 |

**제약:** 프로덕션 DB에 직접 접근하지 않고 SQL 덤프 파일 기반으로만 분석한다.

---

### 단계 3: Alembic 도입

**목적:** 이후 모든 스키마 변경을 코드로 추적하고 안전하게 적용/롤백할 수 있는 체계를 구축한다.

**디렉토리 구조:**
```
backend/
├── alembic/
│   ├── env.py           # DB 연결 설정 (CONN_URL 환경변수 사용)
│   ├── script.py.mako   # migration 파일 템플릿
│   ├── versions/        # migration 파일들 (버전 관리)
│   └── README
├── alembic.ini          # Alembic 설정
└── app/
    └── models/          # SQLModel 모델 (변경 없음)
```

**초기화 절차:**
```bash
cd backend
poetry add alembic
alembic init alembic

# env.py에 SQLModel 메타데이터 연결
# alembic.ini에 CONN_URL 설정

# 현재 상태를 베이스라인으로 설정 (DB는 이미 존재)
alembic revision --autogenerate -m "baseline"
alembic stamp head  # --fake 적용: DB 변경 없이 현재 버전으로 마킹
```

**이후 운영 워크플로우:**
```bash
# 모델 변경 후
alembic revision --autogenerate -m "변경 설명"
# 생성된 파일 검토 (반드시 수동 확인)
alembic upgrade head  # 프로덕션 적용
# 문제 발생 시
alembic downgrade -1  # 롤백
```

**주의사항:**
- 첫 migration은 `stamp head`로 적용 (DB는 이미 존재하므로 실제 실행 불필요)
- 레거시 테이블 삭제는 별도 migration으로 분리
- autogenerate 결과는 반드시 수동 검토 후 적용

---

### 단계 4: 레거시 테이블 처리

**목적:** `CenterDirector`, `Teacher`, `Customer` 테이블의 데이터를 안전하게 처리하고 코드베이스를 정리한다.

#### 4-1. 데이터 매핑 검증

| 레거시 테이블 | 현행 테이블 | 검증 항목 |
|--------------|------------|----------|
| `center_director` | `user` (user_type=1) | 모든 레코드가 `user`에 존재하는지 |
| `teacher` | `user` (user_type=default) | 모든 레코드가 `user`에 존재하는지 |
| `customer` | `client_info` | 모든 레코드가 `client_info`에 존재하는지 |

검증 SQL 예시:
```sql
-- CenterDirector → User 매핑 확인
SELECT cd.username
FROM center_director cd
LEFT JOIN user u ON cd.username = u.username
WHERE u.username IS NULL;
-- 결과가 0건이면 완전 중복 → 삭제 가능
```

#### 4-2. 데이터 마이그레이션 (필요시)

- 레거시 테이블에만 존재하는 데이터 → `user` / `client_info`로 이전
- 중복 데이터는 이전 없이 테이블만 삭제

#### 4-3. 코드 정리

제거 대상:
- `backend/app/models/` 의 레거시 모델 클래스
- `backend/app/crud/customer.py` 등 미사용 CRUD 파일
- `backend/app/api/customer.py` 등 미사용 라우터
- `backend/app/main.py` 에서 미사용 라우터 등록 해제

#### 4-4. 안전한 테이블 삭제 절차

```
1. DB 백업 (필수)
2. 레거시 테이블을 _deprecated suffix로 rename
   예: teacher → teacher_deprecated_20260331
3. 1~2주 운영 관찰 (문제 없으면 계속)
4. Alembic migration으로 테이블 최종 삭제
   alembic revision -m "remove legacy tables"
```

**안전장치:**
- 삭제 전 반드시 DB 전체 백업
- 즉시 삭제 금지 — rename 후 관찰 기간 필수
- 코드 삭제와 DB 삭제는 별도 PR로 분리

---

## 전체 실행 순서

```
[분석]
1. 코드 기반 테이블 사용 현황 분석 스크립트 작성
2. 스키마 불일치 보고서 생성

[Alembic 도입]
3. alembic 패키지 추가 및 초기화
4. env.py 설정 (SQLModel 메타데이터 연결)
5. baseline migration 생성 및 stamp head

[레거시 처리]
6. 레거시 테이블 데이터 매핑 검증 SQL 실행
7. 필요시 데이터 이전 스크립트 작성 및 실행
8. 코드에서 레거시 모델/CRUD/라우터 제거
9. 레거시 테이블 rename (_deprecated)
10. 운영 관찰 후 최종 삭제 migration 적용
```

---

## 위험 관리

| 위험 | 가능성 | 영향도 | 대응 |
|------|--------|--------|------|
| 레거시 테이블 삭제 후 연계 오류 | 중간 | 높음 | rename 후 관찰 기간 |
| 스키마 불일치로 인한 런타임 오류 | 중간 | 높음 | 단계 2에서 사전 확인 |
| Alembic autogenerate 오탐 | 높음 | 중간 | 수동 검토 필수 |
| 프로덕션 적용 중 다운타임 | 낮음 | 높음 | 점진적 migration 설계 |

---

## 성공 기준

- [ ] 모든 테이블의 사용 여부가 코드 근거로 명확히 분류됨
- [ ] Python 모델과 DB 스키마 불일치 0건
- [ ] Alembic이 설정되어 `alembic upgrade head` 정상 동작
- [ ] 레거시 테이블이 코드베이스에서 제거됨
- [ ] 프로덕션 데이터 손실 0건
