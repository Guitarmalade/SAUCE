#!/usr/bin/env node

import { spawn, spawnSync } from "node:child_process";
import { constants } from "node:fs";
import { access, mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import process from "node:process";

const DEFAULT_BROWSER_URL = process.env.CDP_BROWSER_URL ?? "http://127.0.0.1:9222";
const DEFAULT_START_URL = process.env.CDP_START_URL ?? "http://127.0.0.1:3000";
const DEFAULT_USER_DATA_DIR = process.env.CDP_USER_DATA_DIR ?? resolve(process.cwd(), ".chrome-devtools/profile");
const DEFAULT_TIMEOUT_MS = Number(process.env.CDP_STARTUP_TIMEOUT_MS ?? 15_000);

function parseArgs(argv) {
  const args = { _: [] };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (!arg.startsWith("--")) {
      args._.push(arg);
      continue;
    }

    const [rawKey, inlineValue] = arg.slice(2).split("=", 2);

    if (inlineValue !== undefined) {
      args[rawKey] = inlineValue;
      continue;
    }

    const next = argv[index + 1];
    if (next && !next.startsWith("--")) {
      args[rawKey] = next;
      index += 1;
      continue;
    }

    args[rawKey] = true;
  }

  return args;
}

function printHelp() {
  console.log(`Launch an isolated Chrome instance with the DevTools remote debugging port enabled.

Usage:
  node scripts/devtools/launch-chrome-debug.mjs [options]

Options:
  --browser-url <url>      CDP browser URL to wait for. Default: ${DEFAULT_BROWSER_URL}
  --chrome-bin <path>      Explicit Chrome binary path
  --headless               Launch Chrome headless
  --no-open                Start Chrome without opening a page
  --port <port>            Remote debugging port. Overrides the port in --browser-url
  --timeout-ms <ms>        Startup timeout. Default: ${DEFAULT_TIMEOUT_MS}
  --url <url>              Page to open on launch. Default: ${DEFAULT_START_URL}
  --user-data-dir <path>   Dedicated Chrome profile directory
  --help                   Show this help
`);
}

function normalizeBrowserUrl(value) {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

function inferPort(browserUrl) {
  const parsed = new URL(browserUrl);
  if (parsed.port) {
    return Number(parsed.port);
  }

  return parsed.protocol === "https:" ? 443 : 80;
}

async function pathExists(path, mode = constants.F_OK) {
  try {
    await access(path, mode);
    return true;
  } catch {
    return false;
  }
}

function commandExists(command) {
  const probe = process.platform === "win32" ? "where" : "which";
  const result = spawnSync(probe, [command], { stdio: "ignore" });
  return result.status === 0;
}

async function resolveChromeBinary(requestedPath) {
  const candidates = [];

  if (requestedPath) {
    candidates.push(requestedPath);
  }

  if (process.env.CHROME_BIN) {
    candidates.push(process.env.CHROME_BIN);
  }

  if (process.env.CHROME_PATH) {
    candidates.push(process.env.CHROME_PATH);
  }

  if (process.platform === "darwin") {
    candidates.push(
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary",
      "/Applications/Chromium.app/Contents/MacOS/Chromium"
    );
  }

  if (process.platform === "linux") {
    candidates.push("google-chrome-stable", "google-chrome", "chromium-browser", "chromium");
  }

  if (process.platform === "win32") {
    const windowsCandidates = [
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
      "C:\\Program Files\\Chromium\\Application\\chrome.exe",
      "C:\\Program Files (x86)\\Chromium\\Application\\chrome.exe"
    ];
    candidates.push(...windowsCandidates);
  }

  for (const candidate of candidates) {
    if (!candidate) {
      continue;
    }

    if (candidate.includes("/") || candidate.includes("\\") || candidate.endsWith(".exe")) {
      if (await pathExists(candidate, constants.X_OK)) {
        return candidate;
      }
      continue;
    }

    if (commandExists(candidate)) {
      return candidate;
    }
  }

  throw new Error(
    "Could not find a Chrome binary. Set CHROME_BIN or pass --chrome-bin to point at Chrome or Chromium."
  );
}

async function waitForBrowser(browserUrl, timeoutMs) {
  const startedAt = Date.now();
  let lastError;

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(`${browserUrl}/json/version`);
      if (response.ok) {
        return await response.json();
      }

      lastError = new Error(`Chrome responded with ${response.status} while waiting for ${browserUrl}.`);
    } catch (error) {
      lastError = error;
    }

    await new Promise((resolvePromise) => setTimeout(resolvePromise, 250));
  }

  throw new Error(
    `Timed out after ${timeoutMs}ms waiting for Chrome on ${browserUrl}.${lastError instanceof Error ? ` ${lastError.message}` : ""}`
  );
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    printHelp();
    return;
  }

  const initialBrowserUrl = normalizeBrowserUrl(String(args["browser-url"] ?? DEFAULT_BROWSER_URL));
  const port = Number(args.port ?? inferPort(initialBrowserUrl));
  const browserUrl = normalizeBrowserUrl(new URL(`http://127.0.0.1:${port}`).toString());
  const userDataDir = resolve(String(args["user-data-dir"] ?? DEFAULT_USER_DATA_DIR));
  const startupTimeoutMs = Number(args["timeout-ms"] ?? DEFAULT_TIMEOUT_MS);
  const shouldOpenPage = !args["no-open"];
  const startUrl = shouldOpenPage ? String(args.url ?? DEFAULT_START_URL) : null;

  if (Number.isNaN(port) || port <= 0) {
    throw new Error(`Invalid port: ${String(args.port)}`);
  }

  if (Number.isNaN(startupTimeoutMs) || startupTimeoutMs <= 0) {
    throw new Error(`Invalid timeout: ${String(args["timeout-ms"])}`);
  }

  const chromeBinary = await resolveChromeBinary(args["chrome-bin"]);
  await mkdir(userDataDir, { recursive: true });

  const chromeArgs = [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-background-networking",
    "--disable-component-update",
    "--disable-sync"
  ];

  if (args.headless) {
    chromeArgs.push("--headless=new", "--disable-gpu");
  }

  if (startUrl) {
    chromeArgs.push(startUrl);
  }

  const child = spawn(chromeBinary, chromeArgs, {
    detached: true,
    stdio: "ignore"
  });

  child.unref();

  const version = await waitForBrowser(browserUrl, startupTimeoutMs);

  console.log("Chrome debug session started.");
  console.log(`Chrome binary: ${chromeBinary}`);
  console.log(`Browser URL: ${browserUrl}`);
  console.log(`Browser WebSocket: ${version.webSocketDebuggerUrl}`);
  console.log(`User data dir: ${userDataDir}`);
  if (startUrl) {
    console.log(`Opened URL: ${startUrl}`);
  }
}

await main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
