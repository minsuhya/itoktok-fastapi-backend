FROM node:24.13.0-slim

# 터널링(ngrok) 및 프로세스 관리에 필요한 패키지 설치
RUN apt-get update && apt-get install -y procps && rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install

COPY . .

# Expo Metro Bundler 포트
EXPOSE 8081

# --clear 옵션을 포함하여 실행
CMD ["pnpm", "expo", "start", "--clear"]
