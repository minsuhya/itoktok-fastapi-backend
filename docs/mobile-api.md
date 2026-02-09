# 모바일 API 정의서 (Expo)

모바일 앱은 웹 프론트와 동일한 백엔드 API를 사용한다. 이 문서는 모바일 구현에 필요한 핵심 엔드포인트를 요약한다.

## 환경 변수

- `EXPO_PUBLIC_API_URL`
- `EXPO_PUBLIC_TOKEN_KEY` (기본값: `access_token`)

## 인증

### 로그인
- `POST /auth/login`
- `Content-Type: application/x-www-form-urlencoded`
- Body: `username`, `password`
- 응답: `access_token`

### 사용자 정보
- `GET /users/me`
- Header: `Authorization: Bearer {token}`

## 일정

### 일간 일정
- `GET /schedules/calendar/daily/{year}/{month}/{day}`
- Query: `selected_teachers` (선택)

### 월간/주간 캘린더
- `GET /schedules/calendar/{year}/{month}`
- `GET /schedules/calendar/{year}/{month}/{day}`

### 일정 생성
- `POST /schedules`
- 주요 필드:
  - `teacher_username`, `client_id`, `client_name`
  - `start_date`, `finish_date`, `start_time`, `finish_time`
  - `repeat_type`, `repeat_days`, `memo`, `program_id`

### 일정 수정/삭제
- `PUT /schedules/{schedule_id}/{schedule_list_id}`
- `DELETE /schedules/{schedule_id}/{schedule_list_id}`

## 내담자

### 목록/검색
- `GET /client/` (page, size)
- `GET /client/search/` (search_qry)

### 상세
- `GET /client/{info_id}`

## 상담사/프로그램

- `GET /users/teachers`
- `GET /programs`

## 응답 규칙

- API 응답은 `SuccessResponse` 형태이며, 모바일에서는 `response.data`를 그대로 사용한다.
