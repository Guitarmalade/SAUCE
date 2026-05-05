# SAUCE

SAUCE is Guitarmalade's student-first learning platform for practice, progression, and accountability.

Canonical engineering spec: [ENGINEERING_SPEC.md](/Users/chrisschreiner/sauce/ENGINEERING_SPEC.md)

Version 1 focuses on the student experience:

- authentication and free vs paid access
- onboarding around goals and chosen material
- curriculum browsing across the Guitarmalade core areas
- exercise viewing and guided practice
- practice timer, notes, BPM, and confidence logging
- progress tracking with locked sequential advancement

The architecture leaves room for version 2 teacher workflows without forcing them into the first release.

## Repository shape

```text
apps/
  api/          Fastify API
  web/          Next.js student app
packages/
  config/       shared tooling config
  curriculum/   level, area, and exercise definitions
  database/     Prisma schema and database helpers
  domain/       core product entities and business rules
  ui/           shared UI primitives and design tokens
  validation/   shared request/response validation
docs/
  architecture/ system overview
  decisions/    architecture decision records
  product/      domain and product model
```

## Getting started

1. Install `pnpm`.
2. Run `pnpm install`.
3. Copy `.env.example` to `.env`.
4. Start local services such as Postgres.
5. Run `pnpm dev`.

## Current implemented slice

The repo now includes a first real product slice for version 1:

- shared domain types for student onboarding, access control, dashboard summaries, and practice logs
- shared curriculum data for the level 1 student journey
- API endpoints for student profile, dashboard, curriculum roadmap, and practice log persistence
- Prisma-backed persistence foundations with in-memory fallback when Postgres is unavailable
- web flows for onboarding, curriculum browsing, dashboard review, and practice logging
- a living execution checklist in `docs/product/execution-checklist.md`

## Agent browser debugging

Chrome DevTools MCP and the repo-local CDP helper are wired for agent debugging and manual browser inspection.

See `docs/agents/chrome-devtools.md` for the local Chrome launcher, CDP helper scripts, and Codex MCP setup.

## Product direction

Phase 1:

- auth
- onboarding
- curriculum browser
- exercise player/viewer
- practice timer/logging
- progress tracking
- locked level progression
- free vs paid access control

Phase 2:

- teacher dashboard
- assignments
- notes
- reporting
- predictions
- collaboration and Elevate features
