# --- Dev Stage ---
FROM node:20-alpine AS dev
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY services/svc-recommendation ./services/svc-recommendation
COPY packages ./packages
RUN pnpm install
EXPOSE 4004
CMD ["pnpm", "--filter", "svc-recommendation", "start:dev"]

# --- Prod Stage ---
FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY services/svc-recommendation ./services/svc-recommendation
COPY packages ./packages
RUN pnpm install --frozen-lockfile
RUN pnpm --filter svc-recommendation build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/services/svc-recommendation/dist ./services/svc-recommendation/dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/services/svc-recommendation/package.json ./services/svc-recommendation/package.json
EXPOSE 4004
CMD ["pnpm", "--filter", "svc-recommendation", "start:prod"]
