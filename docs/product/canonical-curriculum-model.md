# Canonical Curriculum Model

This document translates the reviewed Guitarmalade source material into a product model the app can build against.

## Core principle

The center of the product is:

- `C.O.R.E.` as the foundational music curriculum
- `S.A.U.C.E.` as the learning and application process
- `turn it into music` as the non-negotiable outcome

Everything else supports that:

- personalization
- habit tracking
- gamification
- repertoire review
- mindset support
- specialty pathways

## Product dimensions

The app should model these separately:

- `path`
  - `core-first`
  - `song-first`
- `level`
  - the sequential C.O.R.E. progression gate
- `area`
  - fretboard
  - rhythm
  - theory
  - technique
  - harmony
  - bag-of-tricks
- `lane`
  - core curriculum
  - repertoire
  - checkpoint
  - bag-of-tricks
  - mindset
  - specialty track such as blues
- `exercise`
  - the concrete lesson asset, drill, loop, quiz, performance task, or review mission

## Canonical SAUCE loop

The reviewed materials point to a stable five-step loop:

- `Study (Steal)`
- `Assimilate`
- `Utilize`
- `Compose`
- `Elevate`

Notes:

- `Study (Steal)` should be treated as the canonical wording.
- `Compose` is sometimes written as `Compose/Create`.
- `Elevate` is sometimes written as `Experience/Elevate`.

Product implication:

- these should be modeled as stable phase ids with flexible display copy where needed
- every major practice mission should map to one phase
- checkpoints should test both skill and application, not just recall

## Canonical progression

The C.O.R.E. materials define a five-level sequence.

Level 1:

- note finding via `up 12 / down 5`
- one-string major scale
- in-position major scale
- one-octave pentatonic
- root-position triads or basic chord vocabulary

Level 2:

- ascending and descending note finding
- two-octave scale work
- two-octave pentatonic
- triad inversions
- relative minor

Level 3:

- octave shapes
- 3NPS options
- pentatonic patterns
- broader triad inversion fluency
- diatonic triads and barre chords
- first stronger improvisational application

Level 4:

- pedal tone
- thirds
- modes
- seventh chords
- arpeggio inversions
- broader minor-key fluency

Level 5:

- any-string-set triad control
- full diatonic seventh-chord vocabulary
- all diatonic arpeggio inversions
- diagonal and across-the-neck fluency
- opt-in review aligned to the student's goals

## Likely key sequence

The current Pages material suggests this core-key mapping:

- level 1: `C`
- level 2: `A`
- level 3: `G`
- level 4: `E`
- level 5: `D`

This should be treated as the current canonical assumption until a fuller level library says otherwise.

## Turn It Into Music

This is not a slogan. It is a required product layer.

The app should repeatedly move the student from review into:

- a progression
- a chord voicing choice
- a groove or rhythmic choice
- a solo or melody choice
- recording and self-rating
- reflection on what worked and what needs work

Product implication:

- lesson completion alone is not enough
- each level should include application missions and tests
- recording, reflection, and performance prompts belong in the main flow

## Personalization

Personalization should derive from:

- goals
- available practice time
- strengths and weaknesses
- interests
- favorite players or sounds
- preference signals such as visual, auditory, or kinesthetic presentation
- optional personality-style signals such as Myers-Briggs if retained in onboarding

Important constraint:

- personalization should alter presentation, pacing, emphasis, examples, and recommendations
- personalization should not reduce the standard of the curriculum or bypass checkpoints

## Bag O' Tricks

Bag O' Tricks should be modeled separately from the core progression.

It should contain both:

- rhythm vocabulary
- lead vocabulary

Examples include:

- spread voicings
- triads with non-chord tones
- double stops
- diads
- slapping
- pedal tone
- 2NPS sliding arpeggios
- sweep arpeggios
- cascading pentatonic licks
- ABAC and AAAB melodic motifs
- rhythm displacement

## What the app must answer

At any moment, version 1 should answer:

- what should I practice today?
- how should I practice it?
- how does it connect to my current level?
- how do I turn it into music right now?
- what is my next measurable checkpoint?
