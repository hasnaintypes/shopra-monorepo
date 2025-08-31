FROM node:20-alpine AS dev
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages ./packages
COPY apps/admin-panel ./apps/admin-panel

RUN pnpm install

EXPOSE 3002
CMD ["pnpm", "--filter", "admin-panel", "dev"]

FROM node:20-alpine AS prod
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages ./packages
COPY apps/admin-panel ./apps/admin-panel

RUN pnpm install --frozen-lockfile
RUN pnpm --filter admin-panel build

FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=prod /app/apps/admin-panel/.next ./apps/admin-panel/.next
COPY --from=prod /app/apps/admin-panel/public ./apps/admin-panel/public
COPY --from=prod /app/node_modules ./node_modules
COPY --from=prod /app/apps/admin-panel/package.json ./apps/admin-panel/package.json

EXPOSE 3002
CMD ["pnpm", "--filter", "admin-panel", "start"]
