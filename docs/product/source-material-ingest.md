# Source Material Ingest

This document captures the product implications of the uploaded Guitarmalade source files reviewed on April 22-23, 2026.

## Reviewed so far

- `1 The Guitarmalade S.A.U.C.E. Method.pdf`
- `Guitarmalade CORE 1-5.pdf`
- `1 The Guitarmalade S.A.U.C.E. Method.pages`
- `Guitarmalade CORE 1-5.pages`
- `Sauce Book Edit.pages`
- `SAUCE Method update.pages`
- `The GUITARMALADE Cookbook Vol. 1 Update 17.pdf`
- `Blues Dad BBQ - GUITARMALADE Update 2.pdf`
- `guitarmalade-assessment.docx`
- `Student_Goals_Statement.txt`
- `GUITARMALADE APP 2 PROMPTS.txt`
- `Guit App Description Update.pages`
- `GUitarmalade Brian notes 1 6 26.pages`
- `guitarmalade app sketch architecture.pages`

## What Each Source Means For The App

## Product Essence

The core of the product is not `content library`, `habit tracker`, or `gamification` by itself.

The essence is:

- the `C.O.R.E.` music curriculum
- the `S.A.U.C.E.` learning process
- the final step where the student `turns it into music`

Everything else is in service of that:

- onboarding exists to personalize the path through the curriculum
- habit tracking exists to keep the student practicing consistently
- gamification exists to reinforce progress and completion
- repertoire exists to prove retention and application
- mindset tools exist to support confidence, focus, and identity

If a feature does not help the student move through C.O.R.E., use S.A.U.C.E., and turn material into real music, it should not sit at the center of version 1.

## Canonical notes from the newer Pages files

The `.pages` files are more specific than the earlier PDFs in a few important ways:

- the `C` step is written as `Compose/Create`
- the `E` step is written as `Experience/Elevate`
- `turn it into music` is stated explicitly as the center of the method
- personalization is described as being based on goals, learning preferences, time allotment, strengths, and interests
- the likely key sequence for the five core levels is:
  - level 1 in `C`
  - level 2 in `A`
  - level 3 in `G`
  - level 4 in `E`
  - level 5 in `D`

App implication:

- the repo should treat the Pages files as the more precise canonical source when wording conflicts with the PDFs
- the app should support a stable progression spine while allowing highly personalized delivery
- personalization should change the presentation, recommendations, pacing, and mission selection, not lower the curriculum standard

### SAUCE method PDF

This defines the top-level learning loop:

- `Study (Steal)`
- `Assimilate`
- `Utilize`
- `Compose`
- `Elevate`

App implication:

- SAUCE should appear as a practice workflow, reflection framework, and checkpoint lens.
- It should not be treated only as a marketing label or badge on lessons.

### SAUCE method Pages files

The newer Pages files confirm the same five-part structure, but add important product framing:

- `Study (Steal)` emphasizes transcribing, analyzing, and understanding the vocabulary of players the student loves
- `Assimilate` emphasizes warmups, application, and experimentation
- `Utilize` emphasizes looping progressions, transposition, recording, and self-rating
- `Compose/Create` emphasizes writing, solo crafting, and finding the student's own voice
- `Experience/Elevate` emphasizes playing with people, bandmates, gigs, mentors, and identity-level growth

App implication:

- the SAUCE phases should feed mission types, reflections, and checkpoint prompts
- the app should repeatedly bridge from isolated review into real musical use
- recording, rating, and reflection should be treated as core actions rather than optional extras

### CORE 1-5 PDF

This defines the sequential skill spine:

- level-by-level note finding
- scales
- pentatonics
- triads
- diatonic harmony
- seventh chords
- arpeggios
- song analysis and transposition

App implication:

- levels are the main progression gate
- students cannot skip ahead without clearing checkpoints
- the app needs to support both `core-first` and `song-first` entry paths

### CORE 1-5 Pages file

The newer Pages file confirms the levels and adds stronger emphasis on:

- `Start with Song - Option 2`
- long-term crafting of the student's musical voice
- maintaining both rhythm and lead Bag O' Tricks
- a test step where the student chooses the progression, voicing type, rhythm, then records an improvised or composed solo

App implication:

- the progression model needs a formal `test` or `waypoint` layer, not just lesson completion
- Bag O' Tricks should track both rhythm and lead preferences separately
- the app should make `turn it into music` a required transition from review to application

### Sauce Book Edit.pages

This file adds product-direction language that matters for scope:

- the target user is the intermediate guitarist trying to break out of a plateau
- the main problem is not just time, but lack of clarity around what and how to practice
- the curriculum should be personalized by learning style, goals, time allotment, strengths, and interests

App implication:

- the app must answer `what do I practice today` and `how do I practice it`
- onboarding needs to gather enough information to adapt sequencing and presentation
- the system should derive practice plans from goals rather than only serving static lessons

### SAUCE Method update.pages

This file sharpens the essence of the product:

- `Guitarmalade Core Curriculum and SAUCE Methodology`
- `My Bag O' Tricks`
- `Chord Progressions`
- `Soloing concepts vs Favorite Licks`
- `SAUCE Method - Turn it into music`

App implication:

- the product center is the marriage of curriculum plus method plus application
- progression should move from review to progression, concept, loop, improvisation, and recording
- the app should support starting from a progression or concept, then looping, improvising, and reflecting

### guitarmalade-assessment.docx

This file provides the clearest onboarding assessment structure so far.

It introduces:

- a 1 to 5 comfort scale
- ten assessed areas
  - rhythm
  - fretboard awareness
  - music theory
  - improv
  - technique
  - repertoire
  - lead guitar Bag O' Tricks
  - rhythm guitar Bag O' Tricks
  - song elements
  - chord progression vocabulary
- five concrete prompts per area
- a goal prompt for each area
- teacher notes for priorities and next steps

App implication:

- onboarding should include both quantitative self-ratings and written goals
- the app can compute a starting profile per area instead of relying on one generic skill level
- the ten assessed areas map cleanly onto curriculum, Bag O' Tricks, and repertoire planning
- this is enough structure to create an onboarding scoring engine and recommendation layer

### Student_Goals_Statement.txt

This file adds the long-horizon and motivational layer that the assessment alone does not cover.

It introduces:

- years playing guitar
- primary style
- lesson outcome goals
- 1 to 10 self-rating by area
- priority level per area
- a narrative destination for each skill
- a big-picture vision statement
- commitment horizon for lessons

App implication:

- onboarding should capture both `comfort` and `importance`
- the app should distinguish between weak areas and priority areas because they are not always the same
- goal language can drive mission framing, repertoire selection, and habit messaging
- commitment horizon can shape pacing, streak framing, and milestone timing

### Cookbook Vol. 1

This is the first strong content library for the app. It contains reusable learning structures, not just isolated examples.

Key patterns found:

- weekly practice tracker sheets
- reverse-engineering prompts for songs
- note-location systems
- interval, subdivision, and chord-spelling reference material
- key-based `Just. Do. This.` warmups
- triad and seventh-chord systems
- mode, pentatonic, shred, sweep, diminished, pedal-tone, and shoegaze focused packs
- jam and recipe pages with directions, ingredients, loop progressions, and solo prompts

App implication:

- this should feed the main lesson and practice engine
- `Just. Do. This.` pages can become daily warmup cards
- `recipe` and `jam` pages can become guided practice missions
- reference pages can become expandable lesson support rather than standalone progression steps
- the weekly tracker validates the habit-tracker direction of the app

### Blues Dad BBQ / Blues Bible

This is not just another general ebook. It is a focused, time-constrained blues transformation track.

Key patterns found:

- explicit rhythm vs lead Bag O' Tricks split
- short-session positioning for busy players
- challenge framing around time, form, transposition, and soloing problems
- 12-bar shuffle progressions
- turnarounds
- walking bassline blues
- drop-D blues
- minor blues
- blues scales and phrasing systems
- call and response
- tritone, double-stop, sixth, and turnaround lick libraries

App implication:

- this should become a dedicated blues pathway or content pack
- it fits the habit app especially well because it is framed for `stolen moments` and short sessions
- it provides strong content for repertoire, genre specialization, and personalized Bag O' Tricks recommendations

## Product Modeling Decisions

Based on the reviewed material, the app should separate:

- `path`
  - `core-first`
  - `song-first`
- `level`
  - sequential C.O.R.E. progression gate
- `area`
  - fretboard
  - rhythm
  - theory
  - technique
  - harmony
  - bag-of-tricks
- `track`
  - general curriculum
  - blues pathway
  - future genre or style packs
- `exercise`
  - the actual tab, diagram, loop, video, quiz, or guided mission

This prevents confusion between:

- foundational progression
- content taxonomy
- personalized style specialization

## Immediate Build Implications

The current app should evolve toward these feature groups:

- onboarding assessment
- daily warmup recommendation
- guided practice missions
- checkpoint tests by level and area
- Bag O' Tricks personalization
- repertoire review scheduling
- streaks, habit loops, and waypoints
- personalized presentation based on student preference signals such as visual, auditory, and kinesthetic emphasis
- personality and motivation-aware framing, including Myers-Briggs style inputs if you decide to keep them in onboarding
- optional mindset module for visualization, mantra, binaural, or hypnosis content
- specialized tracks like blues without breaking the main progression model

The onboarding model should now explicitly collect:

- current comfort by area
- priority by area
- written goal by area
- big-picture identity or vision statement
- years playing
- primary style
- practice commitment horizon

## Still Needed

To map this content cleanly into the app, the next inputs that matter most are:

- pass and fail criteria for each checkpoint
- the repertoire list and review cadence
- media assets tied to lessons
- the final onboarding scoring rules and how each answer should change the student journey
- rules for free vs paid access
