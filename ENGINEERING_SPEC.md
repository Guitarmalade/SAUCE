# SAUCE Engineering Spec

This is the canonical engineering spec for the SAUCE repository.

If this file conflicts with summary language in `README.md` or supporting docs, this file wins. Supporting docs in `docs/` should explain subsets of this spec, not redefine it.

## 1. Product Intent

SAUCE is Guitarmalade's student-first learning platform for practice, progression, and accountability.

The product is designed around structured advancement through the Guitarmalade method, with the student experience shipping first and teacher workflows reserved for a later phase.

The current canonical product interpretation of the uploaded source material is summarized in [canonical-curriculum-model.md](/Users/chrisschreiner/sauce/docs/product/canonical-curriculum-model.md) and [source-material-ingest.md](/Users/chrisschreiner/sauce/docs/product/source-material-ingest.md).

The current onboarding interpretation of the uploaded assessment material is summarized in [onboarding-assessment-model.md](/Users/chrisschreiner/sauce/docs/product/onboarding-assessment-model.md).

## 2. Product Scope

### Version 1

- authentication and student identity
- free vs paid access awareness
- onboarding around goals, path, and chosen key center
- curriculum browsing across the six core areas
- exercise viewing and guided practice
- BPM, confidence, notes, and time logging
- progress tracking and level gating
- personalized recommendation based on goals, available time, and learner preferences
- an application layer that repeatedly turns review into music

### Version 2

- teacher dashboard and student roster management
- assignments, notes, and lesson workflows
- reporting and prediction features
- collaboration and Elevate features

### Out of scope for now

- full teacher UI
- social networking mechanics
- marketplace features
- advanced collaboration tooling beyond reserved architecture hooks

## 3. Engineering Principles

- Student experience ships first.
- Curriculum rules live outside the UI.
- Product logic is shared across surfaces through packages, not duplicated in apps.
- Access rules should be enforced in domain and API layers, not only in the frontend.
- Progression must be deterministic and auditable.
- The codebase should scale toward teacher workflows without forcing them into version 1.

## 4. Repository Architecture

SAUCE is a TypeScript monorepo using `pnpm` workspaces and `Turborepo`.

### Applications

- `apps/web`
  Next.js student-facing application.
- `apps/api`
  Fastify API for profile, dashboard, curriculum, and practice flows.

### Shared packages

- `packages/domain`
  Core business entities and rules.
- `packages/curriculum`
  Level, area, and exercise definitions.
- `packages/database`
  Prisma schema, generated client, and repository functions.
- `packages/validation`
  Shared input validation for API-facing payloads.
- `packages/ui`
  Shared design tokens and future UI primitives.
- `packages/config`
  Reserved for shared tooling configuration.

### Supporting docs

- `docs/architecture`
  Architectural explanation and rationale.
- `docs/product`
  Domain notes and execution tracking.
- `docs/decisions`
  ADR-style stack and architecture decisions.

## 5. Runtime Stack

- Language: TypeScript
- Package manager: `pnpm`
- Build orchestration: `Turborepo`
- Web app: Next.js
- API: Fastify
- Persistence: Prisma + PostgreSQL
- Formatting: Prettier
- CI baseline: GitHub Actions

## 6. Current User Flows Implemented

The repository currently includes a first real product slice:

- onboarding form and student profile capture
- student dashboard summary
- curriculum browsing with level 1 roadmap content
- practice logging flow with BPM, confidence, duration, and notes
- API routes for profile, dashboard, curriculum roadmap, and practice logs

## 7. API Specification

### Student

- `GET /student/profile`
  Returns the current student profile.
- `POST /student/profile`
  Saves onboarding/profile input.
- `GET /student/dashboard`
  Returns dashboard summary data.

### Practice

- `GET /practice/logs`
  Returns recent practice logs.
- `POST /practice/logs`
  Saves a practice log entry.

### Curriculum

- `GET /curriculum/areas`
  Returns curriculum area definitions.
- `GET /curriculum/levels`
  Returns level summaries.
- `GET /curriculum/roadmap`
  Returns areas, levels, and seeded level 1 exercises.
- `GET /curriculum/levels/:level/exercises`
  Returns exercises for a given level.

## 8. Domain Model

The core version 1 domain includes:

- `User`
- `StudentProfile`
- `CurriculumPath`
- `Goal`
- `PracticeSession`
- `PracticeEntry`
- `ProgressRecord`
- `CurriculumArea`
- `Level`
- `Exercise`
- `SubscriptionTier`

### Domain rules

- Students cannot skip levels.
- The C.O.R.E. levels define the progression spine.
- Students can enter practice through either `core-first` or `song-first`.
- The app must bridge from review into musical application rather than stopping at drill completion.
- Progress should reflect both completion and demonstrated comfort.
- Bag O' Tricks remains individualized while the core curriculum stays structured.
- Free users can access level 1 and selected preview material.
- Paid users are intended to unlock the full sequence.

## 9. Data and Persistence Spec

Persistence is modeled in [schema.prisma](/Users/chrisschreiner/sauce/packages/database/prisma/schema.prisma).

The live persistence strategy is:

- Prisma-backed repositories are implemented in `packages/database/src/repository.ts`.
- The API storage layer prefers Prisma-backed reads and writes.
- If Postgres is unavailable, the API falls back to in-memory state so local flows do not hard fail.

This means the repo has a real persistence foundation, but durable runtime persistence still depends on a working database connection and migration flow.

## 10. Environment Spec

Current expected environment variables are defined in [.env.example](/Users/chrisschreiner/sauce/.env.example):

- `DATABASE_URL`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_API_URL`
- `API_PORT`
- `AUTH_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `SENTRY_DSN`

## 11. Developer Workflow

### Install

```bash
pnpm install
```

### Run

```bash
pnpm dev
```

### Verify

```bash
pnpm typecheck
pnpm build
pnpm test
```

### Database client generation

```bash
pnpm --filter @sauce/database prisma:generate
```

## 12. Current Status

### Implemented

- monorepo structure
- student web app shell
- Fastify API shell
- shared domain/curriculum/validation packages
- seeded level 1 curriculum data
- Prisma schema and repository layer
- fallback-aware API storage
- CI/build/typecheck/test scripts

### Not yet complete

- production auth
- Stripe billing and access enforcement
- Prisma migrations and local database orchestration
- real curriculum asset import
- media viewers for tabs, diagrams, and video
- true progression checkpoint engine
- real automated test coverage
- teacher-facing workflows

## 13. Current Risks

- If Postgres is not running, the API falls back to memory and data is not durable.
- Curriculum content is representative and seeded, not yet the canonical imported Guitarmalade library.
- Billing and auth architecture are planned but not implemented end-to-end yet.
- Test commands pass, but test coverage is still mostly placeholder rather than feature-complete.

## 14. Immediate Next Milestones

1. Add local Postgres orchestration and Prisma migration commands.
2. Remove ambiguity around fallback mode by documenting when Prisma is active.
3. Implement auth and protected student sessions.
4. Wire free vs paid access rules into persisted data and API responses.
5. Import canonical curriculum assets and metadata.
6. Add progression checkpoint enforcement and real tests.

## 15. Supporting Documents

These remain useful supporting docs, but they are not the canonical engineering spec:

- [README.md](/Users/chrisschreiner/sauce/README.md)
- [overview.md](/Users/chrisschreiner/sauce/docs/architecture/overview.md)
- [domain-model.md](/Users/chrisschreiner/sauce/docs/product/domain-model.md)
- [execution-checklist.md](/Users/chrisschreiner/sauce/docs/product/execution-checklist.md)
- [onboarding-assessment-model.md](/Users/chrisschreiner/sauce/docs/product/onboarding-assessment-model.md)
