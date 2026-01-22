# ITokTok 프로젝트 기능 지도 (Feature Map)

> 작성일: 2026-01-23
> 버전: 1.1.0
> 목적: 코드베이스 전체의 기능 구조, 메뉴 트리, API 연동, 컴포넌트 종속성을 파악하여 개발/리팩토링 기준으로 활용
> 범위: **웹+백엔드** (모바일은 Expo로 신규 구축 예정, 현 코드베이스 제외)
> 출처: `frontend/src/router/*`, `frontend/src/components/*`, `frontend/src/views/*`, `backend/app/api/*`, `backend/app/crud/*`

---

## 목차
1. [계층적 메뉴 구조 (Full Menu Map)](#1-계층적-메뉴-구조-full-menu-map)
2. [기능 매트릭스 (Feature Matrix)](#2-기능-매트릭스-feature-matrix)
3. [종속성 그래프 (Dependency Graph)](#3-종속성-그래프-dependency-graph)
4. [Gap Analysis](#4-gap-analysis)
5. [데이터 흐름 (Data Flow)](#5-데이터-흐름-data-flow)
6. [권한 체계](#6-권한-체계)
7. [파급 범위 분석 (Blast Radius)](#7-파급-범위-분석-blast-radius)
8. [부록: API 엔드포인트 목록](#appendix-a-api-엔드포인트-목록)

---

## 1. 계층적 메뉴 구조 (Full Menu Map)

### 1.1 Public (비인증)
- **`/` → `/login`** - 로그인
  - 컴포넌트: `LoginView.vue`
  - API: `POST /auth/login`
- **`/forgot-password`** - 비밀번호 찾기
  - 컴포넌트: `ForgotPassword.vue`
- **`/signup`** - 회원가입(센터장 등록)
  - 컴포넌트: `SignupView2.vue`
  - API: `POST /signup`, `POST /center/info`
- **`/redirect/:path`** - 리다이렉트 처리
- **`/:pathMatch(.*)*`** - 404

### 1.2 Admin/Desktop (인증)

#### GNB(HeaderView)
- **`/admin/myinfo`** - 내정보
- 로그아웃 - `logoutApp → /login`

#### Sidebar(LeftView)
- 프로그램 관리
  - **`/admin/program`** - 프로그램 목록
- 사용자
  - **`/admin/client`** - 내담자 관리
  - **`/admin/counselor`** - 상담사 관리
- 일정관리
  - **`/admin/monthly`** - 월간 일정
  - **`/admin/weekly`** - 주간 일정

#### Admin Routes (메뉴 외 포함)
- **`/admin`** - 대시보드(월간 일정)
- **`/admin/home`** - 홈 (메뉴 미노출)
- **`/admin/about`** - 소개 (메뉴 미노출)

---

## 2. 기능 매트릭스 (Feature Matrix)

### 2.1 인증 및 사용자 관리

| 메뉴/기능 | 경로 | 컴포넌트 | CRUD | API 엔드포인트 | 비고 |
|----------|------|---------|------|---------------|------|
| 로그인 | `/login` | `LoginView.vue` | R | `POST /auth/login` | JWT 토큰 발급 |
| 회원가입 | `/signup` | `SignupView2.vue` | C | `POST /signup`, `POST /center/info` | 센터장 등록 |
| 비밀번호 찾기 | `/forgot-password` | `ForgotPassword.vue` | R | (미구현) | |
| 내정보 | `/admin/myinfo` | `MyPageView.vue` | RU | `GET /users/{id}`, `PUT /users/{id}` | 사용자 정보 수정 |
| 센터 정보 | `/admin/myinfo` | `MyPageView.vue` | RU | `GET /center/info/{username}`, `PUT /center/info/{username}` | 센터 정보 수정 |
| 상담사 목록 | `/admin/counselor` | `UserList.vue` | R | `GET /users/` | 검색/페이지네이션 |
| 상담사 등록 | 슬라이딩 폼 | `UserFormSliding.vue` | C | `POST /users/` | |
| 상담사 수정 | 슬라이딩 폼 | `UserFormSliding.vue` | U | `PUT /users/{user_id}` | |
| 상담사 삭제 | `/admin/counselor` | `UserList.vue` | D | `DELETE /users/{user_id}` | |
| 선생님 목록 | 사이드바 | `TeacherList.vue` | R | `GET /users/teachers` | 일정 필터 |
| 선택 선생님 저장 | 사이드바 | `TeacherList.vue` | CU | `POST /users/selected-teachers`, `PUT /users/selected-teachers` | localStorage + 서버 동기화 |

### 2.2 일정 관리

| 메뉴/기능 | 경로 | 컴포넌트 | CRUD | API 엔드포인트 | 비고 |
|----------|------|---------|------|---------------|------|
| 월간 일정 | `/admin`, `/admin/monthly` | `MonthlyView.vue` | R | `GET /schedules/calendar/{year}/{month}` | 선생님 필터 적용 |
| 주간 일정 | `/admin/weekly` | `WeeklyView.vue` | R | `GET /schedules/calendar/{year}/{month}/{day}` | 타임테이블 뷰 |
| 일일 일정 | 슬라이딩 패널 | `DailyViewSliding.vue` | R | `GET /schedules/calendar/daily/{year}/{month}/{day}` | |
| 일정 등록 | 슬라이딩 폼 | `ScheduleFormSliding.vue` | C | `POST /schedules` | 반복 일정 |
| 일정 수정 | 슬라이딩 폼 | `ScheduleFormSliding.vue` | U | `PUT /schedules/{scheduleId}/{scheduleListId}` | 단일/모든 반복 |
| 일정 삭제 | 슬라이딩 폼 | `ScheduleFormSliding.vue` | D | `DELETE /schedules/{scheduleId}/{scheduleListId}` | 단일/모든 반복 |
| 일정 드래그(날짜) | 월간 | `MonthlyView.vue` | U | `PUT /schedules/update-date` | |
| 일정 드래그(날짜+시간) | 주간 | `WeeklyView.vue` | U | `PUT /schedules/update-date-time` | |

### 2.3 내담자 관리

| 메뉴/기능 | 경로 | 컴포넌트 | CRUD | API 엔드포인트 | 비고 |
|----------|------|---------|------|---------------|------|
| 내담자 목록 | `/admin/client` | `ClientList.vue` | R | `GET /client/` | 검색/페이지네이션 |
| 내담자 등록 | 슬라이딩 폼 | `ClientFormSliding.vue` | C | `POST /client/` | registered_by 자동 설정 |
| 내담자 수정 | 슬라이딩 폼 | `ClientFormSliding.vue` | U | `PUT /client/{clientId}` | |
| 내담자 삭제 | `/admin/client` | `ClientList.vue` | D | `DELETE /client/{consultant}` | |
| 상담상태 변경 | `/admin/client` | `ClientList.vue` | U | `PUT /client/{clientId}/consultant_status/{status}` | |
| 내담자 검색 | `/admin/client` | `ClientList.vue` | R | `GET /client/search/` | |

### 2.4 프로그램 관리

| 메뉴/기능 | 경로 | 컴포넌트 | CRUD | API 엔드포인트 | 비고 |
|----------|------|---------|------|---------------|------|
| 프로그램 목록 | `/admin/program` | `ProgramView.vue` | R | `GET /programs` | 검색/필터 |
| 프로그램 등록 | 슬라이딩 폼 | `ProgramFormSliding.vue` | C | `POST /programs` | center_username 자동 설정 |
| 프로그램 수정 | 슬라이딩 폼 | `ProgramFormSliding.vue` | U | `PUT /programs/{programId}` | |
| 프로그램 삭제 | `/admin/program` | `ProgramView.vue` | D | `DELETE /programs/{programId}` | |

### 2.5 센터 관리

| 메뉴/기능 | 경로 | 컴포넌트 | CRUD | API 엔드포인트 | 비고 |
|----------|------|---------|------|---------------|------|
| 센터 정보 등록 | `/signup` | `SignupView2.vue` | C | `POST /center/info` | 회원가입 시 |
| 센터 정보 조회 | `/admin/myinfo` | `MyPageView.vue` | R | `GET /center/info/{username}` | |
| 센터 정보 수정 | `/admin/myinfo` | `MyPageView.vue` | U | `PUT /center/info/{username}` | |

### 2.6 기타 (미구현 또는 부분 구현)

| 메뉴/기능 | 경로 | 컴포넌트 | CRUD | API 엔드포인트 | 비고 |
|----------|------|---------|------|---------------|------|
| 공지사항 | (미정) | (미정) | CRUD | `/announcements/announcements/` | **경로 중복 버그** |
| 문의사항 | (미정) | (미정) | CRUD | `/inquiries/inquiries/` | **경로 중복 버그** |
| 바우처 | (미정) | (미정) | CRUD | `/vouchers/vouchers/` | **경로 중복 버그** |
| 상담 기록 | (미정) | (미정) | CRUD | `/records/records/` | **경로 중복 버그** |

---

## 3. 종속성 그래프 (Dependency Graph)

### 3.1 컴포넌트 계층 구조

```
App.vue
├─ GlobalModal
├─ RouterView
│   ├─ LayoutView (requiresAuth: true)
│   │   ├─ HeaderView
│   │   ├─ LeftView
│   │   │   ├─ CalendarView
│   │   │   └─ TeacherList
│   │   ├─ FooterView
│   │   └─ RouterView
│   │       ├─ MonthlyView
│   │       │   ├─ ScheduleFormSliding
│   │       │   └─ DailyViewSliding
│   │       ├─ WeeklyView
│   │       │   └─ ScheduleFormSliding
│   │       ├─ ClientList
│   │       │   ├─ ClientFormSliding
│   │       │   └─ PaginationView
│   │       ├─ UserList
│   │       │   ├─ UserFormSliding
│   │       │   └─ PaginationView
│   │       ├─ ProgramView
│   │       │   ├─ ProgramFormSliding
│   │       │   └─ PaginationView
│   │       └─ MyPageView
│   └─ [공통 페이지]
│       ├─ LoginView
│       ├─ SignupView2
│       ├─ ForgotPassword
│       └─ NotFound
```

### 3.2 Pinia Store 종속성

```
userStore (auth.js)
├─ 사용처: 거의 모든 컴포넌트
├─ 기능: 사용자 인증 정보, 역할 관리
├─ 영속화: localStorage
└─ 연관 API: POST /auth/login, GET /users/me

calendarStore (calendarStore.js)
├─ 사용처: CalendarView, MonthlyView, WeeklyView, DailyViewSliding
├─ 기능: 선택된 날짜 관리
└─ 연관: 일정 조회 API의 날짜 파라미터

teacherStore (teacherStore.js)
├─ 사용처: TeacherList, MonthlyView, WeeklyView
├─ 기능: 선택된 선생님 필터링
├─ 영속화: localStorage
└─ 연관 API: GET /schedules/calendar/*, GET/POST/PUT /users/selected-teachers
```

### 3.3 API 레이어 종속성

```
interceptors.js (axios 인터셉터)
├─ 요청: Authorization 헤더 자동 추가 (JWT 토큰)
├─ 응답: response.data 자동 추출
└─ 오류: 401 자동 로그아웃 + 리다이렉트

user.js
├─ readMe, readUsers, readTeachers
├─ registerUser, updateUser, deleteUser
└─ getSelectedTeachers, updateSelectedTeachers

client.js
├─ registerClientInfo, readClientInfo, readClientInfos
├─ searchClientInfos, updateClientInfo
└─ updateClientConsultantStatus, deleteClientInfo

program.js
├─ createProgram, readProgram, readPrograms
└─ updateProgram, deleteProgram

schedule.js
├─ createSchedule, readSchedule, readSchedules
├─ updateSchedule, deleteSchedule, deleteScheduleList
├─ getMonthlyCalendar, getWeeklyCalendar, getDailyCalendar
└─ updateScheduleDate, updateScheduleDateTime

center.js
├─ registerCenterInfo, readCenterInfo, readCenterInfos
└─ updateCenterInfo, deleteCenterInfo
```

### 3.4 Hooks 및 Composables

```
useAuth (hooks/auth.js)
├─ loginApp: 로그인 → 토큰 저장 → 사용자 정보 조회 → userStore 업데이트
└─ logoutApp: 로그아웃 → 토큰 삭제 → userStore 초기화

useModal (composables/useModal.js)
├─ showModal(message)
└─ hideModal()

useGlobalNavigation (composables/useGlobalNavigation.js)
└─ navigateTo(route, replace)
```

---

## 4. Gap Analysis

### 4.1 백엔드 API 경로 중복 버그 (높은 우선순위)

**문제**: 라우터 prefix가 엔드포인트 데코레이터에 중복 적용됨

| 파일 | 의도된 경로 | 실제 경로 | 상태 |
|------|-----------|----------|------|
| `record.py` | `/records/` | `/records/records/` | ❌ 버그 |
| `voucher.py` | `/vouchers/` | `/vouchers/vouchers/` | ❌ 버그 |
| `announcement.py` | `/announcements/` | `/announcements/announcements/` | ❌ 버그 |
| `inquiry.py` | `/inquiries/` | `/inquiries/inquiries/` | ❌ 버그 |

**해결 방법**:
```python
@router.post("/")
```

### 4.2 인증 정책 불일치 (중간 우선순위)

**문제**: 민감한 데이터를 다루는 일부 엔드포인트가 인증 없이 접근 가능

| API 라우터 | 현재 인증 | 권장 인증 | 비고 |
|-----------|---------|---------|------|
| `/center` | 공개 | JWT 필요 | 센터 정보 보호 필요 |
| `/teachers` | 일부만 JWT | JWT 필요 | |
| `/schedules` | 공개 | JWT 필요 | |
| `/records` | 공개 | JWT 필요 | |
| `/vouchers` | 공개 | JWT 필요 | |

### 4.3 권한 검증 로직 불일치 (중간 우선순위)

| API | 권한 검증 여부 | 비고 |
|-----|-------------|------|
| `/programs` | ✅ 구현 | 센터/권한 기준 검증 |
| `/client` | ✅ 부분 구현 | 등록 시 center_username 설정 |
| `/schedules` | ❌ 미구현 | 센터별 데이터 격리 필요 |
| `/users` | ❌ 미구현 | 센터별 사용자 관리 필요 |

### 4.4 미구현 기능 (낮은 우선순위)

| 기능 | 프론트엔드 | 백엔드 API | 비고 |
|-----|---------|----------|------|
| 상담 기록 관리 | ❌ 미구현 | ✅ 구현 | UI 연동 필요 |
| 바우처 관리 | ❌ 미구현 | ✅ 구현 | UI 구현 필요 |
| 공지사항 | ❌ 미구현 | ✅ 구현 | UI 구현 필요 |
| 문의사항 | ❌ 미구현 | ✅ 구현 | UI 구현 필요 |

### 4.5 테스트 커버리지 (낮은 우선순위)

| 영역 | 테스트 존재 여부 | 커버리지 | 비고 |
|-----|-------------|---------|------|
| 백엔드 API | ✅ 존재 | 낮음 | `backend/tests/` |
| 프론트엔드 컴포넌트 | ❌ 없음 | 0% | 테스트 필요 |
| Pinia Store | ❌ 없음 | 0% | 테스트 필요 |
| API 레이어 | ❌ 없음 | 0% | 테스트 필요 |

---

## 5. 데이터 흐름 (Data Flow)

### 5.1 인증 흐름

```
[사용자 로그인]
  ↓
LoginView.vue (useAuth().loginApp)
  ↓
POST /auth/login
  ← JWT 토큰 반환
  ↓
localStorage에 토큰 저장 (VITE_TOKEN_KEY)
  ↓
GET /users/me (Authorization: Bearer {token})
  ← 사용자 정보 반환
  ↓
userStore.setUserInfo()
  ↓
라우터 리다이렉트 (/admin)
```

### 5.2 일정 조회 흐름 (선생님 필터)

```
[앱 시작]
  ↓
TeacherList.vue 마운트
  ↓
GET /users/teachers
GET /users/selected-teachers
  ↓
teacherStore.setSelectedTeachers()
  ↓
MonthlyView/WeeklyView watch
  ↓
GET /schedules/calendar/*?selected_teachers=...
  ↓
달력 표시
```

### 5.3 일정 드래그 앤 드롭 흐름

```
MonthlyView.vue drag/drop
  ↓
PUT /schedules/update-date
  ↓
달력 재조회
```

### 5.4 내담자 등록 흐름

```
ClientFormSliding 제출
  ↓
POST /client/
  ↓
ClientList 재조회
```

---

## 6. 권한 체계

### 6.1 사용자 역할

| 역할 | is_superuser | user_type | 설명 |
|------|-------------|-----------|------|
| **최고관리자** | 1 | - | 시스템 전체 관리 |
| **센터장** | 0 | 1 | 센터 관리 |
| **선생님** | 0 | 0 (기본값) | 담당 내담자 및 일정 |

### 6.2 역할별 접근 권한

| 기능 | 최고관리자 | 센터장 | 선생님 |
|-----|----------|-------|-------|
| 센터 전체 조회 | ✅ | ❌ | ❌ |
| 센터 내 사용자 관리 | ✅ | ✅ | ❌ |
| 센터 내 내담자 조회 | ✅ | ✅ | ❌ |
| 담당 내담자 조회 | ✅ | ✅ | ✅ |
| 센터 내 일정 조회 | ✅ | ✅ | ❌ |
| 본인 일정 관리 | ✅ | ✅ | ✅ |
| 프로그램 관리 | ✅ | ✅ | ❌ |

---

## 7. 파급 범위 분석 (Blast Radius)

### 7.1 공통 컴포넌트 수정 시 영향 범위

| 컴포넌트 | 영향 받는 페이지 | 위험도 |
|---------|-------------|--------|
| **interceptors.js** | 모든 페이지 | 🔴 매우 높음 |
| **userStore (auth.js)** | 모든 페이지 | 🔴 매우 높음 |
| **calendarStore** | Monthly/Weekly/Daily | 🟠 높음 |
| **teacherStore** | TeacherList, Monthly, Weekly | 🟠 높음 |
| **LayoutView** | 모든 데스크톱 페이지 | 🟠 높음 |

### 7.2 API 엔드포인트 수정 시 영향 범위

| API | 영향 받는 컴포넌트 | 위험도 |
|-----|-------------|--------|
| `POST /auth/login` | LoginView | 🔴 매우 높음 |
| `GET /users/me` | 모든 페이지 | 🔴 매우 높음 |
| `GET /schedules/calendar/*` | Monthly/Weekly/Daily | 🔴 매우 높음 |
| `GET /client/` | ClientList | 🟠 높음 |
| `GET /users/teachers` | TeacherList | 🟠 높음 |
| `GET /programs` | ProgramView, ScheduleFormSliding | 🟡 중간 |

### 7.3 백엔드 모델 수정 시 영향 범위

| 모델 | 영향 API | 영향 프론트 | 위험도 |
|-----|---------|-----------|--------|
| **User** | `/auth/login`, `/users/*` | 모든 페이지 | 🔴 매우 높음 |
| **ClientInfo** | `/client/*` | ClientList/ClientForm | 🟠 높음 |
| **Schedule** | `/schedules/*` | Monthly/Weekly/Daily | 🔴 매우 높음 |
| **Program** | `/programs/*` | ProgramView/ProgramForm | 🟡 중간 |

---

## Appendix A: API 엔드포인트 목록

### 인증
- `POST /auth/login`

### 회원가입
- `POST /signup`
- `GET /signup/check-username`

### 사용자 관리
- `GET /users/me`
- `GET /users/last`
- `GET /users/teachers`
- `GET /users/selected-teachers`
- `POST /users/selected-teachers`
- `PUT /users/selected-teachers`
- `DELETE /users/selected-teachers`
- `GET /users/username/{username}`
- `GET /users/{user_id}`
- `GET /users/`
- `POST /users/`
- `PUT /users/{user_id}`
- `DELETE /users/{user_id}`

### 센터 관리
- `POST /center/register`
- `GET /center/{director_id}`
- `GET /center`
- `PUT /center/{director_id}`
- `DELETE /center/{director_id}`
- `POST /center/info`
- `GET /center/info/{username}`
- `GET /center/info`
- `PUT /center/info/{username}`
- `DELETE /center/info/{username}`

### 내담자 관리
- `POST /client/`
- `GET /client/{info_id}`
- `PUT /client/{info_id}/consultant_status/{consultant_status}`
- `GET /client/consultant/{consultant}`
- `GET /client/`
- `GET /client/search/`
- `PUT /client/{info_id}`
- `DELETE /client/{consultant}`

### 선생님 관리
- `POST /teachers`
- `GET /teachers/{teacher_id}`
- `GET /teachers`
- `PUT /teachers/{teacher_id}`
- `DELETE /teachers/{teacher_id}`

### 프로그램 관리
- `POST /programs/`
- `GET /programs/{program_id}`
- `GET /programs/`
- `PUT /programs/{program_id}`
- `DELETE /programs/{program_id}`
- `GET /programs/my`

### 일정 관리
- `POST /schedules`
- `GET /schedules/{schedule_list_id}`
- `GET /schedules`
- `PUT /schedules/{schedule_id}/{schedule_list_id}`
- `DELETE /schedules/{schedule_id}/{schedule_list_id}`
- `DELETE /schedules/list/{schedule_list_id}`
- `GET /schedules/calendar/{year}/{month}`
- `GET /schedules/calendar/{year}/{month}/{day}`
- `GET /schedules/calendar/daily/{year}/{month}/{day}`
- `PUT /schedules/update-date`
- `PUT /schedules/update-date-time`

### 상담 기록 (⚠️ 경로 중복 버그)
- `POST /records/records/`
- `GET /records/records/{record_id}`
- `GET /records/records/`
- `PUT /records/records/{record_id}`
- `DELETE /records/records/{record_id}`

### 바우처 (⚠️ 경로 중복 버그)
- `POST /vouchers/vouchers/`
- `GET /vouchers/vouchers/{voucher_id}`
- `GET /vouchers/vouchers/`
- `PUT /vouchers/vouchers/{voucher_id}`
- `DELETE /vouchers/vouchers/{voucher_id}`

### 공지사항 (⚠️ 경로 중복 버그)
- `POST /announcements/announcements/`
- `GET /announcements/announcements/{announcement_id}`
- `GET /announcements/announcements/`
- `PUT /announcements/announcements/{announcement_id}`
- `DELETE /announcements/announcements/{announcement_id}`

### 문의사항 (⚠️ 경로 중복 버그)
- `POST /inquiries/inquiries/`
- `GET /inquiries/inquiries/{inquiry_id}`
- `GET /inquiries/inquiries/`
- `PUT /inquiries/inquiries/{inquiry_id}`
- `DELETE /inquiries/inquiries/{inquiry_id}`

### 고객 관리
- `POST /customers/`
- `GET /customers/{customer_id}`
- `GET /customers/`
- `PUT /customers/{customer_id}`
- `DELETE /customers/{customer_id}`
