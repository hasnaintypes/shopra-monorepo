# --- Dev Stage ---
FROM node:20-alpine AS dev
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY services/api-gateway ./services/api-gateway
COPY packages ./packages
RUN pnpm install
EXPOSE 4000
CMD ["pnpm", "--filter", "api-gateway", "start:dev"]

# --- Prod Stage ---
FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY services/api-gateway ./services/api-gateway
COPY packages ./packages
RUN pnpm install --frozen-lockfile
RUN pnpm --filter api-gateway build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/services/api-gateway/dist ./services/api-gateway/dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/services/api-gateway/package.json ./services/api-gateway/package.json
EXPOSE 4000
CMD ["pnpm", "--filter", "api-gateway", "start:prod"]
