# --- Dev Stage ---
FROM node:20-alpine AS dev
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY services/svc-auth ./services/svc-auth
COPY packages ./packages
RUN pnpm install
EXPOSE 4001
CMD ["pnpm", "--filter", "svc-auth", "start:dev"]

# --- Prod Stage ---
FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY services/svc-auth ./services/svc-auth
COPY packages ./packages
RUN pnpm install --frozen-lockfile
RUN pnpm --filter svc-auth build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/services/svc-auth/dist ./services/svc-auth/dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/services/svc-auth/package.json ./services/svc-auth/package.json
EXPOSE 4001
CMD ["pnpm", "--filter", "svc-auth", "start:prod"]
