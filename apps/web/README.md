# `@dnca/web`

Next.js 15 (App Router) frontend for the Fokker 70/100 Flight Crew Training Suite.

## Status

Sprint 2. `/pilots` and `/pilots/[id]` now read from `@dnca/api` over HTTP when configured, with a deterministic fixture fallback for unconfigured environments (CI, Vercel preview without API yet). A source badge on each page surfaces whether live data or fixtures are in use.

## API wiring (Sprint 2 final piece)

Two server-only env vars control wiring:

| Var                | Required?                           | Purpose                                                                                                 |
| ------------------ | ----------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `API_BASE_URL`     | Optional                            | Base URL of `@dnca/api`, e.g. `http://localhost:3001`. Falls back to fixtures when unset.               |
| `DEMO_OPERATOR_ID` | Required when `API_BASE_URL` is set | Operator UUID sent as `x-demo-operator-id` until WorkOS JWT verification flips on (Sprint 3 follow-on). |

Local dev with the live API:

```bash
# terminal 1 — Postgres
docker compose -f infra/docker-compose.yml up -d

# terminal 2 — API
DATABASE_URL='postgres://app_runtime:dev@localhost:5432/fokker_dev' \
  pnpm --filter @dnca/api dev

# terminal 3 — web
API_BASE_URL=http://localhost:3001 \
  DEMO_OPERATOR_ID=22222222-2222-2222-2222-222222222222 \
  pnpm --filter @dnca/web dev
```

Without `API_BASE_URL`, the web app still renders fully via `@dnca/domain` fixtures — useful for design work and Vercel preview builds.

## Local development

```bash
pnpm install
pnpm --filter @dnca/web dev
```

Open <http://localhost:3000>.

## Build

```bash
pnpm --filter @dnca/web build
```

`next build` performs a full type-check; CI runs it as part of the typecheck job.

## What's next

- Pilot list + currency tracker (Sprint 2 — requires backend wiring; until then, fixture data via `@dnca/db` seed)
- Session logging + per-exercise CBTA grading UI (Sprint 4)
- KCAA submission flow + document version diff (Sprint 3)
- AI assessment generator wired through `@dnca/prompts` and a server-side proxy (Sprint 4)
- Operator branding override at runtime (replace navy/amber defaults via `OperatorConfig.branding`)
