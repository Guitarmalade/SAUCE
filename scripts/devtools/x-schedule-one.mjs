#!/usr/bin/env node

import process from "node:process";

const BROWSER_URL = process.env.CDP_BROWSER_URL ?? "http://127.0.0.1:9222";
const COMPOSE_URL = "https://x.com/compose/post";
const COMPOSE_MODAL = '[role="dialog"][aria-labelledby="modal-header"]';

function normalizeText(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

function functionExpression(fn, arg) {
  return `(${fn})(${JSON.stringify(arg)})`;
}

function pad(value) {
  return String(value).padStart(2, "0");
}

function timeLabel(date) {
  const rawHours = date.getHours();
  const hours12 = rawHours % 12 || 12;
  const meridiem = rawHours >= 12 ? "PM" : "AM";
  return `${hours12}:${pad(date.getMinutes())} ${meridiem}`;
}

function xScheduleSummary(date) {
  const weekday = date.toLocaleString("en-US", {
    weekday: "short",
    timeZone: "America/New_York"
  });
  const month = date.toLocaleString("en-US", {
    month: "short",
    timeZone: "America/New_York"
  });
  return `Will send on ${weekday}, ${month} ${date.getDate()}, ${date.getFullYear()} at ${timeLabel(date)}`;
}

function parseArgs(argv) {
  const args = { image: [] };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!arg.startsWith("--")) {
      continue;
    }

    const [key, inlineValue] = arg.slice(2).split("=", 2);
    if (inlineValue !== undefined) {
      if (key === "image") {
        args.image.push(inlineValue);
      } else {
        args[key] = inlineValue;
      }
      continue;
    }

    const nextValue = argv[index + 1];
    if (key === "image") {
      args.image.push(nextValue);
    } else {
      args[key] = nextValue;
    }
    index += 1;
  }

  return args;
}

class CDPConnection {
  constructor(socketUrl, socket) {
    this.socketUrl = socketUrl;
    this.socket = socket;
    this.nextId = 1;
    this.pending = new Map();

    socket.addEventListener("message", (event) => {
      const payload = JSON.parse(String(event.data));

      if (!Object.prototype.hasOwnProperty.call(payload, "id")) {
        return;
      }

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
    });
  }

  static async open(socketUrl) {
    const socket = new WebSocket(socketUrl);
    await new Promise((resolve, reject) => {
      socket.addEventListener("open", resolve, { once: true });
      socket.addEventListener(
        "error",
        () => reject(new Error(`Failed to connect to ${socketUrl}`)),
        { once: true }
      );
    });

    return new CDPConnection(socketUrl, socket);
  }

  async send(method, params = {}) {
    const id = this.nextId;
    this.nextId += 1;

    const response = new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
    });

    this.socket.send(JSON.stringify({ id, method, params }));
    return response;
  }

  close() {
    this.socket.close();
  }
}

async function openFreshConnection(url) {
  const response = await fetch(`${BROWSER_URL}/json/new?${encodeURIComponent(url)}`, {
    method: "PUT"
  });

  if (!response.ok) {
    throw new Error(`Could not open Chrome page for ${url}`);
  }

  const page = await response.json();
  const connection = await CDPConnection.open(page.webSocketDebuggerUrl);
  await connection.send("Page.enable");
  await connection.send("Runtime.enable");
  await connection.send("DOM.enable");
  return connection;
}

async function evaluate(connection, expression, { byValue = true } = {}) {
  const result = await connection.send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: byValue
  });

  return byValue ? result.result.value : result.result;
}

async function waitFor(connection, description, predicateExpression, timeoutMs = 30_000, intervalMs = 400) {
  const start = Date.now();

  while (Date.now() - start <= timeoutMs) {
    const matched = await evaluate(connection, predicateExpression);
    if (matched) {
      return matched;
    }

    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  throw new Error(`Timed out waiting for ${description}.`);
}

async function waitForComposer(connection) {
  await waitFor(
    connection,
    "dedicated composer",
    functionExpression((modalSelector) => {
      return (
        location.href === "https://x.com/compose/post" &&
        Boolean(document.querySelector(`${modalSelector} [data-testid="tweetButton"]`))
      );
    }, COMPOSE_MODAL),
    30_000
  );
}

async function setComposerText(connection, caption) {
  const result = await evaluate(
    connection,
    functionExpression(
      ({ modalSelector, nextCaption }) => {
        const editor = document.querySelector(`${modalSelector} [data-testid="tweetTextarea_0"]`);
        if (!editor) {
          return null;
        }

        editor.focus();
        editor.innerHTML = "";
        editor.textContent = "";

        const selection = window.getSelection();
        selection?.removeAllRanges();

        const range = document.createRange();
        range.selectNodeContents(editor);
        range.collapse(false);
        selection?.addRange(range);

        const inserted = document.execCommand("insertText", false, nextCaption);
        return {
          inserted,
          text: normalize(editor.innerText || editor.textContent || "")
        };

        function normalize(value) {
          return String(value ?? "")
            .replace(/\s+/g, " ")
            .trim();
        }
      },
      { modalSelector: COMPOSE_MODAL, nextCaption: caption }
    )
  );

  if (!result?.inserted) {
    throw new Error("Could not insert X caption into the composer.");
  }

  const expected = normalizeText(caption);
  await waitFor(
    connection,
    "caption text in composer",
    functionExpression(
      ({ modalSelector, expectedText }) => {
        const editor = document.querySelector(`${modalSelector} [data-testid="tweetTextarea_0"]`);
        const text = normalize(editor?.innerText || editor?.textContent || "");
        return text === expectedText;

        function normalize(value) {
          return String(value ?? "")
            .replace(/\s+/g, " ")
            .trim();
        }
      },
      { modalSelector: COMPOSE_MODAL, expectedText: expected }
    ),
    10_000,
    300
  );
}

async function uploadImages(connection, imagePaths) {
  const { root } = await connection.send("DOM.getDocument", { depth: 4, pierce: true });
  const { nodeId } = await connection.send("DOM.querySelector", {
    nodeId: root.nodeId,
    selector: `${COMPOSE_MODAL} input[data-testid="fileInput"]`
  });

  if (!nodeId) {
    throw new Error("Could not find the composer file input.");
  }

  const { node } = await connection.send("DOM.describeNode", { nodeId });
  await connection.send("DOM.setFileInputFiles", {
    files: imagePaths,
    backendNodeId: node.backendNodeId
  });

  await waitFor(
    connection,
    "uploaded media",
    functionExpression(
      ({ modalSelector, expectedCount }) => {
        const dialog = document.querySelector(modalSelector);
        return Boolean(dialog) && dialog.querySelectorAll('[aria-label="Remove media"]').length === expectedCount;
      },
      { modalSelector: COMPOSE_MODAL, expectedCount: imagePaths.length }
    ),
    30_000,
    500
  );
}

async function clickAt(connection, x, y) {
  await connection.send("Input.dispatchMouseEvent", {
    type: "mouseMoved",
    x,
    y,
    button: "left",
    buttons: 1
  });
  await connection.send("Input.dispatchMouseEvent", {
    type: "mousePressed",
    x,
    y,
    button: "left",
    buttons: 1,
    clickCount: 1
  });
  await connection.send("Input.dispatchMouseEvent", {
    type: "mouseReleased",
    x,
    y,
    button: "left",
    buttons: 1,
    clickCount: 1
  });
}

async function clickSelector(connection, selector) {
  const clicked = await evaluate(
    connection,
    functionExpression((needle) => {
      const element = document.querySelector(needle);
      if (!element) {
        return null;
      }

      element.click();
      const rect = element.getBoundingClientRect();
      return {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height
      };
    }, selector)
  );

  if (!clicked) {
    throw new Error(`Could not find selector: ${selector}`);
  }

  if (clicked.width > 0 && clicked.height > 0) {
    return;
  }

  await clickAt(connection, clicked.left + clicked.width / 2, clicked.top + clicked.height / 2);
}

async function openScheduleDialog(connection) {
  await clickSelector(connection, `${COMPOSE_MODAL} [data-testid="scheduleOption"]`);
  await waitFor(
    connection,
    "schedule dialog",
    `(() => location.href.includes('/compose/post/schedule') && [...document.querySelectorAll('[role="dialog"]')].some((dialog) => dialog.querySelectorAll('select').length === 6))()`,
    15_000
  );
}

async function setSchedule(connection, date) {
  const values = [
    String(date.getMonth() + 1),
    String(date.getDate()),
    String(date.getFullYear()),
    String(date.getHours() % 12 || 12),
    String(date.getMinutes()),
    date.getHours() >= 12 ? "pm" : "am"
  ];

  await evaluate(
    connection,
    functionExpression((nextValues) => {
      const dialog = [...document.querySelectorAll('[role="dialog"]')].find(
        (element) => element.querySelectorAll("select").length === 6
      );

      if (!dialog) {
        throw new Error("Could not find the X schedule dialog.");
      }

      const selects = [...dialog.querySelectorAll("select")];
      for (let index = 0; index < selects.length; index += 1) {
        const select = selects[index];
        select.focus();
        select.value = nextValues[index];
        select.dispatchEvent(new Event("input", { bubbles: true }));
        select.dispatchEvent(new Event("change", { bubbles: true }));
      }

      return selects.map((select) => select.value);
    }, values)
  );

  const expectedSummary = xScheduleSummary(date);
  await waitFor(
    connection,
    `updated X schedule ${timeLabel(date)}`,
    functionExpression((needle) => {
      const dialog = [...document.querySelectorAll('[role="dialog"]')].find(
        (element) => element.querySelectorAll("select").length === 6
      );
      return Boolean(dialog && dialog.innerText.includes(needle));
    }, expectedSummary),
    10_000,
    300
  );
}

async function confirmSchedule(connection, date) {
  await clickSelector(connection, '[data-testid="scheduledConfirmationPrimaryAction"]');

  const expectedSummary = xScheduleSummary(date);
  await waitFor(
    connection,
    "scheduled indicator",
    functionExpression(
      ({ modalSelector, summary }) => {
        const dialog = document.querySelector(modalSelector);
        const indicator = dialog?.querySelector('[data-testid="scheduledTweetIndicator"]');
        return (
          location.href === "https://x.com/compose/post" &&
          normalize(indicator?.innerText || indicator?.textContent || "").includes(normalize(summary))
        );

        function normalize(value) {
          return String(value ?? "")
            .replace(/\s+/g, " ")
            .trim();
        }
      },
      { modalSelector: COMPOSE_MODAL, summary: expectedSummary }
    ),
    15_000,
    300
  );
}

async function saveComposer(connection) {
  await clickSelector(connection, `${COMPOSE_MODAL} [data-testid="tweetButton"]`);
  await new Promise((resolve) => setTimeout(resolve, 3_000));
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const images = args.image.filter(Boolean);
  const caption = args.caption;
  const year = Number(args.year);
  const month = Number(args.month);
  const day = Number(args.day);
  const hour = Number(args.hour);
  const minute = Number(args.minute);

  if (images.length === 0 || !caption || !year || !month || !day || Number.isNaN(hour) || Number.isNaN(minute)) {
    throw new Error(
      "Usage: node x-schedule-one.mjs --image <path> [--image <path> ...] --caption <text> --year YYYY --month M --day D --hour H --minute M"
    );
  }

  const scheduledDate = new Date(year, month - 1, day, hour, minute, 0, 0);
  const connection = await openFreshConnection(COMPOSE_URL);

  try {
    await waitForComposer(connection);
    await setComposerText(connection, caption);
    await uploadImages(connection, images);
    await openScheduleDialog(connection);
    await setSchedule(connection, scheduledDate);
    await confirmSchedule(connection, scheduledDate);
    await saveComposer(connection);
    console.log(JSON.stringify({ summary: xScheduleSummary(scheduledDate), images }, null, 2));
  } finally {
    connection.close();
  }
}

main().catch((error) => {
  console.error(error.stack || String(error));
  process.exitCode = 1;
});
