# Node 24.13.0 사용
FROM node:24.13.0-slim

# pnpm 설치 및 활성화
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# 의존성 설치 (캐시 최적화)
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install

# 전체 소스 복사 (마운트 시 덮어씌워지지만 빌드 시 필요)
COPY . .

# Vite 기본 포트
EXPOSE 5173

# 외부 접속 허용을 위해 --host 0.0.0.0 설정
CMD ["pnpm", "dev", "--host", "0.0.0.0"]
