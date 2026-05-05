# ADR 0001: Monorepo And Stack

## Status

Accepted

## Context

SAUCE needs a student-facing web app now, an API immediately behind it, shared curriculum and domain logic, and future teacher surfaces later.

## Decision

Use a TypeScript monorepo with:

- `pnpm` workspaces
- `Turborepo`
- `Next.js` for the web app
- `Fastify` for the API
- `Prisma` with Postgres for persistence

## Consequences

- Shared packages keep progression logic and curriculum definitions consistent.
- The API and web app can evolve independently without splitting repositories.
- Teacher tools can be added later without reworking the core repo layout.

