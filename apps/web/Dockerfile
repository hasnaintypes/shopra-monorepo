FROM node:20-alpine AS dev
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages ./packages
COPY apps/web ./apps/web

RUN pnpm install

EXPOSE 3000
CMD ["pnpm", "--filter", "web", "dev"]

FROM node:20-alpine AS prod
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages ./packages
COPY apps/web ./apps/web

RUN pnpm install --frozen-lockfile
RUN pnpm --filter web build

FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=prod /app/apps/web/.next ./apps/web/.next
COPY --from=prod /app/apps/web/public ./apps/web/public
COPY --from=prod /app/node_modules ./node_modules
COPY --from=prod /app/apps/web/package.json ./apps/web/package.json

EXPOSE 3000
CMD ["pnpm", "--filter", "web", "start"]
