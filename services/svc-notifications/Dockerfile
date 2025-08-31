# --- Dev Stage ---
FROM node:20-alpine AS dev
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY services/svc-notifications ./services/svc-notifications
COPY packages ./packages
RUN pnpm install
EXPOSE 4007
CMD ["pnpm", "--filter", "svc-notifications", "start:dev"]

# --- Prod Stage ---
FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY services/svc-notifications ./services/svc-notifications
COPY packages ./packages
RUN pnpm install --frozen-lockfile
RUN pnpm --filter svc-notifications build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/services/svc-notifications/dist ./services/svc-notifications/dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/services/svc-notifications/package.json ./services/svc-notifications/package.json
EXPOSE 4007
CMD ["pnpm", "--filter", "svc-notifications", "start:prod"]
