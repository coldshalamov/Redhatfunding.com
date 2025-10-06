# Stage 1: build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml* package-lock.json* .npmrc* ./
RUN if [ -f pnpm-lock.yaml ]; then npm install -g pnpm && pnpm install; elif [ -f package-lock.json ]; then npm ci; else npm install; fi
COPY . .
RUN if [ -f pnpm-lock.yaml ]; then pnpm build; else npm run build; fi

# Stage 2: serve
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
