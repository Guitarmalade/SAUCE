#!/usr/bin/env node

import process from "node:process";

const BROWSER_URL = process.env.CDP_BROWSER_URL ?? "http://127.0.0.1:9222";

const ASSETS = {
  intervals: "/Users/chrisschreiner/Desktop/Guitarmalade Warmups/Intervals and hs copy.jpg"
};

function buildPosts() {
  return [
    {
      name: "Intervals Cheat Sheet",
      images: [ASSETS.intervals],
      caption: `Intervals cheat sheet breaks down interval names and half-step distances so the sound and the math line up.\n\nA solid reference for theory and fretboard work.\n\nComment SAUCE for the link.`
    }
  ];
}

class CDPConnection {
  constructor(socketUrl, socket) {
    this.socketUrl = socketUrl;
    this.socket = socket;
    this.nextId = 1;
    this.pending = new Map();
    this.eventHandlers = new Set();

    socket.addEventListener("message", (event) => {
      const payload = JSON.parse(String(event.data));

      if (Object.prototype.hasOwnProperty.call(payload, "id")) {
        const resolver = this.pending.get(payload.id);
        if (!resolver) {
          return;
        }

        this.pending.delete(payload.id);
        if (payload.error) {
          resolver.reject(new Error(payload.error.message ?? "CDP command failed."));
          return;
        }

        resolver.resolve(payload.result ?? {});
        return;
      }

      for (const handler of this.eventHandlers) {
        handler(payload);
      }
    });
  }

  static async open(socketUrl) {
    const socket = new WebSocket(socketUrl);
    await new Promise((resolve, reject) => {
      socket.addEventListener("open", resolve, { once: true });
      socket.addEventListener("error", () => reject(new Error(`Failed to connect to ${socketUrl}`)), { once: true });
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

  async waitForEvent(predicate, timeoutMs) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.eventHandlers.delete(onEvent);
        reject(new Error(`Timed out after ${timeoutMs}ms waiting for CDP event.`));
      }, timeoutMs);

      const onEvent = (payload) => {
        try {
          if (!predicate(payload)) {
            return;
          }

          clearTimeout(timer);
          this.eventHandlers.delete(onEvent);
          resolve(payload);
        } catch (error) {
          clearTimeout(timer);
          this.eventHandlers.delete(onEvent);
          reject(error);
        }
      };

      this.eventHandlers.add(onEvent);
    });
  }

  close() {
    this.socket.close();
  }
}

async function openMetaPage() {
  const response = await fetch(`${BROWSER_URL}/json/new?${encodeURIComponent("https://business.facebook.com/latest/home")}`, {
    method: "PUT"
  });

  if (!response.ok) {
    throw new Error(`Could not open Meta page via ${BROWSER_URL}`);
  }

  return response.json();
}

async function getMetaPage() {
  const response = await fetch(`${BROWSER_URL}/json/list`);
  if (!response.ok) {
    throw new Error(`Could not reach Chrome at ${BROWSER_URL}`);
  }

  const pages = await response.json();
  const page = pages.find((entry) => entry.type === "page" && entry.url.includes("business.facebook.com"));
  if (page) {
    return page;
  }

  return openMetaPage();
}

async function openConnection() {
  const page = await getMetaPage();
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

function functionExpression(fn, arg) {
  return `(${fn})(${JSON.stringify(arg)})`;
}

async function waitFor(connection, description, predicateExpression, timeoutMs = 30_000, intervalMs = 500) {
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

async function getClickableRectByText(connection, text) {
  const expression = functionExpression((needle) => {
    const normalize = (value) => (value || "").replace(/\s+/g, " ").trim();
    const candidates = [...document.querySelectorAll("button, [role='button']")]
      .map((element, index) => {
        const rect = element.getBoundingClientRect();
        return {
          index,
          text: normalize(element.innerText || element.textContent || ""),
          disabled:
            element.disabled ||
            element.getAttribute("aria-disabled") === "true" ||
            element.closest("[aria-disabled='true']") !== null,
          rect: {
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height
          }
        };
      })
      .filter((entry) => entry.rect.width > 0 && entry.rect.height > 0 && entry.text);

    const matches = candidates.filter((entry) => entry.text === needle && !entry.disabled);
    if (matches.length > 0) {
      return matches[matches.length - 1];
    }

    const partial = candidates.filter((entry) => entry.text.includes(needle) && !entry.disabled);
    return partial.length > 0 ? partial[partial.length - 1] : null;
  }, text);

  return evaluate(connection, expression);
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

async function clickButton(connection, text) {
  const match = await getClickableRectByText(connection, text);
  if (!match) {
    throw new Error(`Could not find clickable button with text "${text}".`);
  }

  const x = match.rect.left + match.rect.width / 2;
  const y = match.rect.top + match.rect.height / 2;
  await clickAt(connection, x, y);
}

async function ensureComposer(connection) {
  const state = await evaluate(
    connection,
    `(() => ({ url: location.href }))()`
  );

  if (state.url.includes("/latest/composer")) {
    return;
  }

  await clickButton(connection, "Create post");
  await waitFor(
    connection,
    "composer",
    `(() => location.href.includes('/latest/composer') && document.body.innerText.includes('Add photo/video'))()`,
    30_000
  );
}

async function insertCaption(connection, caption) {
  const firstLine = caption.split("\n").find((line) => line.trim()) ?? "SAUCE";
  const result = await evaluate(
    connection,
    functionExpression(({ nextCaption }) => {
      const normalize = (value) => String(value ?? "").replace(/\s+/g, " ").trim();
      const editors = [...document.querySelectorAll('div[contenteditable="true"]')]
        .filter((entry) => {
          const rect = entry.getBoundingClientRect();
          return rect.width > 200 && rect.height > 0;
        });

      const editor = editors[0];
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
    }, { nextCaption: caption })
  );

  if (!result?.inserted) {
    throw new Error("Could not insert Meta caption into the composer.");
  }

  await waitFor(
    connection,
    "caption text",
    functionExpression(
      ({ firstLineNeedle }) => {
        const body = document.body.innerText.toLowerCase();
        return body.includes(firstLineNeedle);
      },
      {
        firstLineNeedle: firstLine.toLowerCase()
      }
    ),
    15_000
  );
}

async function uploadImages(connection, imagePaths) {
  await connection.send("Page.setInterceptFileChooserDialog", { enabled: true });
  const chooserPromise = connection.waitForEvent((event) => event.method === "Page.fileChooserOpened", 15_000);
  await clickButton(connection, "Add photo/video");
  const chooser = await chooserPromise;

  await connection.send("DOM.setFileInputFiles", {
    files: imagePaths,
    backendNodeId: chooser.params.backendNodeId
  });

  await waitFor(
    connection,
    "uploaded media",
    `(() => {
      const body = document.body.innerText;
      return body.includes('Remove photo') || body.includes('Edit photo') || body.includes('Photo(s) will be auto-cropped');
    })()`,
    60_000,
    1000
  );
}

async function publishNow(connection) {
  await clickButton(connection, "Publish");

  let state = await waitFor(
    connection,
    "publish result",
    `(() => {
      if (location.href.includes('/latest/content_calendar/')) {
        return 'planner';
      }
      if (document.body.innerText.includes('Boost your post')) {
        return 'boost';
      }
      if (document.body.innerText.includes('Publishing your post')) {
        return 'publishing';
      }
      return '';
    })()`,
    45_000,
    1000
  );

  if (state === "publishing") {
    state = await waitFor(
      connection,
      "boost modal or planner",
      `(() => {
        if (location.href.includes('/latest/content_calendar/')) {
          return 'planner';
        }
        if (document.body.innerText.includes('Boost your post')) {
          return 'boost';
        }
        return '';
      })()`,
      45_000,
      1000
    );
  }

  if (state === "boost") {
    await clickButton(connection, "Maybe later");
  }

  await waitFor(
    connection,
    "planner after publishing",
    `(() => !location.href.includes('/latest/composer') && document.body.innerText.includes('Planner'))()`,
    45_000,
    1000
  );
}

async function main() {
  const [post] = buildPosts();
  const connection = await openConnection();

  try {
    await ensureComposer(connection);
    await uploadImages(connection, post.images);
    await insertCaption(connection, post.caption);
    await publishNow(connection);
    console.log(JSON.stringify({ posted: true, name: post.name, images: post.images }, null, 2));
  } finally {
    connection.close();
  }
}

main().catch((error) => {
  console.error(error.stack || String(error));
  process.exitCode = 1;
});
