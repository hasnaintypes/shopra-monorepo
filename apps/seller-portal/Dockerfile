FROM node:20-alpine AS dev
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages ./packages
COPY apps/seller-portal ./apps/seller-portal

RUN pnpm install

EXPOSE 3001
CMD ["pnpm", "--filter", "seller-portal", "dev"]

FROM node:20-alpine AS prod
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages ./packages
COPY apps/seller-portal ./apps/seller-portal

RUN pnpm install --frozen-lockfile
RUN pnpm --filter seller-portal build

FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=prod /app/apps/seller-portal/.next ./apps/seller-portal/.next
COPY --from=prod /app/apps/seller-portal/public ./apps/seller-portal/public
COPY --from=prod /app/node_modules ./node_modules
COPY --from=prod /app/apps/seller-portal/package.json ./apps/seller-portal/package.json

EXPOSE 3001
CMD ["pnpm", "--filter", "seller-portal", "start"]
