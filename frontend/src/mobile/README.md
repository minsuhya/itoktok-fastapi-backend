# 모바일 버전 구현

이 디렉토리는 서비스의 모바일 버전 구현을 위한 파일들을 포함합니다.

## 디렉토리 구조

```
mobile/
├── components/          # 모바일 전용 컴포넌트
│   ├── MobileHeader.vue      # 공통 헤더 컴포넌트
│   ├── MobileBottomNav.vue   # 하단 네비게이션 바
│   └── MobileLayout.vue      # 모바일 레이아웃 래퍼
├── views/               # 모바일 전용 뷰 컴포넌트
│   ├── HomeView.vue           # 홈 화면 (달력/목록)
│   ├── ScheduleView.vue       # 일정 화면
│   ├── ScheduleFormView.vue   # 일정 등록/수정
│   ├── ScheduleListView.vue   # 일정 목록
│   ├── SearchView.vue         # 검색 화면
│   ├── ClientListView.vue      # 이용자 조회
│   ├── ClientFormView.vue     # 이용자 등록/수정
│   ├── ClientDetailView.vue   # 이용자 상세
│   ├── TreatmentStatusView.vue # 치료 현황
│   ├── TreatmentRecordView.vue # 치료 기록
│   ├── SettingsView.vue       # 설정
│   ├── ChangePasswordView.vue # 비밀번호 변경
│   ├── ChangeProfileView.vue  # 프로필 변경
│   └── NotificationsView.vue # 알림
└── README.md            # 이 파일
```

## 주요 기능

### 공통 컴포넌트

1. **MobileHeader**: 파란색 헤더 바
   - 뒤로가기, 메뉴, 검색, 알림, 플러스, 저장, 필터 아이콘 지원
   - 제목 표시

2. **MobileBottomNav**: 하단 네비게이션 바
   - 홈, 달력, 검색, 프로필 탭
   - 활성 탭 하이라이트

3. **MobileLayout**: 모바일 레이아웃 래퍼
   - 헤더와 하단 네비게이션 포함
   - 슬라이딩 메뉴 지원
   - 공통 레이아웃 관리

### 주요 화면

1. **일정 관리**
   - 홈 화면: 달력과 일정 목록
   - 일정 등록/수정: 폼 기반 입력
   - 일정 목록: 특정 날짜의 일정 목록

2. **이용자 관리**
   - 이용자 조회: 검색 및 목록
   - 이용자 등록/수정: 폼 기반 입력
   - 이용자 상세: 상세 정보 및 치료 현황 링크

3. **치료 관리**
   - 치료 현황: 치료 기록 목록
   - 치료 기록: 상세 정보

4. **설정**
   - 설정 메뉴
   - 비밀번호 변경
   - 프로필 변경
   - 알림 목록

## 라우팅

모바일 라우트는 `/mobile` 경로로 시작하며, `router/mobile/index.js`에 정의되어 있습니다.

주요 라우트:
- `/mobile` - 홈 화면
- `/mobile/schedule` - 일정 화면
- `/mobile/schedule/form` - 일정 등록
- `/mobile/clients` - 이용자 조회
- `/mobile/settings` - 설정

## 사용 방법

모바일 화면에 접근하려면 `/mobile` 경로로 이동하면 됩니다.

예시:
```javascript
router.push('/mobile')
router.push({ name: 'MobileHome' })
```

## 스타일링

Tailwind CSS를 사용하여 모바일 최적화된 반응형 디자인을 구현했습니다.

- 모바일 화면 크기에 최적화된 레이아웃
- 터치 친화적인 버튼 크기
- 카드 기반 UI 디자인
- 파란색 테마 (#3B82F6)

## 백엔드 연동

기존 백엔드 API를 그대로 사용합니다:
- `/api/client` - 이용자 관련 API
- `/api/schedule` - 일정 관련 API
- `/api/user` - 사용자 관련 API

## 향후 개선 사항

1. 실제 API 연동 완료 (일부 화면은 임시 데이터 사용)
2. 알림 기능 구현
3. 치료 기록 API 연동
4. 오프라인 지원
5. 푸시 알림

