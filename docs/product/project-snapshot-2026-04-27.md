# SAUCE Project Snapshot

Date: 2026-04-27

## What This Bundle Captures

This snapshot saves the current high-level state of the SAUCE personal learning platform app and the working to-do list discussed for productizing it.

## Current Product Summary

SAUCE is a student-first learning platform for practice, progression, and accountability.

Current implemented product slice:

- onboarding form and student profile capture
- student dashboard summary
- curriculum browsing with level 1 roadmap content
- practice logging flow with BPM, confidence, duration, and notes
- API routes for profile, dashboard, curriculum roadmap, and practice logs

Current repo shape:

- `apps/web`: Next.js student-facing app
- `apps/api`: Fastify API
- `packages/domain`: business rules and entities
- `packages/curriculum`: curriculum definitions and sequencing
- `packages/database`: Prisma schema and repository helpers
- `packages/validation`: shared validation
- `packages/ui`: shared UI/design tokens

## Current Tooling State

- `claude`: `2.1.119 (Claude Code)`
- `codex`: `codex-cli 0.125.0`
- `vercel`: `51.6.1`
- `supabase`: `2.90.0`

Notes:

- The `claude` command on this machine is Claude Code, not the Claude desktop app.
- Supabase CLI reported that a newer version is available: `v2.95.4`.

## Current Risks

- The API can still fall back to in-memory storage when Postgres or Prisma-backed persistence is unavailable.
- Curriculum data is still representative and seeded rather than the full canonical imported library.
- Billing and auth are not implemented end to end yet.
- Automated tests are still mostly baseline scaffolding rather than feature-complete coverage.

## Working To-Do List

These are the next best 20 steps to turn SAUCE into a production-ready personal learning platform:

1. Lock the shipping architecture and decide whether `apps/api` remains a separate Fastify service or moves behind Next route handlers.
2. Make Supabase/Postgres the default local backend so durable persistence is the normal dev path.
3. Add Prisma migrations, seed commands, and reset scripts so every environment is reproducible.
4. Make fallback mode explicit with startup warnings or an env flag so non-durable mode is never ambiguous.
5. Choose and wire real authentication end to end.
6. Add a real current-user/session layer in the API instead of implicit single-student behavior.
7. Protect dashboard, curriculum, practice, and write endpoints with authenticated sessions.
8. Persist true per-user profiles, goals, and practice history so multiple students can exist cleanly.
9. Define the exact free-versus-paid entitlement matrix at the product level.
10. Integrate Stripe checkout, billing portal, and webhook syncing into `User.subscription`.
11. Enforce access rules in `packages/domain` and `apps/api`, not only in the frontend.
12. Build an import pipeline for the real Guitarmalade curriculum instead of continuing with seeded representative content.
13. Extend the data model for media assets, attachments, and checkpoint metadata.
14. Build the exercise detail and viewer experience for tab, diagram, video, and reference notes.
15. Turn practice logging into a real session flow with start, pause, resume, end, and autosave.
16. Define completion and readiness rules clearly: BPM thresholds, confidence, repetitions, streaks, and checkpoint passes.
17. Implement the progression engine in `packages/domain` so level unlocks are deterministic and auditable.
18. Persist `ProgressRecord` updates after practice and surface them on the dashboard and roadmap.
19. Add real unit, integration, and end-to-end coverage for auth, access control, progression, and practice flows.
20. Finish production readiness with deployment, monitoring, backups, analytics, and environment hardening.

## Included Canonical Docs

This snapshot is meant to travel with these repo docs:

- `ENGINEERING_SPEC.md`
- `README.md`
- `docs/product/execution-checklist.md`

## Recommended Build Order

If you want the most leverage with the least wasted work, do these first:

- steps 1 through 4 for architecture and persistence normalization
- steps 5 through 11 for identity, billing, and access control
- steps 12 through 20 after the platform foundation is stable
