# --- Dev Stage ---
FROM node:20-alpine AS dev
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY services/svc-product ./services/svc-product
COPY packages ./packages
RUN pnpm install
EXPOSE 4002
CMD ["pnpm", "--filter", "svc-product", "start:dev"]

# --- Prod Stage ---
FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY services/svc-product ./services/svc-product
COPY packages ./packages
RUN pnpm install --frozen-lockfile
RUN pnpm --filter svc-product build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/services/svc-product/dist ./services/svc-product/dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/services/svc-product/package.json ./services/svc-product/package.json
EXPOSE 4002
CMD ["pnpm", "--filter", "svc-product", "start:prod"]
