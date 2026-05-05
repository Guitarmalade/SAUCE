# Architecture Overview

Canonical engineering spec: [ENGINEERING_SPEC.md](/Users/chrisschreiner/sauce/ENGINEERING_SPEC.md)

SAUCE is designed as a student-first platform with a clean separation between product rules, educational content, and delivery surfaces.

## Principles

- Student experience ships first.
- Curriculum rules live outside the UI.
- Free vs paid access is enforced at the domain and API layers.
- Progression is deterministic and auditable.
- Teacher workflows are anticipated but not allowed to complicate version 1.

## System shape

- `apps/web` serves the student-facing application.
- `apps/api` owns authentication, authorization, progress persistence, access control, and reporting APIs.
- `packages/domain` models users, goals, sessions, checkpoints, and progression rules.
- `packages/curriculum` models levels, areas, exercise metadata, and sequencing.
- `packages/database` holds the persistence schema.

## Version 1 boundaries

Version 1 includes:

- student auth and subscription tier awareness
- onboarding and goal selection
- curriculum browsing and exercise delivery
- practice tracking and progress
- locked sequential progression

Version 2 adds:

- teacher dashboard and student roster views
- assignment workflows
- lesson notes and reports
- predictive progress reporting
- Elevate collaboration tools
