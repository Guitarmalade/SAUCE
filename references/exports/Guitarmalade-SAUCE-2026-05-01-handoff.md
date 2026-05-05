# Guitarmalade SAUCE Handoff

Saved on May 1, 2026.

## Snapshot

- Latest prototype ZIP: `references/exports/Guitarmalade-SAUCE-App-2026-05-01-223709.zip`
- Prototype source folder: `references/guitarmalade-sauce-pack`
- Local preview URL used in this session: `http://localhost:3000`

## What is in the prototype folder

- Original Claude export:
  - `Guitarmalade SAUCE App v2.html`
  - `Guitarmalade SAUCE App.html`
  - supporting `.jsx` files
- Easy-edit mockup:
  - `editable-home.html`
  - `editable-dashboard.html`
  - `editable-practice.html`
  - `editable-mockup.css`
  - `editable-ui.js`
  - `EDITING.md`

## Important changes saved

- Added browser edit mode for the editable mockup:
  - click blue-underlined text to edit copy
  - bottom-right panel changes main colors
  - edits auto-save in the browser
- Updated the folder root `index.html` to redirect to `editable-home.html`
- Fixed the iPhone status bar overlap in `ios-frame.jsx` by adding top safe-area padding so the time, signal, Wi-Fi, battery, and XP/header content do not collide

## Export notes

- The ZIP contains the current `references/guitarmalade-sauce-pack` folder
- To create another snapshot later, run:

```bash
cd /Users/chrisschreiner/sauce
make prototype-zip
```

or:

```bash
cd /Users/chrisschreiner/sauce
pnpm prototype:zip
```

## Closing note

- If the terminal window serving `http://localhost:3000` is closed, that local preview server stops
- The files and ZIP remain saved on disk
