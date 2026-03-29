# ITokTok API 명세서

## 목차

1. [API 개요 및 인증](#1-api-개요-및-인증)
2. [공통 규칙](#2-공통-규칙)
3. [인증 API](#3-인증-api)
4. [사용자 관리 API](#4-사용자-관리-api)
5. [내담자 관리 API](#5-내담자-관리-api)
6. [프로그램 관리 API](#6-프로그램-관리-api)
7. [일정 관리 API](#7-일정-관리-api)
8. [기타 API 요약](#8-기타-api-요약)
9. [권한 매트릭스](#9-권한-매트릭스)

---

## 1. API 개요 및 인증

### 기본 정보

| 항목 | 값 |
|------|-----|
| Base URL (운영) | `http://api.itoktok.com:3000` |
| Base URL (개발) | `http://localhost:3000` |
| 응답 형식 | JSON |
| 인증 방식 | Bearer JWT (OAuth2 Password Flow) |
| API 문서 | `{Base URL}/docs` (Swagger UI) |

### 인증 방법

모든 보호된 엔드포인트는 `Authorization` 헤더에 JWT 토큰을 포함해야 합니다.

```
Authorization: Bearer {access_token}
```

토큰은 `/auth/login` 엔드포인트를 통해 발급받으며, 만료 시간은 환경 변수 `ACCESS_TOKEN_EXPIRE_MINUTES`로 설정됩니다.

---

## 2. 공통 규칙

### 응답 형식

**성공 응답 (SuccessResponse)**

```json
{
  "data": {},
  "status": "ok",
  "msg": "success",
  "code": 20000
}
```

**오류 응답 (ErrorResponse)**

```json
{
  "data": null,
  "status": "fail",
  "msg": "fail",
  "code": 50000
}
```

**FastAPI 표준 오류 (HTTPException)**

```json
{
  "detail": "오류 메시지"
}
```

**페이지네이션 응답 (Page)**

```json
{
  "items": [...],
  "total": 100,
  "page": 1,
  "size": 10,
  "pages": 10
}
```

### HTTP 상태 코드

| 코드 | 의미 |
|------|------|
| 200 | 요청 성공 |
| 201 | 리소스 생성 성공 |
| 400 | 잘못된 요청 (유효성 검증 실패) |
| 401 | 인증 실패 (토큰 없음 또는 만료) |
| 403 | 권한 없음 |
| 404 | 리소스를 찾을 수 없음 |
| 422 | 요청 데이터 형식 오류 |
| 500 | 서버 내부 오류 |

### 페이지네이션 파라미터

페이지네이션을 지원하는 엔드포인트의 공통 쿼리 파라미터:

| 파라미터 | 타입 | 기본값 | 설명 |
|----------|------|--------|------|
| `page` | int | 1 | 페이지 번호 (1부터 시작) |
| `size` | int | 10 | 페이지당 항목 수 (최대 100) |
| `search_qry` | string | "" | 검색어 |

### 프론트엔드 주의사항

axios 인터셉터(`src/api/interceptors.js`)가 `response.data`를 자동으로 추출하여 반환합니다.

```javascript
// 올바른 사용법
const response = await getClient(id);
const items = response.items;       // SuccessResponse.data 또는 Page의 경우

// 잘못된 사용법
const items = response.data.items;  // 오류 발생
```

---

## 3. 인증 API

### 3.1 로그인

**POST /auth/login**

JWT 액세스 토큰을 발급합니다.

- 인증 필요: 아니오
- Content-Type: `application/x-www-form-urlencoded`

**요청 (form-data)**

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `username` | string | Y | 사용자 아이디 |
| `password` | string | Y | 비밀번호 |

**응답 예시 (200)**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**오류 응답**

```json
{
  "detail": "Incorrect username or password"
}
```

---

### 3.2 회원가입

**POST /signup**

센터장 계정을 생성합니다.

- 인증 필요: 아니오

**요청 본문 (UserCreate)**

```json
{
  "username": "center01",
  "password": "password123",
  "email": "center@example.com",
  "full_name": "홍길동",
  "hp_number": "010-1234-5678",
  "user_type": "1",
  "birth_date": "1985-01-01",
  "zip_code": "06234",
  "address": "서울시 강남구",
  "address_extra": "101호",
  "phone_number": "02-1234-5678",
  "center_username": "",
  "is_active": 1,
  "is_superuser": 0,
  "usercolor": "#a668e3",
  "expertise": "아동심리"
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `username` | string | Y | 로그인 아이디 |
| `password` | string | Y | 비밀번호 (최대 15자) |
| `email` | string | Y | 이메일 주소 |
| `full_name` | string | Y | 이름 |
| `hp_number` | string | Y | 휴대폰 번호 |
| `user_type` | string | Y | 사용자 유형 (1: 센터장, 그 외: 선생님) |
| `birth_date` | string | N | 생년월일 (YYYY-MM-DD) |
| `zip_code` | string | N | 우편번호 |
| `address` | string | N | 주소 |
| `address_extra` | string | N | 상세 주소 |
| `phone_number` | string | N | 전화번호 |
| `center_username` | string | N | 소속 센터 username |
| `is_active` | int | N | 활성화 여부 (0: 비활성, 1: 활성, 기본값: 1) |
| `usercolor` | string | N | 일정 표시 색상 (기본값: #a668e3) |
| `expertise` | string | N | 전문분야 |

**응답 예시 (200)**

```json
{
  "data": {
    "id": 1,
    "username": "center01",
    "email": "center@example.com",
    "full_name": "홍길동",
    ...
  },
  "status": "ok",
  "msg": "success",
  "code": 20000
}
```

---

### 3.3 아이디 중복 확인

**GET /signup/check-username?username={username}**

- 인증 필요: 아니오

**쿼리 파라미터**

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| `username` | string | Y | 확인할 아이디 |

**응답 예시 (200)**

```json
{
  "data": { "exists": false },
  "status": "ok",
  "msg": "success",
  "code": 20000
}
```

---

### 3.4 비밀번호 찾기

**POST /api/forget-password**

비밀번호 재설정 요청을 처리합니다.

- 인증 필요: 아니오

**요청 본문**

```json
{
  "email": "user@example.com"
}
```

**응답 예시 (200)**

```json
{
  "data": { "requested": true, "email": "user@example.com" },
  "status": "ok",
  "msg": "password reset request accepted",
  "code": 20000
}
```

---

## 4. 사용자 관리 API

모든 `/users` 엔드포인트는 인증이 필요합니다.

### 4.1 내 정보 조회

**GET /users/me**

현재 로그인한 사용자의 정보를 반환합니다.

**응답 예시 (200)**

```json
{
  "data": {
    "id": 1,
    "username": "center01",
    "email": "center@example.com",
    "full_name": "홍길동",
    "hp_number": "010-1234-5678",
    "user_type": "1",
    "center_username": "",
    "is_active": 1,
    "is_superuser": 0,
    "usercolor": "#a668e3",
    "expertise": "아동심리",
    "created_at": "2024-01-01T00:00:00",
    "updated_at": "2024-01-01T00:00:00",
    "center_info": null
  },
  "status": "ok",
  "msg": "success",
  "code": 20000
}
```

---

### 4.2 사용자 목록 조회

**GET /users/**

페이지네이션이 적용된 사용자 목록을 반환합니다.

**쿼리 파라미터**

| 파라미터 | 타입 | 기본값 | 설명 |
|----------|------|--------|------|
| `page` | int | 1 | 페이지 번호 |
| `size` | int | 10 | 페이지당 수 (최대 10) |
| `search_qry` | string | "" | 검색어 (이름, 아이디) |

**응답 예시 (200)**

```json
{
  "items": [
    {
      "id": 1,
      "username": "teacher01",
      "full_name": "김선생",
      "user_type": "2",
      ...
    }
  ],
  "total": 25,
  "page": 1,
  "size": 10,
  "pages": 3
}
```

---

### 4.3 사용자 단건 조회

**GET /users/{user_id}**

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `user_id` | int | 사용자 ID |

**응답 예시 (200)**

```json
{
  "data": {
    "id": 1,
    "username": "teacher01",
    "full_name": "김선생",
    ...
  },
  "status": "ok",
  "msg": "success",
  "code": 20000
}
```

**오류 응답 (404)**

```json
{ "detail": "User not found" }
```

---

### 4.4 username으로 사용자 조회

**GET /users/username/{username}**

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `username` | string | 사용자 로그인 아이디 |

**응답 예시 (200)**

```json
{
  "data": {
    "id": 1,
    "username": "teacher01",
    "full_name": "김선생",
    ...
  },
  "status": "ok",
  "msg": "success",
  "code": 20000
}
```

---

### 4.5 최근 생성 사용자 조회

**GET /users/last**

가장 최근에 생성된 사용자를 반환합니다. (UserRead 스키마 직접 반환)

---

### 4.6 센터 선생님 목록 조회

**GET /users/teachers**

현재 로그인 사용자의 센터에 소속된 선생님 목록을 반환합니다.

**응답 예시 (200)**

```json
{
  "data": [
    {
      "id": 2,
      "username": "teacher01",
      "full_name": "김선생",
      "user_type": "2",
      "usercolor": "#ff6b6b",
      ...
    }
  ],
  "status": "ok",
  "msg": "success",
  "code": 20000
}
```

---

### 4.7 사용자 생성

**POST /users/**

새 사용자(선생님)를 생성합니다. 센터장 또는 최고관리자만 사용 가능합니다.

**요청 본문 (UserCreate)** — 3.2 회원가입 스키마와 동일

**응답 예시 (200)** — UserRead 스키마 직접 반환

---

### 4.8 사용자 수정

**PUT /users/{user_id}**

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `user_id` | int | 수정할 사용자 ID |

**요청 본문 (UserUpdate)**

UserCreate와 동일한 필드, `password`는 선택 사항입니다.

**응답 예시 (200)** — UserRead 스키마 직접 반환

---

### 4.9 사용자 삭제

**DELETE /users/{user_id}**

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `user_id` | int | 삭제할 사용자 ID |

**응답 예시 (200)**

```json
{ "ok": true }
```

---

### 4.10 선택된 선생님 관리

캘린더 필터링에 사용되는 선생님 선택 상태를 관리합니다.

#### 선택된 선생님 조회

**GET /users/selected-teachers**

**응답 예시 (200)**

```json
{
  "username": "center01",
  "selected_teacher": "teacher01,teacher02",
  "created_at": "2024-01-01T00:00:00",
  "updated_at": "2024-01-01T00:00:00"
}
```

#### 선택된 선생님 등록/갱신

**POST /users/selected-teachers**

기존 데이터가 있으면 자동으로 갱신합니다.

**요청 본문**

```json
{
  "selected_teacher": "teacher01,teacher02,teacher03"
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `selected_teacher` | string | Y | 쉼표로 구분된 선생님 username 목록 |

#### 선택된 선생님 수정

**PUT /users/selected-teachers**

**요청 본문**

```json
{
  "selected_teacher": "teacher01"
}
```

#### 선택된 선생님 삭제

**DELETE /users/selected-teachers**

**응답 예시 (200)**

```json
{ "ok": true }
```

---

## 5. 내담자 관리 API

모든 `/client` 엔드포인트는 인증이 필요합니다.

### 5.1 내담자 등록

**POST /client/**

**요청 본문 (ClientInfoCreate)**

```json
{
  "consultant": "teacher01",
  "client_name": "홍길동",
  "phone_number": "010-1234-5678",
  "center_username": "center01",
  "consultant_status": "1",
  "birth_date": "2010-05-15",
  "gender": "M",
  "email_address": "child@example.com",
  "address_region": "서울",
  "address_city": "강남구",
  "tags": "ADHD,불안장애",
  "memo": "초기 상담 필요",
  "family_members": "부모님 동반",
  "consultation_path": "인터넷 검색"
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `consultant` | string | Y | 담당 상담사 username (최대 20자) |
| `client_name` | string | Y | 내담자 이름 (최대 30자) |
| `phone_number` | string | Y | 전화번호 (최대 15자) |
| `center_username` | string | Y | 소속 센터 username (최대 20자) |
| `consultant_status` | string | N | 상담 상태 (1: 상담중, 2: 종결, 3: 대기, 기본값: "1") |
| `birth_date` | string | N | 생년월일 |
| `gender` | string | N | 성별 (M/F, 최대 1자) |
| `email_address` | string | N | 이메일 (최대 50자) |
| `address_region` | string | N | 지역 (최대 50자) |
| `address_city` | string | N | 도시 (최대 50자) |
| `tags` | string | N | 태그 (쉼표 구분, 최대 100자) |
| `memo` | string | N | 메모 |
| `family_members` | string | N | 가족 구성원 |
| `consultation_path` | string | N | 상담 경로 (최대 20자) |

> `registered_by`는 현재 로그인 사용자 username으로 자동 설정됩니다.
> `center_username`이 비어 있으면 현재 사용자의 센터 username으로 자동 설정됩니다.

**응답 예시 (200)** — ClientInfoRead 스키마 직접 반환

```json
{
  "id": 1,
  "consultant": "teacher01",
  "client_name": "홍길동",
  "phone_number": "010-1234-5678",
  "consultant_status": "1",
  "tags": "ADHD,불안장애",
  "created_at": "2024-01-01T00:00:00",
  "updated_at": "2024-01-01T00:00:00",
  "deleted_at": null,
  "consultant_info": {
    "id": 2,
    "username": "teacher01",
    "full_name": "김선생",
    ...
  }
}
```

---

### 5.2 내담자 단건 조회

**GET /client/{info_id}**

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `info_id` | int | 내담자 ID |

**응답 예시 (200)**

```json
{
  "data": {
    "id": 1,
    "consultant": "teacher01",
    "client_name": "홍길동",
    "consultant_info": { ... }
  },
  "status": "ok",
  "msg": "success",
  "code": 20000
}
```

---

### 5.3 내담자 목록 조회

**GET /client/**

현재 로그인 사용자의 권한에 따라 조회 범위가 결정됩니다.
- 센터장: 센터 전체 내담자
- 선생님: 자신이 담당하는 내담자만

**쿼리 파라미터**

| 파라미터 | 타입 | 기본값 | 설명 |
|----------|------|--------|------|
| `page` | int | 1 | 페이지 번호 |
| `size` | int | 10 | 페이지당 수 |
| `search_qry` | string | "" | 이름/전화번호 검색 |

**응답 예시 (200)** — Page[ClientInfoRead]

```json
{
  "items": [ { "id": 1, "client_name": "홍길동", ... } ],
  "total": 50,
  "page": 1,
  "size": 10,
  "pages": 5
}
```

---

### 5.4 내담자 검색

**GET /client/search/?search_qry={keyword}**

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `search_qry` | string | 검색어 |

**응답 예시 (200)**

```json
{
  "data": [
    { "id": 1, "client_name": "홍길동", ... }
  ],
  "status": "ok",
  "msg": "success",
  "code": 20000
}
```

---

### 5.5 상담사별 내담자 조회

**GET /client/consultant/{consultant}**

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `consultant` | string | 상담사 username |

**응답 예시 (200)** — ClientInfoRead 직접 반환

---

### 5.6 내담자 수정

**PUT /client/{info_id}**

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `info_id` | int | 수정할 내담자 ID |

**요청 본문 (ClientInfoUpdate)** — ClientInfoCreate와 동일한 필드

**응답 예시 (200)** — ClientInfoRead 직접 반환

---

### 5.7 상담 상태 변경

**PUT /client/{info_id}/consultant_status/{consultant_status}**

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `info_id` | int | 내담자 ID |
| `consultant_status` | string | 상태값 (1: 상담중, 2: 종결, 3: 대기) |

**응답 예시 (200)**

```json
{
  "data": {
    "id": 1,
    "consultant_status": "2",
    ...
  },
  "status": "ok",
  "msg": "success",
  "code": 20000
}
```

---

### 5.8 내담자 삭제

**DELETE /client/{consultant}**

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `consultant` | string | 상담사 username |

**응답 예시 (200)**

```json
true
```

---

## 6. 프로그램 관리 API

모든 `/programs` 엔드포인트는 인증이 필요합니다.

### 6.1 프로그램 생성

**POST /programs/**

활성화된 사용자만 프로그램을 생성할 수 있습니다. `center_username`은 현재 로그인 사용자 username으로 자동 설정됩니다.

**요청 본문 (ProgramCreate)**

```json
{
  "program_name": "언어치료 기초",
  "program_type": "언어치료",
  "category": "아동발달",
  "teacher_username": "teacher01",
  "description": "기초 언어 발달 프로그램",
  "duration": 50,
  "max_participants": 1,
  "price": 50000.00,
  "is_all_teachers": false,
  "is_active": true
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `program_name` | string | Y | 프로그램명 (최대 50자) |
| `program_type` | string | Y | 프로그램 유형 (최대 50자) |
| `category` | string | N | 카테고리 (최대 50자) |
| `teacher_username` | string | N | 담당 선생님 username (최대 25자) |
| `description` | string | N | 설명 |
| `duration` | int | N | 진행 시간(분, 기본값: 60) |
| `max_participants` | int | N | 최대 참여 인원 (기본값: 1) |
| `price` | float | N | 가격 (기본값: 0.00) |
| `is_all_teachers` | bool | N | 전체 선생님 공용 여부 (기본값: false) |
| `is_active` | bool | N | 활성화 여부 (기본값: true) |

**응답 예시 (200)** — ProgramRead 직접 반환

```json
{
  "id": 1,
  "program_name": "언어치료 기초",
  "program_type": "언어치료",
  "duration": 50,
  "price": 50000.0,
  "is_active": true,
  "created_at": "2024-01-01T00:00:00+09:00",
  "updated_at": "2024-01-01T00:00:00+09:00",
  "teacher": { ... }
}
```

---

### 6.2 프로그램 단건 조회

**GET /programs/{program_id}**

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `program_id` | int | 프로그램 ID |

최고관리자가 아닌 경우 자신의 센터 프로그램만 조회 가능합니다.

**응답 예시 (200)**

```json
{
  "data": {
    "id": 1,
    "program_name": "언어치료 기초",
    ...
    "teacher": { "id": 2, "username": "teacher01", ... }
  },
  "status": "ok",
  "msg": "success",
  "code": 20000
}
```

---

### 6.3 프로그램 목록 조회

**GET /programs/**

**쿼리 파라미터**

| 파라미터 | 타입 | 기본값 | 설명 |
|----------|------|--------|------|
| `page` | int | 1 | 페이지 번호 |
| `size` | int | 10 | 페이지당 수 (최대 100) |
| `search_qry` | string | "" | 검색어 |
| `teacher_username` | string | null | 담당 선생님으로 필터링 |
| `program_type` | string | null | 프로그램 유형으로 필터링 |
| `is_active` | bool | null | 활성화 상태로 필터링 |

**응답 예시 (200)** — Page[ProgramRead]

```json
{
  "items": [
    { "id": 1, "program_name": "언어치료 기초", ... }
  ],
  "total": 15,
  "page": 1,
  "size": 10,
  "pages": 2
}
```

---

### 6.4 내 프로그램 목록 조회

**GET /programs/my**

현재 로그인 사용자의 프로그램 목록을 반환합니다.

**응답 예시 (200)** — Page[ProgramRead]

---

### 6.5 프로그램 수정

**PUT /programs/{program_id}**

최고관리자가 아닌 경우 자신의 센터 프로그램만 수정 가능합니다.

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `program_id` | int | 수정할 프로그램 ID |

**요청 본문 (ProgramUpdate)**

모든 필드가 선택 사항입니다.

```json
{
  "program_name": "언어치료 심화",
  "price": 60000.00,
  "is_active": true
}
```

**응답 예시 (200)** — ProgramRead 직접 반환

---

### 6.6 프로그램 삭제

**DELETE /programs/{program_id}**

최고관리자가 아닌 경우 자신의 센터 프로그램만 삭제 가능합니다.

**응답 예시 (200)**

```json
{
  "data": true,
  "status": "ok",
  "msg": "success",
  "code": 20000
}
```

---

## 7. 일정 관리 API

모든 `/schedules` 엔드포인트는 인증이 필요합니다.

### 7.1 일정 생성

**POST /schedules**

반복 일정을 포함한 일정을 생성합니다. `start_date`~`finish_date` 기간 동안 `repeat_type`과 `repeat_days`에 따라 여러 ScheduleList 인스턴스가 자동 생성됩니다.

**요청 본문 (ScheduleCreate)**

```json
{
  "schedule_type": 1,
  "teacher_username": "teacher01",
  "client_id": 1,
  "client_name": "홍길동",
  "program_id": 1,
  "start_date": "2024-03-01",
  "finish_date": "2024-03-31",
  "start_time": "09:00",
  "finish_time": "09:50",
  "repeat_type": "2",
  "repeat_days": {
    "mon": true,
    "tue": false,
    "wed": true,
    "thu": false,
    "fri": true,
    "sat": false,
    "sun": false
  },
  "memo": "첫 번째 상담",
  "phone_number": "010-1234-5678"
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `schedule_type` | int/string | N | 일정 유형 (1: 재활, 2: 상담/평가, 3: 기타, 기본값: 1) |
| `teacher_username` | string | Y | 담당 선생님 username (최대 20자) |
| `client_id` | int | Y | 내담자 ID |
| `start_date` | date | N | 시작일 (YYYY-MM-DD) |
| `finish_date` | date | N | 종료일 (YYYY-MM-DD) |
| `start_time` | string | Y | 시작 시간 (HH:MM) |
| `finish_time` | string | Y | 종료 시간 (HH:MM) |
| `repeat_type` | int/string | N | 반복 유형 (1: 매일, 2: 매주, 3: 매월, 기본값: 1) |
| `repeat_days` | object | N | 반복 요일 (매주 반복 시 사용) |
| `memo` | string | N | 메모 |
| `client_name` | string | N | 내담자 이름 |
| `phone_number` | string | N | 내담자 전화번호 |
| `program_id` | int | N | 프로그램 ID |

**응답 예시 (200)** — Schedule 모델 직접 반환

```json
{
  "id": 1,
  "teacher_username": "teacher01",
  "client_id": 1,
  "schedule_type": 1,
  "start_date": "2024-03-01",
  "finish_date": "2024-03-31",
  "start_time": "09:00",
  "finish_time": "09:50",
  "repeat_type": 2,
  "created_at": "2024-03-01T00:00:00+09:00",
  "updated_at": "2024-03-01T00:00:00+09:00"
}
```

---

### 7.2 일정 인스턴스 조회

**GET /schedules/{schedule_list_id}**

단일 일정 인스턴스(ScheduleList)와 연관된 상세 정보를 반환합니다.

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `schedule_list_id` | int | 일정 인스턴스 ID |

**응답 예시 (200)** — ScheduleListRead

```json
{
  "id": 5,
  "schedule_id": 1,
  "title": null,
  "teacher_username": "teacher01",
  "client_id": 1,
  "program_id": 1,
  "schedule_date": "2024-03-04",
  "schedule_time": "09:00",
  "schedule_finish_time": "09:50",
  "schedule_status": "1",
  "schedule_memo": null,
  "created_at": "2024-03-01T00:00:00+09:00",
  "updated_at": "2024-03-01T00:00:00+09:00",
  "schedule": { ... },
  "clientinfo": { ... },
  "teacher": { ... },
  "program": { ... }
}
```

**schedule_status 값**

| 값 | 의미 |
|----|------|
| 1 | 예약 |
| 2 | 완료 |
| 3 | 취소 |
| 4 | 노쇼 |
| 5 | 보류 |

---

### 7.3 일정 목록 조회

**GET /schedules**

**쿼리 파라미터**

| 파라미터 | 타입 | 기본값 | 설명 |
|----------|------|--------|------|
| `skip` | int | 0 | 건너뛸 항목 수 |
| `limit` | int | 10 | 반환할 최대 항목 수 |

**응답 예시 (200)** — List[ScheduleRead]

---

### 7.4 일정 수정

**PUT /schedules/{schedule_id}/{schedule_list_id}**

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `schedule_id` | int | 일정 ID |
| `schedule_list_id` | int | 일정 인스턴스 ID (선택) |

**요청 본문 (ScheduleUpdate)**

ScheduleCreate와 동일한 필드 + 추가 필드:

| 필드 | 타입 | 설명 |
|------|------|------|
| `schedule_status` | string | 일정 상태 (1~5, 기본값: "1") |
| `update_range` | string | 수정 범위 ("single": 이번만, "all": 이후 모두, 기본값: "single") |

**응답 예시 (200)**

```json
{
  "data": { "id": 1, ... },
  "status": "ok",
  "msg": "success",
  "code": 20000
}
```

---

### 7.5 일정 삭제

**DELETE /schedules/{schedule_id}/{schedule_list_id}**

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `schedule_id` | int | 일정 ID |
| `schedule_list_id` | int | 일정 인스턴스 ID |

**쿼리 파라미터**

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| `update_range` | string | Y | 삭제 범위 ("single": 이번만, "all": 이후 모두) |

**응답 예시 (200)**

```json
{
  "data": { ... },
  "status": "ok",
  "msg": "success",
  "code": 20000
}
```

---

### 7.6 단일 일정 인스턴스 삭제

**DELETE /schedules/list/{schedule_list_id}**

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `schedule_list_id` | int | 삭제할 일정 인스턴스 ID |

**응답 예시 (200)**

```json
{
  "data": {},
  "status": "ok",
  "msg": "success",
  "code": 20000
}
```

---

### 7.7 캘린더 API

#### 월간 캘린더 조회

**GET /schedules/calendar/{year}/{month}**

해당 월의 일정을 일별로 그룹화하여 반환합니다.

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `year` | int | 연도 (예: 2024) |
| `month` | int | 월 (1~12) |

**쿼리 파라미터**

| 파라미터 | 타입 | 기본값 | 설명 |
|----------|------|--------|------|
| `selected_teachers` | string | null | 필터링할 선생님 username (쉼표 구분) |

**응답 예시 (200)**

```json
{
  "data": {
    "2024-03-01": [
      {
        "id": 5,
        "teacher_username": "teacher01",
        "client_id": 1,
        "schedule_date": "2024-03-01",
        "schedule_time": "09:00",
        "schedule_finish_time": "09:50",
        "schedule_status": "1"
      }
    ],
    "2024-03-04": [ ... ]
  },
  "status": "ok",
  "msg": "success",
  "code": 20000
}
```

---

#### 주간 캘린더 조회

**GET /schedules/calendar/{year}/{month}/{day}**

해당 날짜가 속한 주(월요일 기준)의 일정을 반환합니다.

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `year` | int | 연도 |
| `month` | int | 월 |
| `day` | int | 일 |

**쿼리 파라미터**

| 파라미터 | 타입 | 기본값 | 설명 |
|----------|------|--------|------|
| `selected_teachers` | string | null | 필터링할 선생님 username (쉼표 구분) |

**응답 예시 (200)**

```json
{
  "data": {
    "2024-03-04": {
      "monday": [ { ... } ],
      "tuesday": [],
      "wednesday": [ { ... } ],
      "thursday": [],
      "friday": [ { ... } ],
      "saturday": [],
      "sunday": []
    }
  },
  "status": "ok",
  "msg": "success",
  "code": 20000
}
```

---

#### 일간 캘린더 조회

**GET /schedules/calendar/daily/{year}/{month}/{day}**

특정 날짜의 시간대별 일정을 반환합니다.

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `year` | int | 연도 |
| `month` | int | 월 |
| `day` | int | 일 |

**쿼리 파라미터**

| 파라미터 | 타입 | 기본값 | 설명 |
|----------|------|--------|------|
| `selected_teachers` | string | null | 필터링할 선생님 username (쉼표 구분) |

**응답 예시 (200)**

```json
{
  "data": {
    "09:00": [ { "id": 5, "teacher_username": "teacher01", ... } ],
    "10:00": [],
    "11:00": [ { ... } ]
  },
  "status": "ok",
  "msg": "success",
  "code": 20000
}
```

---

### 7.8 일정 날짜 변경

**PUT /schedules/update-date**

일정의 날짜만 변경합니다.

**쿼리 파라미터**

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| `schedule_id` | int | Y | 일정 ID |
| `schedule_list_id` | int | Y | 일정 인스턴스 ID |
| `new_date` | string | Y | 새 날짜 (YYYY-MM-DD) |
| `update_all_future` | bool | N | true: 이후 모든 일정 변경, false: 해당 일정만 변경 (기본값: false) |

**응답 예시 (200)**

```json
{
  "data": { "success": true, "message": "Schedule updated successfully" },
  "status": "ok",
  "msg": "success",
  "code": 20000
}
```

**오류 응답 (500)**

```json
{
  "data": null,
  "status": "fail",
  "msg": "일정 업데이트 중 오류가 발생했습니다",
  "code": 50000
}
```

---

### 7.9 일정 날짜/시간 변경

**PUT /schedules/update-date-time**

일정의 날짜와 시간을 함께 변경합니다. 종료 시간은 기존 진행 시간을 유지한 채 자동 계산됩니다.

**쿼리 파라미터**

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| `schedule_id` | int | Y | 일정 ID |
| `schedule_list_id` | int | Y | 일정 인스턴스 ID |
| `new_date` | string | Y | 새 날짜 (YYYY-MM-DD) |
| `new_time` | int | Y | 새 시작 시간 (시 단위, 예: 9 → 09:00) |
| `update_all_future` | bool | N | true: 이후 모든 일정 변경 (기본값: false) |

**응답 예시 (200)**

```json
{
  "data": { "success": true, "message": "Schedule updated successfully" },
  "status": "ok",
  "msg": "success",
  "code": 20000
}
```

---

## 8. 기타 API 요약

### 8.1 센터 관리 API (/center)

| Method | URL | 설명 |
|--------|-----|------|
| POST | /center/register | 센터 관리자 등록 |
| GET | /center/{director_id} | 센터 관리자 조회 |
| GET | /center | 센터 관리자 목록 조회 (skip, limit) |
| PUT | /center/{director_id} | 센터 관리자 수정 |
| DELETE | /center/{director_id} | 센터 관리자 삭제 |
| POST | /center/info | 센터 정보 등록 |
| GET | /center/info/{username} | 센터 정보 조회 |
| GET | /center/info | 센터 정보 목록 조회 |
| PUT | /center/info/{username} | 센터 정보 수정 (없으면 생성) |
| DELETE | /center/info/{username} | 센터 정보 삭제 |

**CenterDirectorCreate 주요 필드**

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `username` | string | Y | 아이디 |
| `password` | string | Y | 비밀번호 |
| `full_name` | string | Y | 이름 |
| `email` | EmailStr | Y | 이메일 |
| `position` | string | Y | 직책 |
| `mobile_number` | string | Y | 휴대폰 번호 |
| `birthdate` | date | N | 생년월일 |
| `qualification_number` | string | N | 자격증 번호 |
| `receive_alerts` | bool | N | 알림 수신 여부 |

**CenterInfoCreate 주요 필드**

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `username` | string | Y | 센터 username |
| `center_name` | string | Y | 센터명 (최대 20자) |
| `center_summary` | string | Y | 한줄소개 (최대 100자) |
| `center_introduce` | string | Y | 센터 소개 (최대 255자) |
| `center_export` | string | Y | 전문분야 (최대 50자) |
| `center_addr` | string | Y | 센터 주소 (최대 255자) |
| `center_tel` | string | Y | 전화번호 (최대 15자) |

---

### 8.2 선생님 관리 API (/teachers)

| Method | URL | 설명 |
|--------|-----|------|
| POST | /teachers | 선생님 등록 |
| GET | /teachers/{teacher_id} | 선생님 조회 |
| GET | /teachers | 선생님 목록 조회 (skip, limit) |
| PUT | /teachers/{teacher_id} | 선생님 수정 |
| DELETE | /teachers/{teacher_id} | 선생님 삭제 |

**TeacherCreate 주요 필드**

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `username` | string | Y | 아이디 |
| `password` | string | Y | 비밀번호 |
| `full_name` | string | Y | 이름 |
| `email` | EmailStr | Y | 이메일 |
| `position` | string | Y | 직책 |
| `mobile_number` | string | Y | 휴대폰 번호 |
| `teacher_role` | string | Y | 선생님 역할 |
| `birthdate` | date | N | 생년월일 |

---

### 8.3 상담 기록 API (/records)

| Method | URL | 설명 |
|--------|-----|------|
| POST | /records/ | 상담 기록 생성 |
| GET | /records/{record_id} | 상담 기록 조회 |
| GET | /records/ | 상담 기록 목록 (skip, limit) |
| PUT | /records/{record_id} | 상담 기록 수정 |
| DELETE | /records/{record_id} | 상담 기록 삭제 |

**RecordCreate 필드**

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `schedule_id` | int | Y | 연결된 일정 ID |
| `consultation_content` | string | N | 상담 내용 |
| `record_content` | string | N | 기록 내용 |
| `special_notes` | string | N | 특이사항 |

---

### 8.4 바우처 관리 API (/vouchers)

| Method | URL | 설명 |
|--------|-----|------|
| POST | /vouchers/ | 바우처 생성 |
| GET | /vouchers/{voucher_id} | 바우처 조회 |
| GET | /vouchers/ | 바우처 목록 (skip, limit) |
| PUT | /vouchers/{voucher_id} | 바우처 수정 |
| DELETE | /vouchers/{voucher_id} | 바우처 삭제 |

**VoucherCreate 필드**

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `type` | VoucherType | Y | 바우처 유형 |
| `name` | string | Y | 바우처명 |
| `support_amount` | float | N | 지원 금액 (기본값: 0) |
| `personal_contribution` | float | N | 본인 부담금 (기본값: 0) |
| `status` | VoucherStatus | Y | 상태 |
| `social_welfare_service_number` | string | N | 사회복지서비스 번호 |

---

### 8.5 공지사항 API (/announcements)

| Method | URL | 설명 |
|--------|-----|------|
| POST | /announcements/ | 공지사항 생성 |
| GET | /announcements/{announcement_id} | 공지사항 조회 |
| GET | /announcements/ | 공지사항 목록 (skip, limit) |
| PUT | /announcements/{announcement_id} | 공지사항 수정 |
| DELETE | /announcements/{announcement_id} | 공지사항 삭제 |

---

### 8.6 문의사항 API (/inquiries)

| Method | URL | 설명 |
|--------|-----|------|
| POST | /inquiries/ | 문의사항 생성 |
| GET | /inquiries/{inquiry_id} | 문의사항 조회 |
| GET | /inquiries/ | 문의사항 목록 (skip, limit) |
| PUT | /inquiries/{inquiry_id} | 문의사항 수정 |
| DELETE | /inquiries/{inquiry_id} | 문의사항 삭제 |

---

## 9. 권한 매트릭스

### 역할 정의

| 역할 | 조건 | 설명 |
|------|------|------|
| 최고관리자 | `is_superuser == 1` | 시스템 전체 접근 권한 |
| 센터장 | `user_type == "1"` | 자신의 센터 전체 관리 |
| 선생님 | 기본값 (user_type != "1") | 담당 내담자 및 개인 일정만 관리 |

### API별 권한 매트릭스

| API | 최고관리자 | 센터장 | 선생님 |
|-----|-----------|--------|--------|
| **인증** | | | |
| POST /auth/login | O | O | O |
| POST /signup | O | O | O |
| GET /signup/check-username | O | O | O |
| **사용자 관리** | | | |
| GET /users/me | O | O | O |
| GET /users/ | O | O (센터 내) | O (본인만) |
| GET /users/{user_id} | O | O | O |
| GET /users/teachers | O | O (센터 내) | O (센터 내) |
| POST /users/ | O | O | X |
| PUT /users/{user_id} | O | O (센터 내) | O (본인만) |
| DELETE /users/{user_id} | O | O (센터 내) | X |
| GET/POST/PUT/DELETE /users/selected-teachers | O | O | O |
| **내담자 관리** | | | |
| POST /client/ | O | O | O |
| GET /client/ | O | O (센터 내 전체) | O (담당만) |
| GET /client/{info_id} | O | O | O (담당만) |
| GET /client/search/ | O | O | O |
| GET /client/consultant/{consultant} | O | O | O (본인만) |
| PUT /client/{info_id} | O | O | O (담당만) |
| PUT /client/{info_id}/consultant_status/{status} | O | O | O (담당만) |
| DELETE /client/{consultant} | O | O | X |
| **프로그램 관리** | | | |
| POST /programs/ | O | O | O (is_active 사용자) |
| GET /programs/{program_id} | O | O (자신의 센터) | O (자신의 센터) |
| GET /programs/ | O | O | O |
| GET /programs/my | O | O | O |
| PUT /programs/{program_id} | O | O (자신의 센터) | O (자신의 센터) |
| DELETE /programs/{program_id} | O | O (자신의 센터) | O (자신의 센터) |
| **일정 관리** | | | |
| POST /schedules | O | O | O |
| GET /schedules/{schedule_list_id} | O | O | O |
| GET /schedules | O | O | O |
| PUT /schedules/{schedule_id}/{schedule_list_id} | O | O | O (담당만) |
| DELETE /schedules/{schedule_id}/{schedule_list_id} | O | O | O (담당만) |
| GET /schedules/calendar/{year}/{month} | O | O (센터 내) | O (담당만) |
| GET /schedules/calendar/{year}/{month}/{day} | O | O (센터 내) | O (담당만) |
| GET /schedules/calendar/daily/{year}/{month}/{day} | O | O (센터 내) | O (담당만) |
| PUT /schedules/update-date | O | O | O (담당만) |
| PUT /schedules/update-date-time | O | O | O (담당만) |
| **센터 관리** | | | |
| POST/PUT/DELETE /center/* | O | O (본인 센터) | X |
| GET /center/* | O | O (본인 센터) | X |
| **선생님 관리** | | | |
| POST /teachers | O | O | X |
| GET /teachers, /teachers/{id} | O | O (센터 내) | O (센터 내) |
| PUT /teachers/{teacher_id} | O | O (센터 내) | X |
| DELETE /teachers/{teacher_id} | O | O (센터 내) | X |
| **상담 기록** | | | |
| POST /records/ | O | O | O |
| GET /records/{record_id} | O | O | O (담당만) |
| GET /records/ | O | O | O (담당만) |
| PUT /records/{record_id} | O | O | O (담당만) |
| DELETE /records/{record_id} | O | O | O (담당만) |
| **바우처** | | | |
| 전체 /vouchers/* | O | O | X |
| **공지사항** | | | |
| POST/PUT/DELETE /announcements/* | O | O | X |
| GET /announcements/* | O | O | O |
| **문의사항** | | | |
| 전체 /inquiries/* | O | O | O |

> **범례:** O = 접근 가능, X = 접근 불가, (조건) = 조건부 접근

> **참고:** 권한 매트릭스는 코드베이스의 `get_current_user` 의존성 및 각 엔드포인트의 비즈니스 로직을 기반으로 작성되었습니다. 일부 세부 권한은 CRUD 함수 내부에서 추가로 검증될 수 있습니다.

---

## 10. 모바일 클라이언트 (Expo)

모바일 앱(`mobile/`)은 웹 프론트엔드와 **동일한 백엔드 API**를 사용합니다. 이 섹션은 모바일 구현 특이사항과 실제 사용 중인 엔드포인트를 정리합니다.

### 환경 변수

| 변수 | 개발 | 운영 |
|------|------|------|
| `EXPO_PUBLIC_API_URL` | `https://itoktok-api-dev.gillilab.com` | `https://itoktok-api.gillilab.com` |
| `EXPO_PUBLIC_TOKEN_KEY` | `access_token` | `access_token` |

### HTTP 클라이언트 특이사항 (`mobile/lib/api/client.ts`)

- Axios 인스턴스, timeout **15초**
- Request interceptor: `expo-secure-store`에서 토큰 읽어 `Authorization: Bearer {token}` 자동 첨부
- Response interceptor: `response.data` 자동 추출 (웹과 동일)
- 401 응답 시: 토큰 삭제만 수행 — 자동 리다이렉트 없음 (Auth Context가 처리)
- 토큰 저장: 네이티브는 `expo-secure-store`(암호화), 웹은 `localStorage`

### 응답 언래핑 (`mobile/lib/api/utils.ts`)

백엔드가 `SuccessResponse` 형태(`{ data: ..., status: "ok" }`)로 감싸는 경우와 직접 반환하는 경우가 혼재하므로, `unwrapApiData()` 유틸로 통일 처리합니다.

```typescript
// data 필드가 있으면 추출, 없으면 그대로 반환
unwrapApiData(response)
```

### 모바일에서 사용 중인 엔드포인트

#### 인증 (`mobile/lib/api/users.ts`)

| Method | URL | 설명 |
|--------|-----|------|
| POST | `/auth/login` | 로그인 (form-data) |
| POST | `/signup` | 회원가입 |
| GET | `/signup/check-username?username=` | 아이디 중복 확인 |
| GET | `/users/me` | 현재 사용자 정보 |
| POST | `/api/forget-password` | 비밀번호 찾기 |

#### 사용자/선생님 관리 (`mobile/lib/api/users.ts`)

| Method | URL | 설명 |
|--------|-----|------|
| GET | `/users/teachers` | 센터 선생님 목록 |
| GET | `/users/selected-teachers` | 선택된 선생님 조회 |
| POST | `/users/selected-teachers` | 선택된 선생님 저장 |
| GET | `/users/?page=&size=&search_qry=` | 사용자 목록 (페이지네이션) |
| GET | `/users/{user_id}` | 사용자 상세 |
| POST | `/users/` | 사용자 생성 |
| PUT | `/users/{user_id}` | 사용자 수정 |
| DELETE | `/users/{user_id}` | 사용자 삭제 |

`updateSelectedTeachers` 요청 바디:
```json
{ "selected_teacher": "teacher01,teacher02" }
```

#### 내담자 관리 (`mobile/lib/api/clients.ts`)

| Method | URL | 설명 |
|--------|-----|------|
| GET | `/client/search/?search_qry=` | 내담자 검색 |
| GET | `/client/?page=&size=` | 내담자 목록 (기본 size=30) |
| GET | `/client/{id}` | 내담자 상세 |
| POST | `/client/` | 내담자 등록 |
| PUT | `/client/{id}` | 내담자 수정 |
| PUT | `/client/{id}/consultant_status/{status}` | 상담 상태 변경 |

#### 프로그램 관리 (`mobile/lib/api/programs.ts`)

| Method | URL | 설명 |
|--------|-----|------|
| GET | `/programs?page=&size=&search_qry=&teacher_username=` | 프로그램 목록 (기본 size=30) |
| GET | `/programs/{program_id}` | 프로그램 상세 |
| POST | `/programs/` | 프로그램 생성 |
| PUT | `/programs/{program_id}` | 프로그램 수정 |
| DELETE | `/programs/{program_id}` | 프로그램 삭제 |

#### 일정 관리 (`mobile/lib/api/schedules.ts`)

| Method | URL | 설명 |
|--------|-----|------|
| GET | `/schedules/calendar/daily/{year}/{month}/{day}` | 일간 캘린더 |
| GET | `/schedules/calendar/{year}/{month}/{day}` | 주간 캘린더 |
| GET | `/schedules/calendar/{year}/{month}` | 월간 캘린더 |
| GET | `/schedules/{schedule_list_id}` | 일정 인스턴스 상세 |
| POST | `/schedules` | 일정 생성 |
| PUT | `/schedules/{schedule_id}/{schedule_list_id}` | 일정 수정 |
| DELETE | `/schedules/{schedule_id}/{schedule_list_id}?update_range=single\|all` | 일정 삭제 |
| PUT | `/schedules/update-date` | 날짜 변경 (query params) |
| PUT | `/schedules/update-date-time` | 날짜/시간 변경 (query params) |

캘린더 응답 처리 — 모바일은 중첩 맵을 평탄화하여 사용합니다:
- **일간**: `{ "HH": { "MM": [ScheduleEvent, ...] } }` → `flattenDailySchedule()`로 배열 변환
- **주간/월간**: `{ "YYYY-MM-DD": { ... } }` → `flattenDayMap()`으로 날짜별 배열 변환

`repeat_days` 필드는 문자열(`"{'mon':true,'wed':true}"`) 또는 객체 형태로 올 수 있으므로 `normalizeRepeatDays()`로 정규화합니다.

#### 센터 관리 (`mobile/lib/api/center.ts`)

| Method | URL | 설명 |
|--------|-----|------|
| GET | `/center/info/{username}` | 센터 정보 조회 |
| PUT | `/center/info/{username}` | 센터 정보 수정 |

### 모바일 앱 화면 구성 (`mobile/app/`)

| 경로 | 화면 | 설명 |
|------|------|------|
| `(auth)/login` | 로그인 | JWT 발급 |
| `(auth)/signup` | 회원가입 | 센터장 등록 |
| `(auth)/forgot-password` | 비밀번호 찾기 | |
| `(tabs)/index` | 홈/대시보드 | |
| `(tabs)/schedule/` | 일정 관리 | 일간/주간/월간 캘린더 |
| `(tabs)/clients/` | 내담자 관리 | 목록/검색/상세 |
| `(tabs)/programs/` | 프로그램 관리 | |
| `(tabs)/users/` | 사용자 관리 | |
| `(tabs)/center-info` | 센터 정보 | |
| `(tabs)/my-info` | 내 정보 | |
| `(tabs)/settings` | 설정 | |

### 기술 스택

| 항목 | 버전 |
|------|------|
| Expo | ~54.0.33 |
| React Native | 0.81.5 |
| Expo Router | ~6.0.23 |
| axios | - |
| expo-secure-store | - |
| react-native-calendars | - |
