# ITokTok Mobile (Expo)

Expo 기반 모바일 앱입니다. 웹/백엔드와 동일하게 로컬에서는 3000번 포트를 사용합니다.

## 환경 변수

- 개발: `mobile/.env`
- 운영: `mobile/.env.production`

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_TOKEN_KEY=access_token
```

## 실행

```bash
cd mobile
pnpm install
pnpm start
```

## 빌드 환경

`eas.json`에 환경별 API URL이 정의되어 있습니다.
