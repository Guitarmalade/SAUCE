# Onboarding Assessment Model

This document translates the uploaded assessment and goals files into a concrete onboarding model for the app.

## Source files

- `guitarmalade-assessment.docx`
- `Student_Goals_Statement.txt`

## Purpose

Onboarding should not be a simple profile form.

It should answer:

- where is this student actually strong and weak?
- what matters most to them right now?
- what style of transformation are they after?
- how should the app present and sequence the work?

## Inputs to collect

### Identity and context

- name
- date
- years playing guitar
- primary style
- chosen path
  - `core-first`
  - `song-first`
- primary key center
- commitment horizon
  - `1-3 months`
  - `3-6 months`
  - `6-12 months`
  - `1-2 years`
  - `ongoing`

### Preference signals

- preferred presentation emphasis
  - visual
  - auditory
  - kinesthetic
- optional personality or motivational profile inputs
  - Myers-Briggs style questions if retained
- preferred session length
- interest areas
- favorite styles, artists, or sounds

### Big-picture goals

- what the student most wants to get out of lessons
- overall vision as a guitarist
- short-term goal
- medium-term goal
- long-term goal

### Assessed skill areas

The current source material supports these ten assessed areas:

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

For each area, onboarding should collect:

- `comfort score`
  - 1 to 5
- `self-level`
  - 1 to 10, if you want to retain the broader goals statement scale
- `priority`
  - high
  - medium
  - low
- `goal narrative`
  - where the student wants this area to go

## Modeling decision

Use the 1 to 5 comfort scale as the primary product scoring input.

Use the 1 to 10 scale from the goals statement as optional supporting detail or drop it entirely if you want less friction.

Reason:

- the 1 to 5 scale is cleaner for onboarding UX
- it matches the current practice confidence scale already in the app
- it is easier to convert into recommendation rules

## Derived outputs

The onboarding engine should compute:

- `starting strengths`
- `starting weak points`
- `highest-priority goals`
- `primary curriculum emphasis`
- `recommended daily mission mix`
- `preferred lesson presentation style`
- `first Bag O' Tricks suggestions`
- `starting repertoire track`
- `checkpoint readiness assumptions`

## Recommendation rules

### 1. Weakness vs priority

The app should not treat the weakest area as automatically the most important.

Instead:

- weakness is derived from low comfort score
- priority is derived from the student's stated importance
- the first plan should blend both

Example:

- if `theory` is weak but low priority, it should still appear, but not dominate the mission plan
- if `improv` is medium skill but high priority, it should appear often and connect back to the core level work

### 2. Goal-derived systems

The app should build systems from goals, not just assign random lessons.

Example transformations:

- if the student wants to `solo over a blues without overthinking`
  - emphasize rhythm, improv, chord progression vocabulary, and lead Bag O' Tricks
- if the student wants to `play songs start to finish confidently`
  - emphasize repertoire, song elements, rhythm, and harmony
- if the student wants to `know every note on the neck`
  - emphasize fretboard awareness, theory, and transposition drills

### 3. Learning preference presentation

Learning preferences should affect delivery, not standards.

Visual emphasis:

- diagrams
- fretboard maps
- highlighted intervals
- progression maps

Auditory emphasis:

- call-and-response prompts
- listen-first drills
- backing tracks
- interval and progression ear prompts

Kinesthetic emphasis:

- play-first loops
- movement-based repetition
- short physical pattern drills
- quick application tasks before explanation

Important:

- every student still moves through the same core standards
- this changes the presentation and order of emphasis, not the curriculum bar

### 4. Commitment horizon and pacing

Commitment horizon should shape pacing and milestone framing.

Shorter commitment:

- faster visible wins
- lower-friction missions
- strong streak reinforcement

Longer commitment:

- deeper progression arcs
- more layered checkpoint plans
- stronger repertoire and voice development tracks

## First version output

At the end of onboarding, the app should generate:

- a student profile summary
- top 3 priority areas
- current strongest area
- current weakest area
- recommended starting level emphasis
- first 7-day practice plan
- first checkpoint target
- first `turn it into music` mission

## What is still missing

These inputs are still needed before the engine can become fully deterministic:

- the exact scoring rules for mapping answers into recommendations
- any Myers-Briggs question set you want retained
- the repertoire pool and review cadence
- checkpoint pass criteria by level and area
