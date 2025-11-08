# 모바일 버전 운영 배포 이슈 해결 가이드

## 문제 현상
- 로컬에서는 정상 작동
- 운영 서버에서 `/mobile/login` 후 일정 페이지 이동 시 화면이 출력되지 않음

## 원인 분석

### 1. API 응답 구조 불일치 (주요 원인)
**문제**: `interceptors.js`에서 이미 `response.data`를 반환하는데, 모바일 뷰에서 `response.data`를 또 접근하려고 함

**위치**: 
- `src/api/interceptors.js:31` - `return responseData` (이미 data 추출됨)
- `src/mobile/views/HomeView.vue:168` - `response.data` 접근 (중복)
- `src/mobile/views/ScheduleView.vue:204` - `response.data` 접근 (중복)

### 2. 에러 처리 부족
- API 호출 실패 시 빈 화면만 표시
- 사용자에게 에러 알림 없음
- 콘솔 에러만 출력

### 3. teacherStore 초기화 문제
- `getMonthlyCalendar`에서 `teacherStore.selectedTeachers` 사용
- 모바일에서 store가 초기화되지 않았을 수 있음

## 해결 방법

### 해결책 1: API 응답 구조 수정 (필수)

모바일 뷰에서 API 응답을 직접 사용하도록 수정:

```javascript
// 수정 전
const response = await getMonthlyCalendar(...)
schedules.value = response.data || []

// 수정 후
const response = await getMonthlyCalendar(...)
schedules.value = response || []
```

### 해결책 2: 에러 처리 강화

로딩 상태와 에러 메시지를 추가하여 사용자에게 피드백 제공.

### 해결책 3: teacherStore 초기화

모바일 뷰에서 teacherStore를 초기화하거나 빈 배열 처리.

## 적용 순서

1. API 응답 구조 수정 (가장 중요)
2. 에러 처리 추가
3. teacherStore 초기화 확인

