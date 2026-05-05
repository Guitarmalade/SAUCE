# SAUCE Execution Checklist

This is the working delivery checklist for version 1. It is meant to stay alive as implementation progresses.

## Completed now

- [x] Create a production-oriented monorepo with web, api, and shared packages
- [x] Document architecture, product model, and initial stack decisions
- [x] Consolidate a canonical root engineering spec
- [x] Define shared student domain types and progression rules
- [x] Define a level 1 curriculum roadmap across the six core areas
- [x] Build onboarding, dashboard, curriculum, and practice entry surfaces in the student app
- [x] Add API routes for student profile, dashboard, curriculum roadmap, and practice logs
- [x] Add Prisma-backed repository foundations for student and practice persistence
- [x] Add baseline CI plus install, typecheck, test, and build scripts

## Next execution targets

- [ ] Add Prisma migrations and local Postgres orchestration so durable persistence is the normal dev path
- [ ] Add actual authentication and protected routes
- [ ] Add Stripe-backed free vs paid access enforcement
- [ ] Import real curriculum assets and metadata from the Guitarmalade source material
- [ ] Add exercise media viewers for tab, diagram, and video content
- [ ] Add progress checkpoints that unlock the next level based on real completion rules
- [ ] Add unit and integration tests for progression, validation, and API flows
- [ ] Add teacher-ready data boundaries without exposing teacher UI yet

## Risks to manage

- The API falls back to in-memory storage when Postgres or Prisma-backed persistence is unavailable.
- Curriculum data is product-shaped but still seeded with representative level 1 content rather than your full canonical library.
- Billing and auth are intentionally deferred until the student flow is stable.
