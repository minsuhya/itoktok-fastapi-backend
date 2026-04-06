# 환경 설정 파일 일관성 정리 설계

## 목적

API, Frontend, Mobile 3개 서비스의 환경 설정 파일을 일관된 패턴으로 정리한다. 개발(로컬)과 운영(AWS) 환경을 명확히 분리하고, `.env.example` 템플릿으로 git 관리한다.

## 현재 상태

| 서비스 | 개발 | 운영 | 문제점 |
|--------|------|------|--------|
| API | `.env` (루트) | `.env` (동일 파일) | 환경 구분 없음, 주석으로 토글 |
| Frontend | `frontend/.env.development` | `frontend/.env.production` | `//` 주석 문법 오류 |
| Mobile | `mobile/.env` | `mobile/.env.production` | 정상 (Expo 기본) |

**추가 문제:**
- 변수명 불일치: `VITE_API_BASE_URL` vs `EXPO_PUBLIC_API_URL`
- `.env` 파일들이 `.gitignore`에 불완전하게 등록
- API 환경 변수에 민감 정보(DB 비밀번호, SECRET_KEY)가 git에 노출 가능

## 설계

### 파일 구조

```
변경 후:
├── .env.example                  # API 환경 변수 템플릿 (git 추적)
├── .env.development              # API 개발 (git 제외)
├── .env.production               # API 운영 (git 제외)
├── frontend/.env.example         # Frontend 템플릿 (git 추적)
├── frontend/.env.development     # Frontend 개발 (git 제외)
├── frontend/.env.production      # Frontend 운영 (git 제외)
├── mobile/.env.example           # Mobile 템플릿 (git 추적)
├── mobile/.env                   # Mobile 개발 (git 제외, Expo 기본)
├── mobile/.env.production        # Mobile 운영 (git 제외)
```

### 네이밍 규칙

- API: 접두사 없음 (FastAPI 환경 변수)
- Frontend: `VITE_` 접두사 (Vite 규칙)
- Mobile: `EXPO_PUBLIC_` 접두사 (Expo 규칙)
- 접두사 뒤 이름 통일: `API_URL`, `TOKEN_KEY`

### 각 서비스 환경 변수

**API (.env.example):**
```bash
# Database
CONN_URL=mysql+pymysql://user:password@host:port/database

# JWT
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

**Frontend (frontend/.env.example):**
```bash
VITE_API_URL=http://localhost:3000
VITE_TOKEN_KEY=access_token
```

변경: `VITE_API_BASE_URL` → `VITE_API_URL`

**Mobile (mobile/.env.example):**
```bash
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_TOKEN_KEY=access_token
```

변경 없음.

### 환경별 값

| 변수 | 개발 | 운영 |
|------|------|------|
| API `CONN_URL` | AWS RDS 개발 DB | AWS RDS 운영 DB |
| API `SECRET_KEY` | 개발용 키 | 별도 운영 키 |
| Frontend `VITE_API_URL` | `http://localhost:3000` | `https://itoktok-api.gillilab.com` |
| Mobile `EXPO_PUBLIC_API_URL` | `http://localhost:3000` | `https://itoktok-api.gillilab.com` |

### Docker Compose 연동

**docker-compose.yml (운영):**
```yaml
api:
  env_file: ./.env.production
```

**docker-compose.override.yml (로컬):**
```yaml
api:
  env_file: ./.env.development
```

Frontend/Mobile은 컨테이너 내부에서 자체 환경 파일을 로드하므로 Docker `env_file` 불필요:
- Vite: `--mode development` 기본 → `frontend/.env.development` 자동 로드
- Expo: `.env` 기본 로드

### .gitignore 업데이트

추가할 항목:
```
# 환경 설정 파일
.env.development
.env.production
frontend/.env.development
frontend/.env.production
mobile/.env
mobile/.env.production
```

기존 `.env` 항목은 유지 (API 레거시 `.env` 방지).

### Frontend 코드 변경

`VITE_API_BASE_URL` → `VITE_API_URL` 리네이밍:
- `frontend/.env.development` 내 변수명 변경
- `frontend/.env.production` 내 변수명 변경
- 소스 코드에서 `import.meta.env.VITE_API_BASE_URL`을 참조하는 모든 곳을 `import.meta.env.VITE_API_URL`로 변경

### Frontend .env.development 주석 수정

현재 `//` 주석 → `#` 주석으로 수정 (`.env` 파일은 `#`만 지원)

## 구현 범위

1. `.env.example` 3개 생성 (API, Frontend, Mobile)
2. `.env` → `.env.development` + `.env.production` 분리 (API)
3. `frontend/.env.development` 변수명 변경 + 주석 수정
4. `frontend/.env.production` 변수명 변경
5. Frontend 소스 코드 `VITE_API_BASE_URL` → `VITE_API_URL` 리네이밍
6. `mobile/.env` 유지 (Expo 기본), `mobile/.env.example` 생성
7. `docker-compose.yml` env_file 변경
8. `docker-compose.override.yml` env_file 추가
9. `.gitignore` 업데이트
10. 기존 `.env` (루트) 삭제, git에서 제거
11. 기존 `frontend/.env.development`, `frontend/.env.production` git에서 제거
12. 기존 `mobile/.env`, `mobile/.env.production` git에서 제거
13. CLAUDE.md 환경 변수 섹션 업데이트
