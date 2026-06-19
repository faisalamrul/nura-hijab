FROM node:20-alpine AS base
RUN npm install -g pnpm@10.28.2

# ── deps ────────────────────────────────────────────────────────────────────
FROM base AS deps
WORKDIR /app

COPY pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./
COPY package.json ./

COPY packages/ui/package.json ./packages/ui/package.json
COPY apps/payment/package.json ./apps/payment/package.json

RUN pnpm install --frozen-lockfile

# ── build ────────────────────────────────────────────────────────────────────
FROM base AS build
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/ui/node_modules ./packages/ui/node_modules
COPY --from=deps /app/apps/payment/node_modules ./apps/payment/node_modules

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json tsconfig.base.json ./
COPY packages/ui ./packages/ui
COPY apps/payment ./apps/payment

RUN pnpm --filter @repo/ui build
RUN pnpm --filter payment build

# ── runner ───────────────────────────────────────────────────────────────────
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/payment/node_modules ./apps/payment/node_modules
COPY --from=build /app/apps/payment/.next ./apps/payment/.next
COPY --from=build /app/apps/payment/public ./apps/payment/public
COPY --from=build /app/apps/payment/package.json ./apps/payment/package.json
COPY --from=build /app/packages/ui/dist ./packages/ui/dist
COPY --from=build /app/packages/ui/package.json ./packages/ui/package.json
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/pnpm-workspace.yaml ./pnpm-workspace.yaml

WORKDIR /app/apps/payment

EXPOSE 3000

CMD ["node", "node_modules/next/dist/bin/next", "start", "--port", "3000"]
