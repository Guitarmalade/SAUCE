# Claude Design Production Handoff

Reviewed on April 24, 2026 against:

- local export: `/Users/chrisschreiner/Desktop/Guitarmalade SAUCE App.zip`
- repo: `/Users/chrisschreiner/sauce`

## Audit Result

The Claude Design export pack is not currently in the repository.

What is in the repo:

- the product/domain framing for SAUCE
- seeded curriculum and dashboard scaffolding
- documentation that references the same curriculum source files

What is not in the repo:

- `Guitarmalade SAUCE App v2.html`
- `Guitarmalade SAUCE App.html`
- `ios-frame.jsx`
- `sauce-notation.jsx`
- `sauce-recorder.jsx`
- `sauce-screens.jsx`
- `sauce-v2-screens.jsx`
- `tweaks-panel.jsx`
- the exported PNG screenshots

Important nuance:

- the repo already references `1 The Guitarmalade S.A.U.C.E. Method.pdf` and `Guitarmalade CORE 1-5.pdf` in [docs/product/source-material-ingest.md](/Users/chrisschreiner/sauce/docs/product/source-material-ingest.md), but those raw files are not stored in this codebase.

## How Claude Design Works

Official Anthropic documentation describes Claude Design as a chat-plus-canvas workflow:

- a chat interface on the left and a canvas on the right
- the user adds context such as screenshots and a codebase
- Claude generates a working design on the canvas
- the design is iterated through chat and inline comments
- the result can be exported as `.zip`, `standalone HTML`, `PDF`, `PPTX`, or handed off to Claude Code

Anthropic also states that Claude Design can inherit an organization design system, and that the design system is built by extracting reusable components, colors, typography, and layout patterns from uploaded codebases and design references.

Sources:

- https://support.claude.com/en/articles/14604416-get-started-with-claude-design
- https://support.claude.com/en/articles/14604397-set-up-your-design-system-in-claude-design
- https://support.claude.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them
- https://claude.com/resources/tutorials/prototype-ai-powered-apps-with-claude-artifacts

## What The ZIP Tells Us

This export is a prototype package, not production application source.

Signals:

- standalone HTML entrypoints
- JSX files intended for browser-side loading
- React and Babel loaded from public CDNs
- heavy inline styling
- local prototype state and demo data
- no integration with the repo’s `packages/*` domain model or API routes

That is normal. Anthropic’s own artifact guidance positions these outputs as excellent for prototyping and sharing, then recommends copying the code into a real editor and moving to proper infrastructure when taking a project to production.

## Industry Gold Standard Practice

For this repo, the correct standard is:

1. Treat Claude Design output as product and UX input, not authoritative app source.
2. Preserve the raw export as evidence of design intent, but keep it outside the runtime path.
3. Extract the durable parts:
   - information architecture
   - route ideas
   - design tokens
   - component patterns
   - interaction states
   - copy and hierarchy
4. Rebuild the result in repo-native code:
   - Next App Router
   - shared curriculum and domain packages
   - typed data contracts
   - CSS and components maintained inside the monorepo
5. Bind every visible screen to real product rules:
   - curriculum progression
   - onboarding profile
   - practice logging
   - subscription gating
6. Verify accessibility, responsiveness, and performance before calling the work done.

## Repo Policy For Claude Design Imports

### Allowed

- using exported screenshots as visual reference
- using export files to derive layout and content decisions
- creating implementation tickets from Claude Design outputs
- archiving approved exports in a `docs/design/exports/` area if the team wants a historical record

### Not Allowed

- shipping the raw exported HTML as the product
- adding browser Babel/UMD prototype files to the Next app runtime
- duplicating mock data when a typed domain model already exists
- letting prototype wording override canonical product docs without review

## Productionization Checklist

Any Claude Design export must pass this checklist before it becomes repo work:

1. Product fit
   - Does the design reinforce `C.O.R.E.`, `S.A.U.C.E.`, and `turn it into music`?
2. IA mapping
   - Which current routes does it change: `/`, `/dashboard`, `/practice`, `/curriculum`, `/onboarding`?
3. Domain mapping
   - Which existing types or packages should own the data?
4. Token extraction
   - Which colors, type roles, spacing rules, and card patterns are durable?
5. Component extraction
   - Which parts become reusable components instead of one-off markup?
6. State and edge cases
   - Empty state, loading, progress locked, free tier gating, mobile layout
7. Quality gate
   - Typecheck, responsive pass, keyboard pass, copy pass

## Recommended Application To This Export

Keep:

- the stronger dashboard framing
- practice-session orientation and checklists
- clearer content grouping around recipe, tricks, and curriculum
- the idea of turning the method into a daily operating system

Rewrite:

- the raw HTML shell
- the inline-only styling approach
- the browser-loaded React/Babel stack
- any demo-only local storage behavior
- any navigation labels that do not map cleanly to current product routes

## Immediate Next Steps

1. Establish a production-grade app shell and home page in `apps/web`.
2. Translate the best prototype concepts into the existing route model.
3. Add missing product surfaces only after the domain model is defined.
4. Import curriculum assets deliberately, with ownership and storage rules, instead of burying them in a design export.
