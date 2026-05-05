#!/usr/bin/env node

import { EventEmitter } from "node:events";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import process from "node:process";

const DEFAULT_BROWSER_URL = process.env.CDP_BROWSER_URL ?? "http://127.0.0.1:9222";
const DEFAULT_TIMEOUT_MS = Number(process.env.CDP_TIMEOUT_MS ?? 15_000);
const DEFAULT_TRACE_MS = Number(process.env.CDP_TRACE_MS ?? 10_000);
const DEFAULT_ARTIFACT_DIR = resolve(process.cwd(), ".chrome-devtools/artifacts");

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
  console.log(`Small CDP helper for the local Chrome debug session.

Usage:
  node scripts/devtools/cdp.mjs <command> [options]

Commands:
  endpoint               Print Chrome version metadata and the browser WebSocket endpoint
  pages                  List current page targets
  console                Stream console output from a page target
  requests               Stream network requests from a page target
  screenshot             Capture a screenshot from a page target
  trace                  Capture a Chrome trace to a JSON artifact

Target selection:
  --open-url <url>       Create a fresh page target for the given URL
  --target-id <id>       Attach to a specific target id
  --target-index <n>     Attach to the nth page target from "pages"
  --target-title <text>  Attach to the first page whose title includes the text
  --target-url <text>    Attach to the first page whose URL includes the text

Shared options:
  --browser-url <url>    CDP browser URL. Default: ${DEFAULT_BROWSER_URL}
  --timeout-ms <ms>      Command timeout. Default: ${DEFAULT_TIMEOUT_MS}
  --json                 Print JSON for endpoint/pages

Command options:
  screenshot --out <file> [--full-page]
  trace --out <file> [--duration-ms <ms>]
`);
}

function normalizeBrowserUrl(value) {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

function numberOption(value, name) {
  const parsed = Number(value);
  if (Number.isNaN(parsed) || parsed < 0) {
    throw new Error(`Invalid ${name}: ${String(value)}`);
  }
  return parsed;
}

function artifactPath(filename) {
  return resolve(DEFAULT_ARTIFACT_DIR, filename);
}

function timestampLabel() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

function defaultScreenshotPath() {
  return artifactPath(`screenshot-${timestampLabel()}.png`);
}

function defaultTracePath() {
  return artifactPath(`trace-${timestampLabel()}.json`);
}

async function ensureParentDirectory(path) {
  await mkdir(dirname(path), { recursive: true });
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request to ${url} failed with ${response.status}.`);
  }
  return response.json();
}

async function getBrowserVersion(browserUrl) {
  return fetchJson(`${browserUrl}/json/version`);
}

async function listTargets(browserUrl) {
  const targets = await fetchJson(`${browserUrl}/json/list`);
  return targets.filter((target) => target.type === "page");
}

function formatTargetRows(targets) {
  return targets.map((target, index) => ({
    index,
    id: target.id,
    title: target.title,
    url: target.url
  }));
}

class CDPConnection extends EventEmitter {
  constructor(websocketUrl, socket) {
    super();
    this.websocketUrl = websocketUrl;
    this.socket = socket;
    this.nextId = 1;
    this.pending = new Map();

    socket.addEventListener("message", (event) => {
      const payload = JSON.parse(String(event.data));

      if (Object.prototype.hasOwnProperty.call(payload, "id")) {
        const pending = this.pending.get(payload.id);
        if (!pending) {
          return;
        }

        this.pending.delete(payload.id);

        if (payload.error) {
          pending.reject(new Error(payload.error.message ?? "CDP command failed."));
          return;
        }

        pending.resolve(payload.result ?? {});
        return;
      }

      this.emit("event", payload);
    });

    socket.addEventListener("close", () => {
      for (const pending of this.pending.values()) {
        pending.reject(new Error(`CDP socket closed for ${this.websocketUrl}.`));
      }
      this.pending.clear();
      this.emit("close");
    });

    socket.addEventListener("error", (event) => {
      this.emit("socket-error", event);
    });
  }

  static async open(websocketUrl) {
    const socket = new WebSocket(websocketUrl);

    await new Promise((resolvePromise, rejectPromise) => {
      socket.addEventListener("open", () => resolvePromise(), { once: true });
      socket.addEventListener("error", () => rejectPromise(new Error(`Failed to connect to ${websocketUrl}.`)), {
        once: true
      });
    });

    return new CDPConnection(websocketUrl, socket);
  }

  async send(method, params = {}, sessionId) {
    const id = this.nextId;
    this.nextId += 1;

    const payload = { id, method };
    if (params && Object.keys(params).length > 0) {
      payload.params = params;
    }
    if (sessionId) {
      payload.sessionId = sessionId;
    }

    const response = new Promise((resolvePromise, rejectPromise) => {
      this.pending.set(id, { resolve: resolvePromise, reject: rejectPromise });
    });

    this.socket.send(JSON.stringify(payload));
    return response;
  }

  waitForEvent(predicate, timeoutMs) {
    return new Promise((resolvePromise, rejectPromise) => {
      const timer = setTimeout(() => {
        cleanup();
        rejectPromise(new Error(`Timed out after ${timeoutMs}ms waiting for a CDP event.`));
      }, timeoutMs);

      const onEvent = (event) => {
        try {
          if (!predicate(event)) {
            return;
          }

          cleanup();
          resolvePromise(event);
        } catch (error) {
          cleanup();
          rejectPromise(error);
        }
      };

      const cleanup = () => {
        clearTimeout(timer);
        this.off("event", onEvent);
      };

      this.on("event", onEvent);
    });
  }

  close() {
    this.socket.close();
  }
}

async function resolveTarget(browserConnection, browserUrl, args) {
  if (args["open-url"]) {
    const { targetId } = await browserConnection.send("Target.createTarget", {
      url: "about:blank"
    });
    return { targetId, created: true };
  }

  const targets = await listTargets(browserUrl);

  if (targets.length === 0) {
    throw new Error("No page targets are open. Launch Chrome with a page or pass --open-url.");
  }

  if (args["target-id"]) {
    const target = targets.find((entry) => entry.id === args["target-id"]);
    if (!target) {
      throw new Error(`Could not find target id ${String(args["target-id"])}.`);
    }
    return { targetId: target.id, created: false };
  }

  if (args["target-title"]) {
    const fragment = String(args["target-title"]).toLowerCase();
    const target = targets.find((entry) => entry.title.toLowerCase().includes(fragment));
    if (!target) {
      throw new Error(`Could not find a page whose title includes "${String(args["target-title"])}".`);
    }
    return { targetId: target.id, created: false };
  }

  if (args["target-url"]) {
    const fragment = String(args["target-url"]);
    const target = targets.find((entry) => entry.url.includes(fragment));
    if (!target) {
      throw new Error(`Could not find a page whose URL includes "${fragment}".`);
    }
    return { targetId: target.id, created: false };
  }

  if (args["target-index"] !== undefined) {
    const targetIndex = numberOption(args["target-index"], "target index");
    const target = targets[targetIndex];
    if (!target) {
      throw new Error(`Could not find a page target at index ${targetIndex}.`);
    }
    return { targetId: target.id, created: false };
  }

  return { targetId: targets[0].id, created: false };
}

async function attachToTarget(browserConnection, targetId) {
  const { sessionId } = await browserConnection.send("Target.attachToTarget", {
    targetId,
    flatten: true
  });

  return sessionId;
}

async function waitForLoadEvent(browserConnection, sessionId, timeoutMs) {
  try {
    await browserConnection.waitForEvent(
      (event) => event.sessionId === sessionId && event.method === "Page.loadEventFired",
      timeoutMs
    );
  } catch {
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 500));
  }
}

async function maybeNavigateTarget(browserConnection, sessionId, openUrl, timeoutMs) {
  if (!openUrl) {
    return;
  }

  await browserConnection.send("Page.navigate", { url: openUrl }, sessionId);
  await waitForLoadEvent(browserConnection, sessionId, timeoutMs);
}

function formatRemoteObject(remoteObject) {
  if (Object.prototype.hasOwnProperty.call(remoteObject, "value")) {
    return JSON.stringify(remoteObject.value);
  }

  if (remoteObject.unserializableValue) {
    return remoteObject.unserializableValue;
  }

  if (remoteObject.description) {
    return remoteObject.description;
  }

  return remoteObject.type;
}

function untilInterruptOrTimeout(timeoutMs) {
  return new Promise((resolvePromise) => {
    const finish = () => {
      clearTimeout(timer);
      process.off("SIGINT", finish);
      resolvePromise();
    };

    const timer = setTimeout(finish, timeoutMs);
    process.once("SIGINT", finish);
  });
}

async function withTargetSession(args, callback) {
  const browserUrl = normalizeBrowserUrl(String(args["browser-url"] ?? DEFAULT_BROWSER_URL));
  const browserVersion = await getBrowserVersion(browserUrl);
  const browserConnection = await CDPConnection.open(browserVersion.webSocketDebuggerUrl);

  try {
    const target = await resolveTarget(browserConnection, browserUrl, args);
    const sessionId = await attachToTarget(browserConnection, target.targetId);
    await callback({
      browserUrl,
      browserConnection,
      browserVersion,
      createdTarget: target.created,
      openUrl: args["open-url"] ? String(args["open-url"]) : null,
      sessionId,
      targetId: target.targetId
    });
  } finally {
    browserConnection.close();
  }
}

async function commandEndpoint(args) {
  const browserUrl = normalizeBrowserUrl(String(args["browser-url"] ?? DEFAULT_BROWSER_URL));
  const browserVersion = await getBrowserVersion(browserUrl);

  if (args.json) {
    console.log(JSON.stringify(browserVersion, null, 2));
    return;
  }

  console.log(`Browser URL: ${browserUrl}`);
  console.log(`Browser WebSocket: ${browserVersion.webSocketDebuggerUrl}`);
  console.log(`Browser: ${browserVersion.Browser}`);
  console.log(`Protocol version: ${browserVersion["Protocol-Version"]}`);
  console.log(`User agent: ${browserVersion["User-Agent"]}`);
}

async function commandPages(args) {
  const browserUrl = normalizeBrowserUrl(String(args["browser-url"] ?? DEFAULT_BROWSER_URL));
  const targets = await listTargets(browserUrl);

  if (args.json) {
    console.log(JSON.stringify(targets, null, 2));
    return;
  }

  console.table(formatTargetRows(targets));
}

async function commandScreenshot(args) {
  const outputPath = resolve(String(args.out ?? defaultScreenshotPath()));
  const timeoutMs = numberOption(args["timeout-ms"] ?? DEFAULT_TIMEOUT_MS, "timeout");

  await withTargetSession(args, async ({ browserConnection, createdTarget, openUrl, sessionId }) => {
    await browserConnection.send("Page.enable", {}, sessionId);
    await browserConnection.send("Page.bringToFront", {}, sessionId).catch(() => undefined);

    if (createdTarget) {
      await maybeNavigateTarget(browserConnection, sessionId, openUrl, timeoutMs);
    } else if (args["delay-ms"]) {
      await new Promise((resolvePromise) =>
        setTimeout(resolvePromise, numberOption(args["delay-ms"], "delay"))
      );
    }

    const screenshot = await browserConnection.send(
      "Page.captureScreenshot",
      {
        format: "png",
        fromSurface: true,
        captureBeyondViewport: Boolean(args["full-page"])
      },
      sessionId
    );

    await ensureParentDirectory(outputPath);
    await writeFile(outputPath, Buffer.from(screenshot.data, "base64"));
  });

  console.log(`Wrote screenshot to ${outputPath}`);
}

async function commandConsole(args) {
  const timeoutMs = numberOption(args["timeout-ms"] ?? DEFAULT_TIMEOUT_MS, "timeout");

  await withTargetSession(args, async ({ browserConnection, createdTarget, openUrl, sessionId, targetId }) => {
    await browserConnection.send("Page.enable", {}, sessionId);
    await browserConnection.send("Runtime.enable", {}, sessionId);
    await browserConnection.send("Log.enable", {}, sessionId);

    if (createdTarget) {
      await maybeNavigateTarget(browserConnection, sessionId, openUrl, timeoutMs);
    }

    browserConnection.on("event", (event) => {
      if (event.sessionId !== sessionId) {
        return;
      }

      if (event.method === "Runtime.consoleAPICalled") {
        const values = event.params.args.map(formatRemoteObject).join(" ");
        console.log(`[console:${event.params.type}] ${values}`);
        return;
      }

      if (event.method === "Runtime.exceptionThrown") {
        console.log(`[exception] ${event.params.exceptionDetails.text}`);
        return;
      }

      if (event.method === "Log.entryAdded") {
        console.log(`[log:${event.params.entry.level}] ${event.params.entry.text}`);
      }
    });

    console.log(`Streaming console output from target ${targetId} for ${timeoutMs}ms. Press Ctrl+C to stop.`);
    await untilInterruptOrTimeout(timeoutMs);
  });
}

async function commandRequests(args) {
  const timeoutMs = numberOption(args["timeout-ms"] ?? DEFAULT_TIMEOUT_MS, "timeout");

  await withTargetSession(args, async ({ browserConnection, createdTarget, openUrl, sessionId, targetId }) => {
    const requests = new Map();

    await browserConnection.send("Page.enable", {}, sessionId);
    await browserConnection.send("Network.enable", {}, sessionId);

    if (createdTarget) {
      await maybeNavigateTarget(browserConnection, sessionId, openUrl, timeoutMs);
    }

    browserConnection.on("event", (event) => {
      if (event.sessionId !== sessionId) {
        return;
      }

      if (event.method === "Network.requestWillBeSent") {
        requests.set(event.params.requestId, {
          method: event.params.request.method,
          url: event.params.request.url
        });
        console.log(`[request] ${event.params.request.method} ${event.params.request.url}`);
        return;
      }

      if (event.method === "Network.responseReceived") {
        const request = requests.get(event.params.requestId);
        const method = request?.method ?? "GET";
        console.log(`[response] ${event.params.response.status} ${method} ${event.params.response.url}`);
        return;
      }

      if (event.method === "Network.loadingFailed") {
        const request = requests.get(event.params.requestId);
        console.log(`[failed] ${request?.method ?? "GET"} ${request?.url ?? event.params.requestId} ${event.params.errorText}`);
      }
    });

    console.log(`Streaming network activity from target ${targetId} for ${timeoutMs}ms. Press Ctrl+C to stop.`);
    await untilInterruptOrTimeout(timeoutMs);
  });
}

async function commandTrace(args) {
  const durationMs = numberOption(args["duration-ms"] ?? DEFAULT_TRACE_MS, "duration");
  const outputPath = resolve(String(args.out ?? defaultTracePath()));

  await withTargetSession(args, async ({ browserConnection, createdTarget, openUrl, sessionId }) => {
    const traceEvents = [];

    await browserConnection.send("Page.enable", {}, sessionId);
    await browserConnection.send(
      "Tracing.start",
      {
        transferMode: "ReportEvents"
      },
      sessionId
    );

    browserConnection.on("event", (event) => {
      if (event.sessionId === sessionId && event.method === "Tracing.dataCollected") {
        traceEvents.push(...event.params.value);
      }
    });

    if (createdTarget) {
      await maybeNavigateTarget(browserConnection, sessionId, openUrl, durationMs + 10_000);
    }

    console.log(`Tracing for ${durationMs}ms...`);
    await new Promise((resolvePromise) => setTimeout(resolvePromise, durationMs));

    const traceComplete = browserConnection.waitForEvent(
      (event) => event.sessionId === sessionId && event.method === "Tracing.tracingComplete",
      durationMs + 10_000
    );
    await browserConnection.send("Tracing.end", {}, sessionId);
    await traceComplete;

    await ensureParentDirectory(outputPath);
    await writeFile(outputPath, JSON.stringify({ traceEvents }, null, 2));
  });

  console.log(`Wrote trace to ${outputPath}`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const [command] = args._;

  if (!command || args.help) {
    printHelp();
    return;
  }

  if (command === "endpoint") {
    await commandEndpoint(args);
    return;
  }

  if (command === "pages") {
    await commandPages(args);
    return;
  }

  if (command === "console") {
    await commandConsole(args);
    return;
  }

  if (command === "requests") {
    await commandRequests(args);
    return;
  }

  if (command === "screenshot") {
    await commandScreenshot(args);
    return;
  }

  if (command === "trace") {
    await commandTrace(args);
    return;
  }

  throw new Error(`Unknown command "${command}".`);
}

await main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
