# Chrome DevTools For Agents

This repo now includes a small Chrome/CDP workflow for local debugging and agent handoff.

## What is in the repo

- `scripts/devtools/launch-chrome-debug.mjs` starts Chrome with a dedicated remote debugging profile
- `scripts/devtools/cdp.mjs` gives the repo a small CDP helper CLI for screenshots, traces, console logs, and request inspection
- `.mcp.json` points workspace-aware MCP clients at the dedicated Chrome debug browser on port `9222`
- root `package.json` scripts expose the common entrypoints
- `.chrome-devtools/` is reserved for the isolated Chrome profile and generated artifacts

## Why this shape

- Chrome MCP is the agent-facing interface.
- Raw CDP stays behind a tiny repo-local helper so humans and agents share the same browser-debug entrypoints.
- The browser profile is isolated on purpose. Chrome's remote debugging security changes require a non-default `--user-data-dir`, and this also avoids exposing your normal browsing profile.

## Recommended local workflow

1. Start the app stack:

```bash
pnpm dev
```

2. Start the dedicated Chrome debug browser:

```bash
pnpm dev:chrome:app
```

This opens the app in Chrome with the DevTools remote debugging port on `http://127.0.0.1:9222`.

3. Inspect the browser directly from the repo when needed:

```bash
pnpm cdp:endpoint
pnpm cdp:pages
pnpm cdp:screenshot -- --target-url http://127.0.0.1:3000
pnpm cdp:console -- --target-url http://127.0.0.1:3000 --timeout-ms 15000
pnpm cdp:requests -- --target-url http://127.0.0.1:3000 --timeout-ms 15000
pnpm cdp:trace -- --open-url http://127.0.0.1:3000/dashboard --duration-ms 10000
```

Artifacts land in `.chrome-devtools/artifacts/` unless you pass `--out`.

## Codex and Chrome MCP

The stable repo-oriented setup is to point the MCP server at the dedicated Chrome instance started by `pnpm dev:chrome:app`:

```bash
codex mcp add chrome-devtools -- npx -y chrome-devtools-mcp@latest --browser-url=http://127.0.0.1:9222 --no-usage-statistics
```

Why this is the default:

- it binds the agent to the same isolated project browser every time
- it avoids mixing agent automation with your personal Chrome profile
- it keeps the repo scripts and the MCP server aligned on the same CDP endpoint

After that, restart Codex if needed and ask it to inspect or debug the running app in Chrome.

If your MCP client auto-loads workspace `.mcp.json` files, this repo already includes the same browser-url-based configuration.

## Live session handoff

If you want an agent to attach to your existing signed-in Chrome session instead of the isolated project profile, Chrome DevTools MCP also supports auto-connection to a live browser session.

Use that only when you explicitly want session reuse, such as debugging a future authenticated flow.

High-level flow:

1. Enable remote debugging in Chrome at `chrome://inspect/#remote-debugging`.
2. Configure Chrome MCP with `--autoConnect`.
3. Approve the Chrome permission prompt when the agent requests a debugging session.

Example:

```bash
codex mcp add chrome-devtools -- npx -y chrome-devtools-mcp@latest --autoConnect --no-usage-statistics
```

That mode is useful later for auth, payments, and any flow where recreating browser state is expensive. It is not the default repo workflow because it intentionally gives the agent access to your active browser session.

## CDP helper commands

`pnpm dev:chrome`

- Start an isolated Chrome debug session. Defaults to `http://127.0.0.1:9222`.

`pnpm dev:chrome:app`

- Start the isolated Chrome debug session and open `http://127.0.0.1:3000`.

`pnpm cdp:endpoint`

- Print browser metadata and the browser WebSocket endpoint.

`pnpm cdp:pages`

- List current page targets so you can pick a target id, URL fragment, or index.

`pnpm cdp:console -- --target-url http://127.0.0.1:3000`

- Stream console output from the selected page target.

`pnpm cdp:requests -- --target-url http://127.0.0.1:3000`

- Stream network requests and responses from the selected page target.

`pnpm cdp:screenshot -- --target-url http://127.0.0.1:3000`

- Capture a PNG screenshot from the selected page target.

`pnpm cdp:trace -- --open-url http://127.0.0.1:3000/dashboard`

- Capture a Chrome trace for a fixed duration and write the JSON artifact locally.

## Notes for this repo

- `apps/web` defaults to `http://127.0.0.1:3000`
- `apps/api` defaults to `http://127.0.0.1:4000`
- the current high-value agent flows are onboarding, dashboard, curriculum, and practice logging
- when you need repeatable regression coverage later, keep that separate from MCP/CDP debugging and add a dedicated browser test runner
