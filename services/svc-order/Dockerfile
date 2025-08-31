# --- Dev Stage ---
FROM node:20-alpine AS dev
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY services/svc-order ./services/svc-order
COPY packages ./packages
RUN pnpm install
EXPOSE 4003
CMD ["pnpm", "--filter", "svc-order", "start:dev"]

# --- Prod Stage ---
FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY services/svc-order ./services/svc-order
COPY packages ./packages
RUN pnpm install --frozen-lockfile
RUN pnpm --filter svc-order build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/services/svc-order/dist ./services/svc-order/dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/services/svc-order/package.json ./services/svc-order/package.json
EXPOSE 4003
CMD ["pnpm", "--filter", "svc-order", "start:prod"]
