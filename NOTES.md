# NOTES

A running log so future-Christopher (or future agents) can pick up where things left off.

## Session — May 4, 2026 — first proper foundation day

### What got done

- Sorted out the AI-tool confusion. Claude Code, Codex, Antigravity are different companies' versions of the same kind of tool — a coding assistant that lives in the terminal. Don't need all three. They don't really "train up" — they read notes and context files each time.
- Learned to resume Codex sessions: `codex resume` for the picker, `codex resume --last` to jump back into the most recent.
- Audited `~/sauce`. It's not a folder of projects — it's *one* project: SAUCE, the Guitarmalade guitar-learning app. Mapped every subfolder. Found the mockup at `references/guitarmalade-sauce-pack/`.
- Found the duplicate `guitarmalade-session-export` folder on the Desktop — every file inside was identical to files already in the project. Deleted it.
- Wrote `AGENTS.md` at the project root so Codex and Claude have proper context every session.
- Made the first git commit ever: `8229d09 — first commit: project as of May 4 2026`. Safety net is now live.
- Pushed the project to GitHub at `https://github.com/Guitarmalade/SAUCE`. Hit a secret-scanning warning on placeholder API keys inside `references/duolingo-clone/` (third-party reference code) — allowed them as "used in tests" since they're obvious placeholders (all X's).
- Mapped the mockup version history. Five zip snapshots, but only two meaningful versions: the original Claude export (black + orange theme) and the current editable mockup (blue + white, split into home/dashboard/practice pages).
- Got both mockup versions rendering live. The originals are React + Babel and need a local server (browsers block local JSX over `file://`).

### Current project state

- `AGENTS.md` lives at the root.
- Git is initialized, first commit pushed to GitHub.
- Mockup currently viewable via local Python server (see below).
- Untracked: `.claude/` folder appeared after the first commit (Claude Code config). Not yet committed.
- Cleanup pending: Group B duplicate zips still in the project. Group A (Desktop folder) is done.

### Locations to remember

```
Project root:                ~/sauce
Project on GitHub:           https://github.com/Guitarmalade/SAUCE
Live editable mockup:        ~/sauce/references/guitarmalade-sauce-pack/
Original (black + orange):   ~/sauce/references/guitarmalade-sauce-pack/Guitarmalade SAUCE App.html
                             ~/sauce/references/guitarmalade-sauce-pack/Guitarmalade SAUCE App v2.html
Editing instructions:        ~/sauce/references/guitarmalade-sauce-pack/EDITING.md
```

### Commands to remember

Start the local mockup server (run in the project folder, leave the terminal open):

```
cd ~/sauce
python3 -m http.server 8000
```

Then visit:

- All mockup files: http://localhost:8000/references/guitarmalade-sauce-pack/
- Current editable home: http://localhost:8000/references/guitarmalade-sauce-pack/editable-home.html
- Original v2 (black + orange): http://localhost:8000/references/guitarmalade-sauce-pack/Guitarmalade%20SAUCE%20App%20v2.html

Stop the server when done: click into its terminal window and press **Ctrl + C**.

End-of-session git ritual (the daily loop):

```
git add .
git commit -m "what you did"
git push
```

Or compressed (only works if you didn't create new files):

```
git commit -am "what you did"
git push
```

Resume Codex:

```
codex resume          # picker
codex resume --last   # jump straight into last session
```

### Open questions / possible next steps

- Decide whether to delete Group B (the snapshot zips inside `~/sauce`) now that git history exists.
- Decide whether to keep `references/duolingo-clone/` long-term, or remove from git tracking (it's third-party reference and triggered the secret scanner).
- Commit the stray `.claude/` folder so `git status` stops showing it as untracked.
- Get back to actually editing the mockup — the editable-* HTML files for copy/layout, `editable-mockup.css` for colors/spacing/typography.
- Decide if the design direction is staying with the blue+white editable mockup or revisiting elements of the black+orange originals.

## Useful libraries / services to look at later

When ready to add real features to the app, these are widely-used and worth bookmarking. **Don't install yet** — pick one when there's a specific need, then ask Claude or Codex to walk through wiring it in.

### UI / "skins" (visual components)

- **shadcn/ui** — https://ui.shadcn.com — copy-paste React components, beautiful and modern. Probably the most useful single resource. No real install — you copy component code into the project.
- **Aceternity UI** — https://ui.aceternity.com — fancier animated components for polish.
- **lucide-react** — clean icon set. Already installed in this project.

### Backend services (full hosted services with libraries on GitHub)

- **Clerk** — https://clerk.com — drop-in user signup/login. ~5 minutes to set up.
- **Supabase** — https://supabase.com — full backend in a box: database, auth, file storage. Generous free tier.
- **Stripe** — https://stripe.com — handles payments. Useful for the free vs. paid access mentioned in the engineering spec.

### Music/guitar-specific libraries

- **Tone.js** — audio synthesis and playback. Already installed in this project.
- **VexFlow** — https://www.vexflow.com — music notation rendering. For displaying sheet music or tabs.
- **WaveSurfer.js** — https://wavesurfer.xyz — audio waveform visualization. Useful for practice playback UI.

### Three patterns for "using" GitHub stuff

Listed easiest to hardest:

1. **Copy-paste components** (shadcn-style) — copy code from a website, paste into the project. No install.
2. **Install a library** — one terminal command (`pnpm add <package>`), then `import` it in code.
3. **Clone a starter template** — `git clone <repo-url>` to copy a whole app as a starting point.

### Important rule

Don't grab random repos that look cool unless someone trusted (or an AI agent) confirms they're worth using. Lots of half-finished or abandoned code on GitHub. The names listed above are widely used and well-maintained — safe defaults.

## Session — May 6, 2026 — social schedule draft

### What got done

- Added `docs/marketing/2026-05-06-meta-schedule.md` with four Facebook/Instagram post slots for `8:00 AM`, `12:05 PM`, `12:50 PM`, and `8:00 PM` EDT.
- Added `docs/marketing/2026-05-06-x-schedule.md` with the matching four X post slots for `8:00 AM`, `12:05 PM`, `12:50 PM`, and `8:00 PM` EDT.
- Wrote a caption for `Triad Inversions Along and Across`.
- Wrote a caption for `A Minor Tapping Fun`.
- Wrote a caption for `Alternate Tuning CHEAT SHEET`.
- Wrote a caption for `I V vi IV 5 Ways`.
- Updated both schedule docs so the missed `8:00 AM` slot is now marked `Publish immediately` for Wednesday, May 6, 2026.

### Platform status

- X is complete for Wednesday, May 6, 2026:
  - `Triad Inversions Along and Across` posted live immediately.
  - `A Minor Tapping Fun` scheduled for `12:05 PM` EDT.
  - `Alternate Tuning CHEAT SHEET` scheduled for `12:50 PM` EDT.
  - `I V vi IV 5 Ways` scheduled for `8:00 PM` EDT.
- Meta Business Suite is complete for Wednesday, May 6, 2026:
  - `Triad Inversions Along and Across` published live immediately.
  - `A Minor Tapping Fun` scheduled for `12:05 PM` EDT.
  - `Alternate Tuning CHEAT SHEET` corrected from `11:50 PM` to `12:50 PM` EDT for both Facebook and Instagram.
  - `I V vi IV 5 Ways` scheduled for `8:00 PM` EDT.

## Session — May 6, 2026 — Merchant Center approval audit

### What got done

- Audited the live `guitarmalade.com` product pages that Merchant Center would crawl.
- Confirmed the public lesson and merch product pages on `guitarmalade.com` are mostly thin Webflow shells around Gumroad embeds.
- Confirmed `Guitarmalde Cookbook Vol. 1` is a Gumroad `ebook` / PDF digital download.
- Confirmed `Blues Dad BBQ` and `Guitarmalade Top 5 LICKS` are Gumroad `digital` products.
- Confirmed `Guitarmalade Sticker` is a Gumroad `physical` product.
- Wrote a detailed action note at `docs/marketing/2026-05-06-merchant-center-approval-audit.md`.

### What still needs to happen

- In Merchant Center, open the cookbook item and verify the exact disapproval reason text.
- If the issue says digital books / eBooks are not allowed in Shopping ads, remove the cookbook from Shopping ads instead of trying to force approval.
- Rebuild the Webflow product template so product detail pages contain real HTML product content instead of mostly just a Gumroad embed.
- Add policy pages: privacy, terms, refund policy, and shipping policy.
- Strengthen the site-wide business identity with clearer contact / business info.

## Session — May 8, 2026 — social posting

### What got done

- Scheduled four Meta Business Suite posts for Friday, May 8, 2026 at `12:05 PM`, `12:50 PM`, `5:30 PM`, and `8:00 PM` EDT.
- Published `Numbers In Music Cheat Sheet` immediately on Meta Business Suite.
- Published `Numbers In Music Cheat Sheet` immediately on X.
- Added a plain-language run log at `docs/marketing/2026-05-08-social-posts.md`.
- Added repo-local browser automation helpers:
  - `scripts/devtools/meta-schedule-guitarmalade-may08.mjs`
  - `scripts/devtools/x-schedule-guitarmalade-may08.mjs`
  - `scripts/devtools/meta-post-numbers-now.mjs`
  - `scripts/devtools/x-post-numbers-now.mjs`

### What still needs to happen

- If the four scheduled lesson graphics also need to be queued on X for Friday, May 8, 2026, that queue still needs to be completed. The earlier X scheduling run was intentionally stopped when the task changed to posting `Numbers In Music Cheat Sheet` right away.

## Session — May 9, 2026 — social posting

### What got done

- Published `Intervals Cheat Sheet` live at `8:00 AM` EDT on Meta Business Suite and X.
- Scheduled `Ionian + Major Pentatonic Cheat Sheet` for `12:05 PM` EDT on Meta Business Suite, Facebook, Instagram, and X.
- Scheduled `Kata-Kumoi Pentatonic` for `12:50 PM` EDT on Meta Business Suite, Facebook, Instagram, and X.
- Scheduled `Linear Progressions` plus `Line Cliche` as a two-image post for `8:00 PM` EDT on Meta Business Suite, Facebook, Instagram, and X.
- Added the plain-language run log at `docs/marketing/2026-05-09-social-posts.md`.
- Added repo-local browser automation helpers:
  - `scripts/devtools/meta-schedule-guitarmalade-may09.mjs`
  - `scripts/devtools/x-schedule-guitarmalade-may09.mjs`
  - `scripts/devtools/meta-post-intervals-8am-may09.mjs`
  - `scripts/devtools/x-post-intervals-8am-may09.mjs`

### What still needs to happen

- If you want stronger proof for the later X scheduled posts, do one more manual spot-check in X because the open drafts tab stayed stale during the browser check even though the one-off scheduler returned the expected scheduled summaries.
