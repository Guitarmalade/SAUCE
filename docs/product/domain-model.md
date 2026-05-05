# Domain Model

Canonical engineering spec: [ENGINEERING_SPEC.md](/Users/chrisschreiner/sauce/ENGINEERING_SPEC.md)

## Core entities

- `User`: platform identity
- `StudentProfile`: current level, goals, streak, subscription tier
- `TeacherProfile`: reserved for phase 2 roster and lesson workflows
- `Goal`: short, medium, and long-term outcomes
- `PracticeSession`: timed session container
- `PracticeEntry`: per-exercise logging including BPM, notes, and confidence
- `CurriculumArea`: fretboard, rhythm, theory, technique, harmony, bag-of-tricks
- `Level`: sequential level container with unlock rules
- `Exercise`: playable or viewable unit with metadata and media
- `Checkpoint`: pass criteria before next progression gate opens
- `ProgressRecord`: normalized completion and readiness state
- `Subscription`: free or paid access policy anchor

## Key rules

- Students cannot skip levels.
- Progress is tracked by both completion and demonstrated comfort.
- Bag O' Tricks remains individualized while the core curriculum stays structured.
- Free users can explore level 1 and selected Bag O' Tricks content.
- Paid users can persist progress and unlock the full sequence.

## Current implementation note

The repository now includes:

- shared onboarding profile inputs
- dashboard summary generation
- practice entry validation and summarization
- curriculum access gating logic for free vs paid users
