#!/usr/bin/env node

const BROWSER_URL = process.env.CDP_BROWSER_URL ?? "http://127.0.0.1:9222";
const HOME_URL = "https://x.com/home";
const EDITOR_SELECTOR = '[data-testid="tweetTextarea_0"]';
const BUTTON_SELECTOR = '[data-testid="tweetButtonInline"]';
const FILE_SELECTOR = 'input[data-testid="fileInput"]';
const IMAGE_PATH = "/Users/chrisschreiner/Desktop/Guitarmalade Warmups/Intervals and hs copy.jpg";
const CAPTION =
  "Intervals cheat sheet breaks down interval names and half-step distances so the sound and the math line up. A solid reference for theory and fretboard work. Comment SAUCE for the link.";

function normalizeText(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

function functionExpression(fn, arg) {
  return `(${fn})(${JSON.stringify(arg)})`;
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
    "home composer",
    functionExpression(({ editorSelector, buttonSelector }) => {
      return (
        location.href.includes("/home") &&
        Boolean(document.querySelector(editorSelector)) &&
        Boolean(document.querySelector(buttonSelector))
      );
    }, { editorSelector: EDITOR_SELECTOR, buttonSelector: BUTTON_SELECTOR }),
    30_000
  );
}

async function setComposerText(connection, caption) {
  const result = await evaluate(
    connection,
    functionExpression(
      ({ editorSelector, nextCaption }) => {
        const editor = document.querySelector(editorSelector);
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
      { editorSelector: EDITOR_SELECTOR, nextCaption: caption }
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
      ({ editorSelector, expectedText }) => {
        const editor = document.querySelector(editorSelector);
        const text = normalize(editor?.innerText || editor?.textContent || "");
        return text === expectedText;

        function normalize(value) {
          return String(value ?? "")
            .replace(/\s+/g, " ")
            .trim();
        }
      },
      { editorSelector: EDITOR_SELECTOR, expectedText: expected }
    ),
    10_000,
    300
  );
}

async function uploadImages(connection, imagePaths) {
  const { root } = await connection.send("DOM.getDocument", { depth: 4, pierce: true });
  const { nodeId } = await connection.send("DOM.querySelector", {
    nodeId: root.nodeId,
    selector: FILE_SELECTOR
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
      ({ expectedCount }) => {
        return document.querySelectorAll('[aria-label="Remove media"]').length === expectedCount;
      },
      { expectedCount: imagePaths.length }
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

async function publishComposer(connection) {
  await clickSelector(connection, BUTTON_SELECTOR);
  await waitFor(
    connection,
    "composer clear after publish",
    functionExpression(({ editorSelector, captionText }) => {
      const editor = document.querySelector(editorSelector);
      const text = String(editor?.innerText || editor?.textContent || "").replace(/\s+/g, " ").trim();
      return text.length === 0 || text !== captionText;
    }, { editorSelector: EDITOR_SELECTOR, captionText: normalizeText(CAPTION) }),
    30_000,
    500
  );
}

async function main() {
  const connection = await openFreshConnection(HOME_URL);

  try {
    await waitForComposer(connection);
    await setComposerText(connection, CAPTION);
    await uploadImages(connection, [IMAGE_PATH]);
    await publishComposer(connection);
    console.log(JSON.stringify({ posted: true, images: [IMAGE_PATH] }, null, 2));
  } finally {
    connection.close();
  }
}

main().catch((error) => {
  console.error(error.stack || String(error));
  process.exitCode = 1;
});
