# 작업 기록 요약 (ITokTok)

이 문서는 최근 작업 내역을 추후 분석/설계/개발에 활용할 수 있도록 요약한 기록이다.
기존 문서 `docs/feature-map.md`, `docs/refactor-plan.md`와 연계하여 참고한다.

## 1) 범위/전제
- 대상: 웹+백엔드 (모바일은 Expo 신규 구축 예정으로 현 코드베이스 제외)
- 실행 환경: `http://localhost:3000`(backend), `http://localhost:5173`(frontend)
- 테스트 계정: `rupi / rupi@@1234`

## 2) 핵심 이슈 및 해결

### A. 일정 삭제 후 CORS/500 오류
- 현상
  - 삭제 직후 `/schedules/{schedule_list_id}` 단건 조회가 500 → 브라우저에서는 CORS 오류로 표시
- 원인
  - `backend/app/crud/schedule.py:get_schedule()`에서 결과가 `None`인데 속성 접근
- 해결
  - `get_schedule()`에서 `result`가 없으면 즉시 `None` 반환
  - 프론트는 404 시 폼을 리셋하고 닫아 불필요 요청/모달 방지

### B. 상담 신규 등록폼 시작시간 미설정
- 현상
  - 신규 상담 등록 시 시작시간 기본값이 비어있음
- 원인
  - `ScheduleFormSliding.vue`의 `scheduleTime` 기본값 문자열에 `}` 오타
- 해결
  - 기본값 문자열 오타 수정

### C. API 응답 `response.data` 혼용
- 현상
  - axios 인터셉터가 `response.data`를 반환하는데 뷰에서 추가 `.data` 접근
- 해결
- API 레이어에 `unwrapResponseData`를 적용하고 웹 뷰의 `.data` 중복 접근 제거

### D. yup `when` 문법 경고 대응
- 현상
  - Biome `noThenProperty` 경고
- 해결
  - 함수형 `when`으로 변환

## 3) 변경 파일 목록

### Backend
- `backend/app/crud/schedule.py`
  - `get_schedule()`에서 `None` 체크 추가 (삭제 후 단건 조회 500 방지)

### Frontend (웹)
- `frontend/src/views/ScheduleFormSliding.vue`
  - `scheduleTime` 기본값 오타 수정
  - 404 시 폼 리셋/닫기 처리
  - 삭제 시 `props.scheduleId` 우선 사용
  - yup `when` 문법 함수형 변경
- `frontend/src/views/ProgramFormSliding.vue`
  - yup `when` 문법 함수형 변경
- `frontend/src/api/user.js`, `frontend/src/api/client.js`, `frontend/src/api/program.js`, `frontend/src/api/schedule.js`
  - `unwrapResponseData` 도입 및 반환 구조 정리
- `frontend/src/views/ProgramFormSliding.vue`
- `frontend/src/components/TeacherList.vue`
- `frontend/src/views/DailyViewSliding.vue`
- `frontend/src/views/MonthlyView.vue`
- `frontend/src/views/WeeklyView.vue`
- `frontend/src/hooks/auth.js`
- `frontend/src/views/ClientFormSliding.vue`
  - `response.data` 중복 접근 제거


## 4) 테스트/E2E 결과

### 일정 플로우 (주간)
- 로그인: 성공
- 생성: 테스트내담자C / 상담사1 / 테스트프로그램-스케줄 / 10:00–10:50
  - 등록 모달 확인: “상담일정 정보가 등록되었습니다.”
- 수정: 일정 카드 클릭 → 메모 변경 → 확인 다이얼로그 승인
  - 수정 모달 확인: “상담일정 정보가 수정되었습니다.”
- 삭제: 일정 카드 삭제 확인
  - 삭제 200 OK
  - 삭제 직후 단건 조회는 404로 떨어짐(정상)
  - 기존 500/CORS 오류 재발 없음

### 프론트 린트
- `pnpm lint` 실행
  - `dist` 제외 후 통과

## 5) 남은 이슈/리스크
- Python LSP(`basedpyright`) 미설치로 백엔드 정적 진단 미완료

## 6) 후속 작업 제안 (분석/설계/개발)
1. 일정 도메인 모듈화 및 캘린더 유틸 분리(리팩터 플랜 Phase 6)
2. 권한/인증 적용 누락 API 최종 점검(리팩터 플랜 Phase 1)
