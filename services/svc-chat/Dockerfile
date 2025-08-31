# --- Dev Stage ---
FROM node:20-alpine AS dev
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY services/svc-chat ./services/svc-chat
COPY packages ./packages
RUN pnpm install
EXPOSE 4005
CMD ["pnpm", "--filter", "svc-chat", "start:dev"]

# --- Prod Stage ---
FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY services/svc-chat ./services/svc-chat
COPY packages ./packages
RUN pnpm install --frozen-lockfile
RUN pnpm --filter svc-chat build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/services/svc-chat/dist ./services/svc-chat/dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/services/svc-chat/package.json ./services/svc-chat/package.json
EXPOSE 4005
CMD ["pnpm", "--filter", "svc-chat", "start:prod"]
