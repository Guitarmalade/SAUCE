# Guitarmalade App Session Handoff

Date: May 1, 2026

## What this session established

The app should not be centered on generic course delivery alone.

The core of the product is:

- `C.O.R.E.` as the foundational music curriculum
- `S.A.U.C.E.` as the learning and application process
- `turn it into music` as the required outcome layer

Everything else supports that:

- onboarding
- habit tracking
- gamification
- personalization
- repertoire review
- mindset support
- specialty tracks like blues

## Canonical product decisions

### Core product essence

- The essence is `Core music curriculum and SAUCE, turn it into music`.
- If a feature does not help the student move through C.O.R.E., use S.A.U.C.E., and turn it into music, it should not sit at the center of version 1.

### SAUCE method wording

Canonical wording now captured:

- `Study (Steal)`
- `Assimilate`
- `Utilize`
- `Compose/Create`
- `Experience/Elevate`

Important correction from the session:

- `Study` should be `Study (Steal)`

### Practice paths

The product should support two valid entry paths:

- `core-first`
- `song-first`

### Personalization

Personalization should derive from:

- goals
- available practice time
- strengths and weaknesses
- interests
- favorite players or sounds
- preference signals such as `visual`, `auditory`, and `kinesthetic`
- optional personality-style signals such as Myers-Briggs if retained

Important constraint:

- personalization should change presentation, pacing, emphasis, recommendations, and mission selection
- personalization should not lower curriculum standards or bypass checkpoints

### Progression model

The app should separate:

- `path`
- `level`
- `area`
- `lane`
- `exercise`

This keeps progression, taxonomy, specialization, and delivery from getting mixed together.

### Likely core key sequence

Based on the uploaded Pages files, the working assumption is:

- level 1: `C`
- level 2: `A`
- level 3: `G`
- level 4: `E`
- level 5: `D`

## Source materials reviewed in this session arc

### Method and curriculum

- `1 The Guitarmalade S.A.U.C.E. Method.pdf`
- `Guitarmalade CORE 1-5.pdf`
- `1 The Guitarmalade S.A.U.C.E. Method.pages`
- `Guitarmalade CORE 1-5.pages`
- `Sauce Book Edit.pages`
- `SAUCE Method update.pages`

### Supporting content

- `The GUITARMALADE Cookbook Vol. 1 Update 17.pdf`
- `Blues Dad BBQ - GUITARMALADE Update 2.pdf`

### Planning and prompts

- `GUITARMALADE APP 2 PROMPTS.txt`
- `Guit App Description Update.pages`
- `GUitarmalade Brian notes 1 6 26.pages`
- `guitarmalade app sketch architecture.pages`

### Onboarding and assessment

- `guitarmalade-assessment.docx`
- `Student_Goals_Statement.txt`

## What the source materials imply

### Cookbook

The cookbook is structured enough to feed the lesson and practice engine directly.

Useful patterns found:

- weekly practice trackers
- `Just. Do. This.` warmups
- jam and recipe pages
- reverse-engineering prompts
- note, interval, triad, chord, mode, pentatonic, and application systems

### Blues Bible / Blues Dad BBQ

This is best treated as a focused blues pathway or content pack rather than just a random ebook.

Useful patterns found:

- rhythm vs lead Bag O' Tricks split
- short-session framing for busy players
- 12-bar structures
- blues phrasing and lick systems
- turnaround, call-and-response, double-stop, tritone, and phrasing libraries

### Assessment and goals files

These are strong enough to define the real onboarding model.

Most important takeaway:

- the app should distinguish `weak areas` from `priority areas`

Those are not the same, and the student plan should blend both.

## Documents created or updated in the repo

### New or updated docs

- [ENGINEERING_SPEC.md](/Users/chrisschreiner/sauce/ENGINEERING_SPEC.md)
- [docs/product/source-material-ingest.md](/Users/chrisschreiner/sauce/docs/product/source-material-ingest.md)
- [docs/product/canonical-curriculum-model.md](/Users/chrisschreiner/sauce/docs/product/canonical-curriculum-model.md)
- [docs/product/onboarding-assessment-model.md](/Users/chrisschreiner/sauce/docs/product/onboarding-assessment-model.md)

### Existing scaffold confirmed

The repo already contains:

- `apps/web`
- `apps/api`
- shared curriculum/domain/validation packages
- current onboarding, dashboard, curriculum, and practice surfaces

## Current product framing

Best current framing:

`A personalized guitar transformation app that moves students through the C.O.R.E. curriculum using the S.A.U.C.E. method and repeatedly forces application into real music.`

## Highest-priority next inputs still needed

- checkpoint pass/fail criteria
- exact onboarding scoring rules
- Myers-Briggs question set, if you want it retained
- repertoire pool
- review cadence rules
- free vs paid boundaries
- media assets tied to lessons

## Best next implementation step

The strongest next build step is:

- turn the assessment and goals model into the real onboarding flow and scoring schema

That means defining:

- the onboarding questions shown in-app
- the stored student profile shape
- the derived recommendation rules
- the first 7-day plan logic
- the first checkpoint recommendation
- the first `turn it into music` mission

## Files to reopen first next time

- [docs/product/canonical-curriculum-model.md](/Users/chrisschreiner/sauce/docs/product/canonical-curriculum-model.md)
- [docs/product/onboarding-assessment-model.md](/Users/chrisschreiner/sauce/docs/product/onboarding-assessment-model.md)
- [docs/product/source-material-ingest.md](/Users/chrisschreiner/sauce/docs/product/source-material-ingest.md)
- [ENGINEERING_SPEC.md](/Users/chrisschreiner/sauce/ENGINEERING_SPEC.md)

