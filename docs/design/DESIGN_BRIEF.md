# SAUCE — Design Brief

A creative direction for the SAUCE app, captured from a working session on May 4, 2026. This document is the soul of the product. Every design decision should be traceable back to one of the principles below. When in doubt, re-read this file.

---

## North Star

> **The student should look at their guitar, not the interface.**

Most learning apps fail because they make the screen the protagonist — tap here, swipe there, hold for points, watch this lesson. Duolingo is a phone-game with language attached. Yousician is a screen-reading exercise that happens to involve guitar. SAUCE is the opposite. The guitar is the experience. The app is the *negative space around the student's practice* — a calm, intelligent presence that listens, tracks, and reveals; never demands attention.

Every interface decision should pass this test: *does this make the student look at their guitar more, or at the screen more?* If it's the latter, it's wrong, no matter how clever it is.

---

## The Persona — The Teacher

The app is a replacement for Christopher (the founder, the teacher) at his best. The voice and behavior of the app should feel, to a student, the way a great session with him feels.

The teacher:

- **Encourages without flattering.** Real acknowledgment, not empty praise.
- **Keeps the student on task** without nagging.
- **Evolves their thinking** — doesn't drill the same thing forever.
- **Pushes** when they need pushing.
- **Tracks habits** — but never makes that the point.

Every line of copy in the app should sound like something the teacher would actually say. Where possible, use his real phrases. The app is not a system; it is *him*, captured as software.

This is also the criterion for sound, motion, and silence. A great teacher knows when to speak and when to stay quiet. The app should know the same.

---

## Two-Mode Product Architecture

The product is *two modes* connected by three cinematic moments. Each mode has a fundamentally different design language. Holding both well is what makes the product distinctive.

```
DASHBOARD MODE                    PRACTICE MODE
(start & end of session)          (the practice itself)

elegant • polished                enveloping • atmospheric
satisfying microinteractions      no interface
hand-drawn details                the guitar is the experience
sound design moments              ambient bed (wind + binaural)
B&W + brass accent                deep darkness with brass glow
the lobby of a great theater      stepping onto the stage
```

The dashboard is allowed to be a small celebration. All the gamification, polish, and microinteraction lives here, where it belongs — because *here* is the meta-layer: choosing, reflecting, tracking. The student is *not* practicing in the dashboard. They're settling in or coming back from.

When they tap *begin*, the dashboard exhales away. The screen darkens further. The breathing brass shape becomes the only thing visible. *Now* the guitar is the entire experience.

The contrast — *crafted lobby → silent enveloping space → crafted lobby* — is what makes both modes more powerful. The minimalism of practice mode is felt because the dashboard is rich. The richness of the dashboard feels earned because practice mode just earned it.

---

## The Metaphor — A Boat Through Fog

The whole product holds a single core image:

> **The student is a boat, moving through fog.**

The boat is the student. The fog is the curriculum, the future, the unknown of their own progress. They are not shown a map of the entire journey on day one (the way Duolingo shows its skill tree) — that's overwhelming and disrespectful of the journey. Instead, *the path reveals itself as the boat moves forward.* What's behind them is visible. What's just ahead emerges softly. What's far ahead is still in the fog — there, but not yet legible. That mystery is what creates pull.

A great teacher doesn't dump the whole curriculum on day one. They reveal what's next when the student is ready. **The fog metaphor is that pedagogy, drawn.**

The path UI is the spine of the entire app. Horizontal scroll. Past behind, future ahead. A small brass marker rests where the student is now. Atmospheric fade obscures what hasn't been earned yet. New chapters emerge from fog as the student approaches them. Unlocks are *not* "level up!" trophies — they are *land emerging on the horizon.*

---

## Aesthetic — Cinematic Monochrome with Hand-Drawn Warmth

The visual language is named:

> **Studio-quality monochrome with hand-drawn warmth and a contextual brass accent.**

### Why monochrome

Bright cartoon colors say "this is fun! it's a game!" Cinematic monochrome says "this matters, take it seriously, but warmly." Which is the teacher voice. A monochrome palette also makes the *guitar itself* the most colorful thing in the room. The student looks down at their hands, the wood grain, the strings — and the screen recedes into atmosphere, not competing for the eye.

Soft, warm black backgrounds — the inside of a forest before sunrise, not hard cinema black. Near-white type. Lots of negative space. Slow, continuous motion. Edges are soft: drop shadows, blur, gradients, feathered masks. Not hard 1px borders.

### The brass accent

A single warm accent color — initially **brass gold (~`#E8B25C`)** — is used sparingly. It is not decoration. *It is significance.* When the brass appears, it means something. Same move as Sin City's red coat: color used emotionally, not aesthetically.

The brass is what the breathing shape glows. It's the marker on the path that says *you are here.* It's the warmth of a lighthouse in the fog.

### The accent evolves with chapters

The accent is contextual. Each chapter shifts the accent within a *warm metals / embers / woods* family — never out of the family — so the product stays cohesive (a guitarist's workshop, not a paint store). A working starting point:

```
CHAPTER 1   Foundations         brass gold       #E8B25C
CHAPTER 2   Voice               aged copper      #C97A4A
CHAPTER 3   Phrasing            ember crimson    #A03B2E
CHAPTER 4   Composition         deep bronze      #7A5230
CHAPTER 5   Performance         ash silver       #B8B0A4   (or shift cool here for "elevation")
```

A student looking back at their journey sees a *gradient of warmth, deepening over time.* The color of where they've been becomes part of the muscle memory of progress. It also gives a quiet "unlock" — the next chapter's color is hinted at in the fog ahead.

### Inspiration / reference

- **Studio Ghibli** for the hand-drawn ink/pencil sensibility — the way a line draws itself in.
- **A24 / late-period Apple keynote slides** for cinematic monochrome with confident negative space.
- **Things 3 / Linear** for dashboard-level polish and microinteraction quality.
- **Sin City / Schindler's List** for the philosophical move of using color *only when it means something*.
- **Loóna / Endel** for the ambient, breathing, atmospheric mode where the interface dissolves into experience.

### What this aesthetic actively rejects

- Multi-step setup before practice (every tap is the screen winning attention).
- Streak fireworks, badges popping, level-up animations.
- Mid-practice notifications, prompts, or quizzes.
- Cluttered dashboards full of metrics.
- "Pick your difficulty / topic / song / mode" menus before practice can begin.
- Loud color blocks, busy gradients, attention-grabbing visuals.
- Childish or twee illustration; cartoon icons; "fun" jokey microcopy.
- Hard 1px borders, snappy 200ms transitions, anything that feels *clicked*.

---

## Typography

Two typefaces, used with intentional contrast.

### The Hand — for moments only

Hendrix-handwriting in sensibility: fast, slanted right, varying line weight, energy in every stroke. Not pretty. Not calligraphic. *Soulful.* A musician's hand alive on the page. Used *only* for moments that matter:

- The welcome line on arrival.
- Chapter names.
- The teacher's note at the end of a session.
- A single quote or phrase on the threshold screen.

Implementation: **animated SVG path drawing**, not a static font. The text isn't displayed — it's *written*, in time, in front of the student. Stroke-dasharray animation is the standard technique. The text appears at human speed, like a hand writing in a moleskine.

Rare, so it lands every time.

### The System — for everything else

Clean, confident, modern grotesque. Inter, Söhne, or similar. No personality of its own — its job is to let The Hand be the star. Lowercase by default, no shouting. Used for: data, labels, body copy, settings, system messages.

The contrast — *machine-clean sans next to soulful handwriting* — is itself the brand.

---

## Sound Design

Sound is treated like color: *rare, deliberate, present only when it means something*.

### The bed — always present in practice mode

- Low ambient wind, organic, recorded from real environments.
- Theta-range binaural beat (~6 Hz), the frequency band associated with deep relaxed focus.
- Soft room tone — felt more than heard.

This is functional design. Binaural beats demonstrably affect brain state. Using them isn't decoration — it's helping the student *drop into the focused state guitar practice rewards*. That is teacher-replacing technology in the most direct sense.

Volume sits just below conscious notice. The student doesn't *listen to* the practice mode. They *practice inside it*.

### Punctuation — rare, deliberate sounds at moments

Each is guitar-derived, woody, organic. Never synthetic.

- A single low string note for *arrival*.
- A held tone, like a tuning fork, for the *threshold*.
- A soft wooden click — the click of a brass knob, or a pick set down — for the *return*.
- Maybe one breath sample for transitions.

### Dashboard interactions

Tactile, sparing. The brass knob click. A soft pen-on-paper sound when handwriting appears. A low *thup* when the path advances by a step. No melodies. No music. **The guitar is the music.**

---

## The Three Cinematic Moments

These are the load-bearing emotional moments of the product. Get them right and the rest of the app feels considered. Get them wrong and nothing else matters.

### 1. Arrival

The feeling, in one phrase:

> *Ecstasy hitting you on a sunkissed dew-laden morning in the woods.*

A draft of the moment, in prose:

> The screen begins black. Not a hard cinema black — a soft, warm black, like the inside of a forest before sunrise. There's the faintest ambient texture, just enough that the eye registers *space* rather than *void*.
>
> A single low note — held, breathing, almost a tuning fork's hum — fades in. It's the sound of a string touched and released, the body of the guitar resonating softly somewhere off-screen.
>
> Light enters from the upper edge of the screen — slow, warm, brass-gold light, the way sun finds its way into a clearing through leaves. It doesn't appear so much as *grow*, the way dew catches light gradually as the angle changes. The breathing shape comes into being in the center: not drawn, *revealed*. It pulses once, slow, like a chest rising.
>
> Then the path begins to draw itself. A single hand-traced line, ink on paper, arriving in slow strokes — past first (behind you), then *just enough* of the road ahead. A small brass marker rests where you are now, a single shimmer caught on it as the light angles in.
>
> A handwritten sentence appears beneath the path, quietly:
>
> *Welcome back. You're three days in.*
>
> That's the whole arrival. Maybe three full seconds. The student inhales without meaning to. They reach for the guitar.

What this moment is *not*: no logo splash, no brand wordmark, no streak counter, no "you have 12 lessons available," no "good morning Christopher!" No app announcing itself. *The woods, your breath, the path, the light.*

### 2. Threshold

The student taps *begin*. The dashboard fades. The path retreats. The screen darkens further. The brass shape becomes the only thing visible, breathing. A long quiet beat. *Now they pick up the guitar.*

This moment should feel like *stepping onto a dimly lit stage.* Maybe one held tone fades in and out, like a tuning fork. Maybe nothing at all — just space.

### 3. Return

Practice ends. The brass shape *expands* gently and the dashboard rebuilds itself — handwritten lines drawing the session's data in. Minutes practiced appear as a written number. The path advances by a quiet drawn distance. One sentence, written in handwriting, summarizes what they did — like a teacher's note. *That's it.* No fireworks. The whole return is maybe four seconds. The student closes the app feeling *seen.*

---

## The Pulse — Tempo-Synced Ambient Feedback

This is one of the most distinctive moves in the whole product.

The breathing brass shape in practice mode does not pulse on a fixed rhythm. It pulses **in time with what the student is playing.** If they're at 80 BPM, the visual breathes at 80 BPM. If they tighten to 140, the pulse tightens. If they're in 3/4, the pulse waltzes.

What this single move accomplishes:

- The interface becomes a *visual metronome* — but a calm, embodied one. The student's eye can land on the pulse without breaking focus, the way a drummer locks into a click.
- It makes the screen *part of* the practice rather than a distraction from it.
- It reinforces rhythm at the body-level, which is what guitar teachers spend years trying to teach.
- The app feels *alive in the moment* — not playing back, but *with them*.

Implementation: tempo locked via Web Audio's metronome / detected BPM. Pulse is on the beat, with sub-pulses optional for subdivisions.

---

## Subtle Reinforcement — Teacher Body Language as Interface

Layered on top of the tempo pulse, the visual quietly reflects the student's progress, effort, and streak. **Always at the barely-noticeable level.** This is the digital version of *teacher body language*: a great teacher doesn't shout "GREAT JOB!" — they nod, lean in, the corners of their eyes crinkle. The student feels seen without being interrupted.

Examples of how the pulse can communicate:

- **Holding tempo well** → the pulse becomes *steadier*. Drift, and it softens slightly, like a teacher leaning in.
- **Effort accumulating** (minutes building in a session) → the brass *warms*, half a step toward a richer amber. Not announced. Felt.
- **Streak crossing a threshold** (5 days, 30 days) → the pulse picks up a *halo*, a soft outer glow that wasn't there before. Noticed on day 6, not day 5.
- **Chapter completion approaching** → the brass *deepens*, beginning to take on a hint of the next chapter's color. Like dawn shifting.
- **Unusually clean execution** (a passage played perfectly for the first time) → the pulse *briefly stills*, the way a person holds their breath in awe. Then resumes.

This is how SAUCE does gamification: streaks become halos; progress becomes temperature; achievements become held breaths. **Never popups. Never numbers floating up. Never sounds of triumph.**

---

## Chapter Progression — Visual Texture Evolves with the Student

Each chapter has its own visual *texture* that mirrors the player's evolution. The texture itself teaches.

```
CHAPTER 1   smoke      foundations, fog, sensing shape
CHAPTER 2   liquid     flow, connection, fluency
CHAPTER 3   glitch     rules broken on purpose, voice emerging
            (datamosh, pixelsort, controlled digital decay)
CHAPTER 4   ?          (composition — TBD)
CHAPTER 5   ?          (performance — TBD)
```

This progression *is* the student's growth as a musician, drawn:

- **Smoke** for early chapters — atmospheric, foggy, things half-glimpsed. The student is in foundations, sensing form but not yet grasping it.
- **Liquid** for the middle — fluid, flowing, things connecting. The student is entering flow; ideas link; phrases become sentences.
- **Glitch / datamosh / pixelsort** for advanced chapters — digital decay as expression. The student is breaking convention on purpose, finding their own voice. Datamosh aesthetics — where errors become beauty — is the perfect metaphor for advanced playing: when you stop hitting the notes "correctly" and start letting your voice come through. *The interface mirrors what's happening musically.*

A great teacher's whole job is to take a student through these phases. **The visual language encodes the entire teaching philosophy.** Most apps would never get within a hundred miles of this.

---

## The Destination — "Turn It Into Music"

The product's canonical product principle is *"Core music curriculum and SAUCE — turn it into music."* The "turn it into music" phase is the destination beyond the curriculum chapters, where the student is now expressing themselves rather than studying.

This moment needs its own distinct visual treatment. It is the *promise* of the entire product. Every chapter, every fog clearing, every pulse — all of it is *toward this.* So this moment must feel like *arrival*.

**The chosen direction: convergence.** All previous textures — smoke, liquid, glitch — return at once but layered, woven, *integrated.* The student has incorporated everything they've passed through. The brass at the center is now *deep* — like all the chapter colors mixed into one rich tone. The reward is *fullness*: everything held at once.

The whole product is about *integration*, not erasure. Smoke isn't a phase you leave behind; it's part of who they became. Liquid wasn't replaced by glitch; both live in them now. The destination *honors* the journey rather than deleting it.

(Alternative directions considered and not chosen: *the fog fully lifts* — emptiness, hard-won; *the interface becomes the instrument* — strings appearing on screen, vibrating with real audio. Both are defensible later if the convergence direction proves untenable.)

---

## Implementation Notes

For the engineer or agent who builds this from the brief.

- **Handwritten typography** is animated SVG path drawing using stroke-dasharray. Treat it like a film of writing, not text appearance. Variable stroke weight desirable.
- **Tempo-locked pulse** uses Web Audio API. Detect BPM either from the metronome the student sets or from real-time microphone analysis (pitch / onset detection). The pulse's animation duration is `60000 / bpm` ms.
- **Chapter texture transitions** should be CSS shader / WebGL effects layered behind the dashboard. Smoke = volumetric noise; liquid = flow simulation or warped Perlin; glitch = pixel-displacement or RGB-channel split.
- **Path UI** is horizontal scroll. The "fog ahead" effect is a long alpha-fade gradient on the right side of the path. Atmospheric haze layered behind reinforces depth.
- **Sound bed in practice mode**: two tracks looped — wind sample and 6Hz binaural beat. Both at low volume, mixable.
- **No notifications.** Ever. The app does not push. It is opened deliberately or it is silent.
- **No achievements or popups.** Ever. Reinforcement is always ambient (pulse, color, halo) or arrives as handwritten sentences on the dashboard.

---

## Closing principle

If a feature, a sound, an animation, or a piece of copy doesn't fit one of the principles above — *cut it.* Less is more is not a cliché in this product; it is the religion. Every element earns its place by surviving the question: *does this make the student look at their guitar more?*

---

*Captured from a working session, May 4, 2026. This is a living document — edit it as the product evolves, but treat the core principles as load-bearing. Changing them changes everything else.*
