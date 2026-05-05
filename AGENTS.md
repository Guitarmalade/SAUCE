# SAUCE — Agent Guide

This file gives AI agents (Claude Code, Codex, etc.) the context they need to be useful in this repo. The user is a non-developer working primarily on the visual mockup. Default to plain language, explain trade-offs before making changes, and prefer simple over clever.

## What this project is

SAUCE is Guitarmalade's student-first guitar learning platform — practice, progression, and accountability for guitar students. Think Duolingo for guitar. The product centers on three things:

- **C.O.R.E.** — the foundational music curriculum
- **S.A.U.C.E.** — the learning and application process (Study/Steal, Assimilate, Utilize, Compose/Create, Experience/Elevate)
- **Turn it into music** — the required outcome layer

Phase 1 is the student experience: auth, onboarding, curriculum browsing, exercise viewing, practice timer/logging, and progress tracking. Teacher features come in Phase 2.

The canonical engineering spec is `ENGINEERING_SPEC.md`. The canonical session handoff is `exports/guitarmalade-session-handoff-2026-05-01.md`.

## Where things live

```
apps/web/                           Next.js student-facing app (the real product)
apps/api/                           Fastify API (the backend)
packages/curriculum/                level/area/exercise definitions
packages/database/                  Prisma schema and DB helpers
packages/domain/                    core entities and business rules
packages/ui/                        shared UI primitives and design tokens
packages/validation/                shared request/response validation
packages/config/                    shared tooling config
docs/architecture/                  system overview
docs/decisions/                     architecture decision records (ADRs)
docs/product/                       product/domain models and decisions
docs/marketing/                     marketing notes and copy
docs/agents/                        agent-specific notes (e.g., Chrome DevTools setup)
references/guitarmalade-sauce-pack/ THE EDITABLE MOCKUP (see below)
references/duolingo-clone/          third-party reference code, do not modify
scripts/                            dev tooling, including Chrome debug launcher
tests/                              project tests
```

## The editable mockup

The mockup lives in `references/guitarmalade-sauce-pack/`. It is the user's primary working surface right now. Read `references/guitarmalade-sauce-pack/EDITING.md` before making changes.

Files the user actually edits:

- `editable-home.html`
- `editable-dashboard.html`
- `editable-practice.html`
- `editable-mockup.css`
- `editable-ui.js`

Conventions:

- copy, section order, and page layout → in the HTML files
- colors, spacing, typography, borders, radii → in `editable-mockup.css`
- the original Claude export (`Guitarmalade SAUCE App.html`, `Guitarmalade SAUCE App v2.html`, and the supporting `.jsx` files) is kept for reference — do not edit these

Mockup edits are visual/design changes only. They are not yet wired into the real app in `apps/web/`. Do not assume changes here propagate.

## How to work in this repo

- **Package manager:** pnpm (version pinned in `package.json`). Always use `pnpm`, never `npm` or `yarn`.
- **Node:** 22+
- **Run dev:** `pnpm dev` (parallel) or `pnpm dev:web` / `pnpm dev:api`
- **Build:** `pnpm build`
- **Typecheck / lint / test:** `pnpm typecheck` / `pnpm lint` / `pnpm test`
- **Format:** `pnpm format`

## Things to never do without asking

- Change the SAUCE method wording (canonical: Study/Steal, Assimilate, Utilize, Compose/Create, Experience/Elevate)
- Change the C.O.R.E. naming or its position as the core curriculum
- Touch anything in `references/duolingo-clone/` (it is third-party reference material)
- Restructure `apps/`, `packages/`, or `docs/` without surfacing the change first
- Run destructive commands (`rm -rf`, `git reset --hard`, force-push) without explicit confirmation

## Things that are safe to do without asking

- Edit any `editable-*` file in `references/guitarmalade-sauce-pack/`
- Add or update files in `docs/`
- Add notes, todos, or session summaries to a `NOTES.md` at the repo root
- Improve `.gitignore`

## How to leave the repo at the end of a session

- If you made changes, summarize them in plain language
- If anything is unfinished, append a section to `NOTES.md` describing what's left
- Suggest a one-line `git commit` message describing the change
- Never commit on the user's behalf unless they explicitly ask
