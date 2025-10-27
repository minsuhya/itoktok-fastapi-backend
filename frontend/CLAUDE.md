# CLAUDE.md

이 파일은 이 저장소의 코드 작업 시 Claude Code (claude.ai/code)에 대한 가이드를 제공합니다.

## 프로젝트 개요

ITokTok은 Vue 3, Vite, Tailwind CSS로 구축된 상담센터 관리 시스템입니다. 이 애플리케이션은 역할 기반 접근 제어(슈퍼유저, 센터 관리자, 센터 교사)를 통해 내담자, 상담사(사용자), 프로그램 및 일정을 관리합니다.

## 개발 명령어

### 패키지 매니저
이 프로젝트는 `pnpm`을 패키지 매니저로 사용합니다.

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행 (0.0.0.0에 바인딩)
pnpm dev

# 프로덕션 빌드
pnpm build

# 프로덕션 빌드 미리보기
pnpm preview

# 자동 수정 포함 린트
pnpm lint

# Prettier로 코드 포맷팅
pnpm format
```

## 아키텍처

### 인증 및 권한

- **토큰 저장**: JWT 토큰은 `VITE_TOKEN_KEY` 환경 변수의 키를 사용하여 localStorage에 저장됩니다
- **인증 흐름**:
  - `useAuth()` 훅(`src/hooks/auth.js:10`)을 통한 로그인, `/auth/login` 엔드포인트 호출
  - axios 인터셉터(`src/api/interceptors.js:14`)를 통해 모든 요청에 토큰 자동 첨부
  - `/users/me`를 통해 사용자 정보를 가져와 Pinia `userStore`에 저장
  - 401 응답 시 자동 로그아웃 및 `/login`으로 리다이렉트
- **라우트 가드**: `router.beforeEach`가 `meta.requiresAuth`를 확인하고 `isLogin()` 유틸리티로 토큰 검증
- **사용자 역할**:
  - `admin`: 슈퍼유저 (is_superuser == 1)
  - `center`: 센터 관리자 (user_type == 1)
  - `teacher`: 센터 교사 (기본값)

### 라우팅 구조

라우트는 `src/router/`에서 세 개의 모듈로 구성됩니다:

- **`admin/index.js`**: `/admin` 경로 하위의 보호된 라우트로, 대시보드, 내담자, 상담사, 일정(주간/월간), 프로그램의 중첩 자식 포함
- **`common/index.js`**: 리다이렉트 처리 및 404 not-found 페이지를 위한 유틸리티 라우트
- **`test/index.js`**: 테스트/개발 라우트 (상세 검토 안 함)

모든 admin 라우트는 Header/Left Sidebar/Footer 레이아웃 구조를 제공하는 `LayoutView.vue` 부모 컴포넌트를 공유합니다.

### 상태 관리 (Pinia Stores)

`src/stores/`에 위치:

- **`auth.js` (userStore)**:
  - 사용자 인증 상태, 사용자 객체 및 역할 관리
  - `saveState()`/`loadState()` 메서드로 localStorage에 영속화
  - `main.js:44`의 `userStore.loadState()`를 통해 앱 마운트 시 초기화
  - 로그아웃 모달 표시 처리

- **`calendarStore.js`**: 캘린더 뷰에 대한 선택된 날짜 관리

- **`teacherStore.js`**: 교사 선택 상태 관리로 추정 (상세 검토 안 함)

### API 레이어

`src/api/`의 모든 API 모듈은 중앙 집중식 구성으로 axios를 사용합니다:

- **Base URL**: `VITE_API_BASE_URL` 환경 변수에서 설정
- **인터셉터** (`src/api/interceptors.js`):
  - Request: `Authorization: Bearer {token}` 헤더 자동 추가
  - Response: axios 응답에서 데이터 추출, 401(로그아웃 + 리다이렉트) 및 500 오류 처리

리소스별 API 모듈:
- `user.js`: 사용자 CRUD, 인증 엔드포인트, 교사 관리
- `client.js`: 내담자 관리
- `program.js`: 프로그램 관리
- `schedule.js`: 일정 관리
- `center.js`: 센터 관리

### 폼 검증

Yup 스키마 검증과 함께 VeeValidate 라이브러리 사용:

- `@vee-validate/rules`의 모든 검증 규칙이 `main.js:19`에 전역 등록됨
- `main.js:24-35`에서 일반 규칙(required, min, email)에 대한 사용자 정의 메시지 구성
- 폼 컴포넌트는 VeeValidate의 `Field`, `Form`, `ErrorMessage` 컴포넌트 사용

### UI 패턴

- **레이아웃**: `LayoutView.vue`를 통한 3섹션 레이아웃 (Header, Left Sidebar, Main Content, Footer)
- **모달**:
  - Vue의 `provide/inject`를 사용한 전역 모달 시스템 (`GlobalModal.vue`)
  - 모달 상태 관리를 위한 Composable `useModal()` 훅
  - CRUD 작업을 위한 슬라이딩 패널 폼 (접미사 `FormSliding`)
- **폼**: 표준화된 폼 렌더링을 위한 재사용 가능한 `DynamicForm.vue` 컴포넌트
- **스타일링**: 슬라이드 인/아웃 효과를 위한 커스텀 애니메이션이 포함된 Tailwind CSS (`tailwind.config.js:8-21`)
- **아이콘**: Heroicons Vue 라이브러리

### Navigation Composable

`useGlobalNavigation()` composable(위치 TBD)은 컴포넌트 간에 공유되는 내비게이션 로직을 제공할 것으로 추정됩니다.

## 환경 설정

두 개의 환경 파일이 API 엔드포인트를 제어합니다:

- `.env.development`: `http://localhost:2080` 지정
- `.env.production`: `http://itoktok-api.gillilab.com` 지정

필수 환경 변수:
- `VITE_TOKEN_KEY`: JWT 토큰을 위한 localStorage 키
- `VITE_API_BASE_URL`: 백엔드 API 기본 URL

## 주요 기술적 결정

1. **경로 별칭**: `@` 별칭이 `src/` 디렉토리로 해석되도록 구성
2. **라우터 모드**: HTML5 History 모드 사용 (`createWebHistory`)
3. **상태 영속화**: 세션 연속성을 위해 사용자 인증 상태를 localStorage에 영속화
4. **오류 처리**: axios 인터셉터에서 중앙 집중화, 401 시 자동 로그아웃
5. **코드 스플리팅**: 최적의 번들 크기를 위해 모든 라우트 컴포넌트에 동적 임포트 사용
