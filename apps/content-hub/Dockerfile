FROM node:20-alpine AS base
RUN npm install -g pnpm@10.28.2

# ── deps ────────────────────────────────────────────────────────────────────
FROM base AS deps
WORKDIR /app

COPY pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./
COPY package.json ./

COPY packages/ui/package.json ./packages/ui/package.json
COPY apps/content-hub/package.json ./apps/content-hub/package.json

RUN pnpm install --frozen-lockfile

# ── build ────────────────────────────────────────────────────────────────────
FROM base AS build
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/ui/node_modules ./packages/ui/node_modules
COPY --from=deps /app/apps/content-hub/node_modules ./apps/content-hub/node_modules

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json tsconfig.base.json ./
COPY packages/ui ./packages/ui
COPY apps/content-hub ./apps/content-hub

RUN pnpm --filter @repo/ui build
RUN pnpm --filter content-hub build

# ── runner ───────────────────────────────────────────────────────────────────
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/content-hub/node_modules ./apps/content-hub/node_modules
COPY --from=build /app/apps/content-hub/dist ./apps/content-hub/dist
COPY --from=build /app/apps/content-hub/package.json ./apps/content-hub/package.json
COPY --from=build /app/package.json ./package.json

EXPOSE 4321

CMD ["/app/apps/content-hub/node_modules/.bin/astro", "preview", "--root", "apps/content-hub", "--port", "4321", "--host"]
