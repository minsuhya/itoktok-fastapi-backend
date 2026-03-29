# ITokTok 데이터베이스 스키마 명세

> 최종 수정일: 2026-03-30

---

## 1. 데이터베이스 개요

ITokTok은 아동 심리 상담센터 종합 관리 시스템으로, **MySQL/MariaDB**를 주 데이터베이스로 사용합니다.

### 핵심 설계 원칙

| 원칙 | 설명 |
|------|------|
| **Soft Delete** | 모든 핵심 테이블에 `deleted_at` 컬럼 적용, 물리적 삭제 지양 |
| **센터 기반 데이터 격리** | `center_username` FK를 통해 센터별 데이터 완전 분리 |
| **Username 기반 참조** | PK(int) 외에 `username` 문자열 키를 FK로 활용하여 가독성 확보 |
| **감사 추적** | `created_at`, `updated_at`, `deleted_at`, `created_by`, `updated_by` 전반 적용 |

### 데이터베이스 기술 스택

- **DBMS**: MySQL / MariaDB (외부 서버)
- **ORM**: SQLModel (SQLAlchemy 기반)
- **연결 방식**: `CONN_URL` 환경변수 (`mysql+pymysql://user:password@host:port/database`)
- **보조 DB**: MongoDB (선택적, 비정형 데이터용)

---

## 2. ERD 다이어그램

```mermaid
erDiagram
    CenterInfo {
        int id PK
        string username UK
        string center_name
        string center_summary
        string center_introduce
        string center_export
        string center_addr
        string center_tel
        datetime created_at
        datetime updated_at
        datetime deleted_at
    }

    User {
        int id PK
        string username UK
        string password
        string email
        string full_name
        date birth_date
        string hp_number
        string phone_number
        string address
        string zip_code
        string center_username FK
        int user_type
        int is_active
        int is_superuser
        string usercolor
        string expertise
        datetime created_at
        datetime updated_at
        datetime deleted_at
    }

    ClientInfo {
        int id PK
        string consultant FK
        int consultant_status
        string client_name
        string phone_number
        string tags
        string memo
        date birth_date
        string gender
        string email_address
        string address_region
        string address_city
        string family_members
        string consultation_path
        string center_username FK
        string registered_by
        datetime created_at
        datetime updated_at
        datetime deleted_at
    }

    Program {
        int id PK
        string program_name
        string program_type
        string category
        string teacher_username FK
        text description
        int duration
        int max_participants
        decimal price
        bool is_all_teachers
        bool is_active
        string center_username FK
        datetime created_at
        datetime updated_at
        datetime deleted_at
    }

    Schedule {
        int id PK
        int schedule_type
        string teacher_username FK
        int client_id FK
        date start_date
        date finish_date
        string start_time
        string finish_time
        int repeat_type
        string repeat_days
        string created_by
        string updated_by
        datetime created_at
        datetime updated_at
        datetime deleted_at
    }

    ScheduleList {
        int id PK
        string title
        string teacher_username FK
        int client_id FK
        int program_id FK
        date schedule_date
        string schedule_time
        string schedule_finish_time
        int schedule_status
        string schedule_memo
        int schedule_id FK
        string created_by
        string updated_by
        datetime created_at
        datetime updated_at
        datetime deleted_at
    }

    Record {
        int id PK
        int schedule_id FK
        text consultation_content
        text record_content
        text special_notes
        datetime created_at
        datetime updated_at
        datetime deleted_at
    }

    Voucher {
        int id PK
        enum type
        string name
        decimal support_amount
        decimal personal_contribution
        string status
        string social_welfare_service_number
        datetime created_at
        datetime updated_at
        datetime deleted_at
    }

    Announcement {
        int id PK
        string title
        text content
        bool is_important
        enum category
        enum announcement_type
        date end_date
        string attachment_url
        datetime created_at
        datetime updated_at
        datetime deleted_at
    }

    UserSearchSelectedTeacher {
        string username PK FK
        string selected_teacher
        datetime created_at
        datetime updated_at
        datetime deleted_at
    }

    CenterInfo ||--o{ User : "center_username"
    CenterInfo ||--o{ ClientInfo : "center_username"
    CenterInfo ||--o{ Program : "center_username"
    User ||--o{ ClientInfo : "consultant"
    User ||--o{ Program : "teacher_username"
    User ||--o{ Schedule : "teacher_username"
    User ||--o{ ScheduleList : "teacher_username"
    User ||--|| UserSearchSelectedTeacher : "username"
    ClientInfo ||--o{ Schedule : "client_id"
    ClientInfo ||--o{ ScheduleList : "client_id"
    Program ||--o{ ScheduleList : "program_id"
    Schedule ||--o{ ScheduleList : "schedule_id"
    ScheduleList ||--o{ Record : "schedule_id"
```

---

## 3. 테이블별 상세 명세

### 3.1 CenterInfo (센터 정보)

상담센터의 기본 정보를 관리합니다. 시스템의 최상위 조직 단위입니다.

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| `id` | INT | PK, AUTO_INCREMENT | 내부 식별자 |
| `username` | VARCHAR | UNIQUE, NOT NULL | 센터 고유 ID (로그인 및 FK 참조용) |
| `center_name` | VARCHAR | NOT NULL | 센터 공식 명칭 |
| `center_summary` | VARCHAR | NULL | 센터 한 줄 소개 |
| `center_introduce` | TEXT | NULL | 센터 상세 소개 |
| `center_export` | VARCHAR | NULL | 센터 전문 분야 |
| `center_addr` | VARCHAR | NULL | 센터 주소 |
| `center_tel` | VARCHAR | NULL | 센터 대표 전화번호 |
| `created_at` | DATETIME | NOT NULL | 생성 일시 |
| `updated_at` | DATETIME | NOT NULL | 최종 수정 일시 |
| `deleted_at` | DATETIME | NULL | 삭제 일시 (Soft Delete) |

---

### 3.2 User (사용자 / 선생님)

시스템에 접근하는 모든 사용자를 관리합니다. 최고관리자, 센터장, 선생님을 모두 포함합니다.

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| `id` | INT | PK, AUTO_INCREMENT | 내부 식별자 |
| `username` | VARCHAR | UNIQUE, NOT NULL | 로그인 ID (FK 참조용) |
| `password` | VARCHAR | NOT NULL | bcrypt 해시 비밀번호 |
| `email` | VARCHAR | NULL | 이메일 주소 |
| `full_name` | VARCHAR | NOT NULL | 실명 |
| `birth_date` | DATE | NULL | 생년월일 |
| `hp_number` | VARCHAR | NOT NULL | 휴대폰 번호 (필수) |
| `phone_number` | VARCHAR | NULL | 유선 전화번호 |
| `address` | VARCHAR | NULL | 주소 |
| `zip_code` | VARCHAR | NULL | 우편번호 |
| `center_username` | VARCHAR | FK → CenterInfo.username, NULL | 소속 센터 ID |
| `user_type` | INT | DEFAULT 2 | 사용자 유형 (1=센터장, 2=선생님) |
| `is_active` | INT | DEFAULT 1 | 활성 상태 (1=활성, 0=비활성) |
| `is_superuser` | INT | DEFAULT 0 | 최고관리자 여부 (1=최고관리자) |
| `usercolor` | VARCHAR | NOT NULL | 일정 캘린더 표시 색상 (hex) |
| `expertise` | VARCHAR | NULL | 전문 분야 |
| `created_at` | DATETIME | NOT NULL | 생성 일시 |
| `updated_at` | DATETIME | NOT NULL | 최종 수정 일시 |
| `deleted_at` | DATETIME | NULL | 삭제 일시 (Soft Delete) |

**user_type 코드표**

| 값 | 설명 | 권한 |
|----|------|------|
| 1 | 센터장 | 센터 생성/관리, 선생님/내담자 관리, 일정 조회 |
| 2 | 선생님 | 담당 내담자 관리, 개인 일정 등록/수정, 상담 기록 작성 |

> `is_superuser=1`인 경우 `user_type`에 관계없이 시스템 전체 접근 권한 보유

---

### 3.3 ClientInfo (내담자 정보)

상담센터에 등록된 내담자(아동 및 보호자)의 정보를 관리합니다.

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| `id` | INT | PK, AUTO_INCREMENT | 내부 식별자 |
| `consultant` | VARCHAR | FK → User.username, NOT NULL | 담당 상담사 username |
| `consultant_status` | INT | NOT NULL | 상담 상태 코드 (하단 코드표 참조) |
| `client_name` | VARCHAR | NOT NULL | 내담자 이름 |
| `phone_number` | VARCHAR | NULL | 연락처 |
| `tags` | VARCHAR | NULL | 분류 태그 (콤마 구분) |
| `memo` | TEXT | NULL | 메모 |
| `birth_date` | DATE | NULL | 생년월일 |
| `gender` | VARCHAR | NULL | 성별 |
| `email_address` | VARCHAR | NULL | 이메일 주소 |
| `address_region` | VARCHAR | NULL | 거주 지역 (시/도) |
| `address_city` | VARCHAR | NULL | 거주 지역 (시/군/구) |
| `family_members` | VARCHAR | NULL | 가족 구성원 정보 |
| `consultation_path` | VARCHAR | NULL | 상담 신청 경로 (예: 지인 소개, 인터넷 검색) |
| `center_username` | VARCHAR | FK → CenterInfo.username, NOT NULL | 소속 센터 ID |
| `registered_by` | VARCHAR | NOT NULL | 최초 등록자 username |
| `created_at` | DATETIME | NOT NULL | 생성 일시 |
| `updated_at` | DATETIME | NOT NULL | 최종 수정 일시 |
| `deleted_at` | DATETIME | NULL | 삭제 일시 (Soft Delete) |

**consultant_status 코드표**

| 값 | 설명 |
|----|------|
| 1 | 상담 진행 중 |
| 2 | 상담 종결 |
| 3 | 상담 대기 |

---

### 3.4 Program (프로그램)

센터에서 제공하는 상담/재활 프로그램을 관리합니다.

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| `id` | INT | PK, AUTO_INCREMENT | 내부 식별자 |
| `program_name` | VARCHAR | NOT NULL | 프로그램 명칭 |
| `program_type` | VARCHAR | NOT NULL | 프로그램 유형 |
| `category` | VARCHAR | NULL | 세부 카테고리 |
| `teacher_username` | VARCHAR | FK → User.username, NULL | 담당 선생님 username (`is_all_teachers=true`이면 NULL 가능) |
| `description` | TEXT | NULL | 프로그램 상세 설명 |
| `duration` | INT | DEFAULT 60 | 회기 소요 시간 (분 단위) |
| `max_participants` | INT | DEFAULT 1 | 최대 참여 인원 |
| `price` | DECIMAL | NULL | 회기당 금액 |
| `is_all_teachers` | BOOLEAN | DEFAULT FALSE | 전체 선생님 적용 여부 |
| `is_active` | BOOLEAN | DEFAULT TRUE | 프로그램 활성 상태 |
| `center_username` | VARCHAR | FK → CenterInfo.username, NOT NULL | 소속 센터 ID |
| `created_at` | DATETIME | NOT NULL | 생성 일시 |
| `updated_at` | DATETIME | NOT NULL | 최종 수정 일시 |
| `deleted_at` | DATETIME | NULL | 삭제 일시 (Soft Delete) |

---

### 3.5 Schedule (반복 일정 템플릿)

정기적으로 반복되는 일정의 원형(템플릿)을 관리합니다. 실제 개별 일정은 `ScheduleList`에서 관리됩니다.

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| `id` | INT | PK, AUTO_INCREMENT | 내부 식별자 |
| `schedule_type` | INT | NOT NULL | 일정 유형 코드 (하단 코드표 참조) |
| `teacher_username` | VARCHAR | FK → User.username, NOT NULL | 담당 선생님 username |
| `client_id` | INT | FK → ClientInfo.id, NOT NULL | 내담자 ID |
| `start_date` | DATE | NOT NULL | 반복 일정 시작일 |
| `finish_date` | DATE | NOT NULL | 반복 일정 종료일 |
| `start_time` | VARCHAR | NOT NULL | 시작 시각 (HH:MM 형식) |
| `finish_time` | VARCHAR | NOT NULL | 종료 시각 (HH:MM 형식) |
| `repeat_type` | INT | NOT NULL | 반복 주기 코드 (하단 코드표 참조) |
| `repeat_days` | VARCHAR | NULL | 주간 반복 요일 (예: `"1,3,5"` = 월,수,금) |
| `created_by` | VARCHAR | NOT NULL | 생성자 username |
| `updated_by` | VARCHAR | NOT NULL | 최종 수정자 username |
| `created_at` | DATETIME | NOT NULL | 생성 일시 |
| `updated_at` | DATETIME | NOT NULL | 최종 수정 일시 |
| `deleted_at` | DATETIME | NULL | 삭제 일시 (Soft Delete) |

**schedule_type 코드표**

| 값 | 설명 |
|----|------|
| 1 | 재활 |
| 2 | 상담/평가 |
| 3 | 기타 |

**repeat_type 코드표**

| 값 | 설명 |
|----|------|
| 1 | 매일 반복 |
| 2 | 매주 반복 |
| 3 | 매월 반복 |

---

### 3.6 ScheduleList (일정 인스턴스)

실제 운영되는 개별 일정 항목을 관리합니다. `Schedule`(반복 템플릿)로부터 생성되거나 단독으로 생성됩니다.

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| `id` | INT | PK, AUTO_INCREMENT | 내부 식별자 |
| `title` | VARCHAR | NULL | 일정 제목 |
| `teacher_username` | VARCHAR | FK → User.username, NOT NULL | 담당 선생님 username |
| `client_id` | INT | FK → ClientInfo.id, NOT NULL | 내담자 ID |
| `program_id` | INT | FK → Program.id, NULL | 적용 프로그램 ID |
| `schedule_date` | DATE | NOT NULL | 일정 날짜 |
| `schedule_time` | VARCHAR | NOT NULL | 시작 시각 (HH:MM 형식) |
| `schedule_finish_time` | VARCHAR | NOT NULL | 종료 시각 (HH:MM 형식) |
| `schedule_status` | INT | NOT NULL | 일정 상태 코드 (하단 코드표 참조) |
| `schedule_memo` | VARCHAR(255) | NULL | 일정 메모 (최대 255자) |
| `schedule_id` | INT | FK → Schedule.id, NULL | 원본 반복 일정 ID (반복에서 생성된 경우) |
| `created_by` | VARCHAR | NOT NULL | 생성자 username |
| `updated_by` | VARCHAR | NOT NULL | 최종 수정자 username |
| `created_at` | DATETIME | NOT NULL | 생성 일시 |
| `updated_at` | DATETIME | NOT NULL | 최종 수정 일시 |
| `deleted_at` | DATETIME | NULL | 삭제 일시 (Soft Delete) |

**schedule_status 코드표**

| 값 | 설명 |
|----|------|
| 1 | 예약 (확정) |
| 2 | 완료 |
| 3 | 취소 |
| 4 | 노쇼 (No-show) |
| 5 | 보류 |

---

### 3.7 Record (상담 기록)

개별 일정(`ScheduleList`) 완료 후 작성되는 상담/치료 기록입니다.

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| `id` | INT | PK, AUTO_INCREMENT | 내부 식별자 |
| `schedule_id` | INT | FK → ScheduleList.id, NOT NULL | 연결된 일정 인스턴스 ID |
| `consultation_content` | TEXT | NULL | 상담 내용 |
| `record_content` | TEXT | NULL | 기록 내용 (치료 결과, 진행 사항 등) |
| `special_notes` | TEXT | NULL | 특이 사항 |
| `created_at` | DATETIME | NOT NULL | 생성 일시 |
| `updated_at` | DATETIME | NOT NULL | 최종 수정 일시 |
| `deleted_at` | DATETIME | NULL | 삭제 일시 (Soft Delete) |

---

### 3.8 Voucher (바우처)

정부 지원 바우처 및 지원사업 정보를 관리합니다.

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| `id` | INT | PK, AUTO_INCREMENT | 내부 식별자 |
| `type` | ENUM | NOT NULL | 바우처 유형 (하단 코드표 참조) |
| `name` | VARCHAR | NOT NULL | 바우처 명칭 |
| `support_amount` | DECIMAL | NOT NULL | 정부 지원 금액 |
| `personal_contribution` | DECIMAL | NOT NULL | 본인 부담 금액 |
| `status` | VARCHAR | NOT NULL | 사용 상태 (`사용` / `중단`) |
| `social_welfare_service_number` | VARCHAR | NULL | 사회서비스 전자바우처 번호 |
| `created_at` | DATETIME | NOT NULL | 생성 일시 |
| `updated_at` | DATETIME | NOT NULL | 최종 수정 일시 |
| `deleted_at` | DATETIME | NULL | 삭제 일시 (Soft Delete) |

**type ENUM 값**

| 값 | 설명 |
|----|------|
| `장애아동가족지원` | 장애아동 가족 지원 바우처 |
| `지역사회투자사업` | 지역사회 서비스 투자 사업 |
| `교육청지원사업` | 교육청 지원 사업 |
| `기타` | 그 외 지원 사업 |

---

### 3.9 Announcement (공지사항)

센터 운영 관련 공지사항 및 자료를 관리합니다.

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| `id` | INT | PK, AUTO_INCREMENT | 내부 식별자 |
| `title` | VARCHAR | NOT NULL | 공지 제목 |
| `content` | TEXT | NOT NULL | 공지 내용 |
| `is_important` | BOOLEAN | NOT NULL | 중요 공지 여부 |
| `category` | ENUM | NOT NULL | 공지 카테고리 (하단 코드표 참조) |
| `announcement_type` | ENUM | NOT NULL | 공지 대상 유형 (하단 코드표 참조) |
| `end_date` | DATE | NULL | 공지 만료일 |
| `attachment_url` | VARCHAR | NULL | 첨부파일 URL |
| `created_at` | DATETIME | NOT NULL | 생성 일시 |
| `updated_at` | DATETIME | NOT NULL | 최종 수정 일시 |
| `deleted_at` | DATETIME | NULL | 삭제 일시 (Soft Delete) |

**category ENUM 값**

| 값 | 설명 |
|----|------|
| `중요공지` | 긴급 또는 필수 확인 공지 |
| `지침` | 운영 지침 및 가이드라인 |
| `양식` | 각종 서식 및 템플릿 |

**announcement_type ENUM 값**

| 값 | 설명 |
|----|------|
| `센터공지` | 내부 직원 대상 공지 |
| `고객공지` | 내담자/보호자 대상 공지 |
| `자료실` | 공용 자료 보관 |

---

### 3.10 UserSearchSelectedTeacher (선생님 필터 설정)

사용자별 일정 캘린더에서 표시할 선생님 필터 설정을 저장합니다.

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| `username` | VARCHAR | PK, FK → User.username | 설정을 저장한 사용자 username |
| `selected_teacher` | VARCHAR | NOT NULL | 선택된 선생님 username 목록 (콤마 구분, 예: `"teacher1,teacher2,teacher3"`) |
| `created_at` | DATETIME | NOT NULL | 생성 일시 |
| `updated_at` | DATETIME | NOT NULL | 최종 수정 일시 |
| `deleted_at` | DATETIME | NULL | 삭제 일시 (Soft Delete) |

---

## 4. 관계 정의

### 4.1 핵심 관계 목록

| 관계 | 부모 테이블 | 자식 테이블 | FK 컬럼 | 설명 |
|------|------------|------------|---------|------|
| CenterInfo → User | CenterInfo.username | User.center_username | center_username | 센터 소속 사용자 |
| CenterInfo → ClientInfo | CenterInfo.username | ClientInfo.center_username | center_username | 센터 소속 내담자 |
| CenterInfo → Program | CenterInfo.username | Program.center_username | center_username | 센터 소속 프로그램 |
| User → ClientInfo | User.username | ClientInfo.consultant | consultant | 내담자 담당 상담사 |
| User → Program | User.username | Program.teacher_username | teacher_username | 프로그램 담당 선생님 |
| User → Schedule | User.username | Schedule.teacher_username | teacher_username | 일정 담당 선생님 |
| User → ScheduleList | User.username | ScheduleList.teacher_username | teacher_username | 인스턴스 담당 선생님 |
| User → UserSearchSelectedTeacher | User.username | UserSearchSelectedTeacher.username | username | 선생님 필터 설정 |
| ClientInfo → Schedule | ClientInfo.id | Schedule.client_id | client_id | 내담자 반복 일정 |
| ClientInfo → ScheduleList | ClientInfo.id | ScheduleList.client_id | client_id | 내담자 개별 일정 |
| Program → ScheduleList | Program.id | ScheduleList.program_id | program_id | 일정에 적용된 프로그램 |
| Schedule → ScheduleList | Schedule.id | ScheduleList.schedule_id | schedule_id | 반복 템플릿 → 인스턴스 |
| ScheduleList → Record | ScheduleList.id | Record.schedule_id | schedule_id | 일정 → 상담 기록 |

### 4.2 관계 다이어그램 (텍스트)

```
CenterInfo (1) ──── (N) User
CenterInfo (1) ──── (N) ClientInfo
CenterInfo (1) ──── (N) Program

User (1) ──── (N) ClientInfo          [담당 관계]
User (1) ──── (N) Program             [담당 관계]
User (1) ──── (N) Schedule            [담당 관계]
User (1) ──── (N) ScheduleList        [담당 관계]
User (1) ──── (1) UserSearchSelectedTeacher

ClientInfo (1) ──── (N) Schedule
ClientInfo (1) ──── (N) ScheduleList

Program (1) ──── (N) ScheduleList

Schedule (1) ──── (N) ScheduleList    [템플릿 → 인스턴스]

ScheduleList (1) ──── (N) Record
```

---

## 5. 인덱스 전략

### 5.1 권장 인덱스

| 테이블 | 인덱스 대상 컬럼 | 인덱스 유형 | 사용 목적 |
|--------|----------------|------------|----------|
| `user` | `username` | UNIQUE | 로그인 조회, FK 참조 |
| `user` | `center_username` | INDEX | 센터별 사용자 목록 조회 |
| `user` | `deleted_at` | INDEX | Soft Delete 필터링 |
| `centerinfo` | `username` | UNIQUE | FK 참조 |
| `clientinfo` | `consultant` | INDEX | 담당 상담사별 내담자 조회 |
| `clientinfo` | `center_username` | INDEX | 센터별 내담자 목록 조회 |
| `clientinfo` | `deleted_at` | INDEX | Soft Delete 필터링 |
| `program` | `center_username` | INDEX | 센터별 프로그램 조회 |
| `program` | `teacher_username` | INDEX | 선생님별 프로그램 조회 |
| `schedule` | `teacher_username` | INDEX | 선생님별 일정 조회 |
| `schedule` | `client_id` | INDEX | 내담자별 일정 조회 |
| `schedule` | `start_date, finish_date` | INDEX | 날짜 범위 조회 |
| `schedulelist` | `teacher_username, schedule_date` | 복합 INDEX | 선생님 + 날짜 기반 캘린더 조회 |
| `schedulelist` | `client_id` | INDEX | 내담자별 일정 이력 조회 |
| `schedulelist` | `schedule_id` | INDEX | 반복 일정 인스턴스 조회 |
| `schedulelist` | `schedule_date` | INDEX | 날짜별 전체 일정 조회 |
| `schedulelist` | `deleted_at` | INDEX | Soft Delete 필터링 |
| `record` | `schedule_id` | INDEX | 일정별 기록 조회 |

### 5.2 복합 인덱스 활용 예시

```sql
-- 선생님의 특정 날짜 범위 일정 조회 (가장 빈번한 쿼리)
CREATE INDEX idx_schedulelist_teacher_date
    ON schedulelist (teacher_username, schedule_date, deleted_at);

-- 센터 내 활성 내담자 목록 조회
CREATE INDEX idx_clientinfo_center_status
    ON clientinfo (center_username, consultant_status, deleted_at);
```

---

## 6. Soft Delete 패턴

### 6.1 개요

모든 핵심 테이블은 물리적 삭제(Hard Delete) 대신 **논리적 삭제(Soft Delete)** 를 사용합니다.

삭제 시 `deleted_at` 컬럼에 삭제 일시를 기록하고, 활성 레코드 조회 시에는 `deleted_at IS NULL` 조건을 적용합니다.

### 6.2 적용 테이블

- `user`
- `centerinfo`
- `clientinfo`
- `program`
- `schedule`
- `schedulelist`
- `record`
- `voucher`
- `announcement`
- `usersearchselectedteacher`

### 6.3 동작 방식

```python
# 삭제 시 (SQLModel 예시)
from datetime import datetime

obj.deleted_at = datetime.utcnow()
session.add(obj)
session.commit()

# 조회 시 (활성 레코드만)
stmt = select(User).where(User.deleted_at == None)

# 삭제된 레코드 포함 조회 (관리자용)
stmt = select(User)  # deleted_at 조건 없음
```

### 6.4 Soft Delete 사용 이유

| 이유 | 설명 |
|------|------|
| **데이터 감사** | 삭제된 내담자/상담 기록의 이력 보존 |
| **실수 복구** | 잘못 삭제된 데이터 복원 가능 |
| **법적 보존 의무** | 의료/상담 기록의 보존 기간 준수 |
| **참조 무결성** | 연결된 레코드가 있어도 안전하게 비활성화 |
| **통계 유지** | 삭제된 데이터도 집계에 활용 가능 |

---

## 7. 데이터 격리 전략

### 7.1 센터 기반 격리 (Center-based Isolation)

모든 핵심 데이터는 `center_username` FK를 통해 센터 단위로 격리됩니다.

```
CenterInfo ─── User
           ─── ClientInfo
           ─── Program
```

**센터 격리 원칙:**
- 선생님은 소속 센터의 데이터만 접근 가능
- 센터장은 자신의 센터 데이터만 관리 가능
- 최고관리자(`is_superuser=1`)만 전체 데이터 접근 가능

### 7.2 사용자 역할별 접근 범위

| 역할 | 조건 | 접근 범위 |
|------|------|----------|
| 최고관리자 | `is_superuser = 1` | 전체 시스템 (모든 센터) |
| 센터장 | `user_type = 1` | 자신의 센터 (`center_username` 일치) |
| 선생님 | `user_type = 2` | 자신의 담당 내담자 및 개인 일정 |

### 7.3 API 레이어 격리 구현 패턴

```python
# 센터장: center_username 기반 필터링
def get_clients_for_center(center_username: str):
    return session.exec(
        select(ClientInfo)
        .where(ClientInfo.center_username == center_username)
        .where(ClientInfo.deleted_at == None)
    ).all()

# 선생님: 본인 담당 내담자만 조회
def get_clients_for_teacher(teacher_username: str):
    return session.exec(
        select(ClientInfo)
        .where(ClientInfo.consultant == teacher_username)
        .where(ClientInfo.deleted_at == None)
    ).all()
```

### 7.4 일정 격리

- **선생님**: `teacher_username` 기준으로 본인 일정만 등록/수정 가능
- **센터장**: `center_username` 기준으로 센터 전체 일정 조회 가능
- **시간 중복 방지**: 동일 선생님의 동일 시간대 중복 일정 등록 방지 필요

### 7.5 개인정보 보호

| 데이터 분류 | 해당 컬럼 | 처리 방침 |
|------------|----------|----------|
| 민감 개인정보 | `client_name`, `birth_date`, `phone_number` | HTTPS 전송 필수, 로그 기록 금지 |
| 상담 기록 | `Record.consultation_content`, `record_content` | 담당 선생님 및 센터장만 조회 |
| 인증 정보 | `User.password` | bcrypt 해시 저장, 평문 저장 금지 |
| 바우처 정보 | `Voucher.social_welfare_service_number` | 접근 권한 제한 |
