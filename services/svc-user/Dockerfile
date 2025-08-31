# --- Dev Stage ---
FROM node:20-alpine AS dev
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY services/svc-user ./services/svc-user
COPY packages ./packages
RUN pnpm install
EXPOSE 4006
CMD ["pnpm", "--filter", "svc-user", "start:dev"]

# --- Prod Stage ---
FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY services/svc-user ./services/svc-user
COPY packages ./packages
RUN pnpm install --frozen-lockfile
RUN pnpm --filter svc-user build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/services/svc-user/dist ./services/svc-user/dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/services/svc-user/package.json ./services/svc-user/package.json
EXPOSE 4006
CMD ["pnpm", "--filter", "svc-user", "start:prod"]
