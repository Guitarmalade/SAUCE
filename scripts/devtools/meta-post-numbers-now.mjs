#!/usr/bin/env node

import process from "node:process";

const BROWSER_URL = process.env.CDP_BROWSER_URL ?? "http://127.0.0.1:9222";

const ASSETS = {
  numbersInMusic: "/Users/chrisschreiner/Desktop/Guitarmalade Warmups/Numbers In Music copy.jpg"
};

function buildPosts() {
  return [
    {
      name: "Numbers In Music Cheat Sheet",
      images: [ASSETS.numbersInMusic],
      caption: `Numbers in music start to make more sense when you can see what each number is doing.\n\nThis cheat sheet breaks down intervals, scale degrees, and Roman numerals so the theory stops feeling scattered.\n\nComment SAUCE for the link.`
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

async function getMetaPage() {
  const response = await fetch(`${BROWSER_URL}/json/list`);
  if (!response.ok) {
    throw new Error(`Could not reach Chrome at ${BROWSER_URL}`);
  }

  const pages = await response.json();
  const page = pages.find((entry) => entry.type === "page" && entry.url.includes("business.facebook.com"));
  if (!page) {
    throw new Error("No Meta Business Suite page is open in the debug browser.");
  }

  return page;
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

      for (const editor of editors) {
        editor.innerHTML = "";
        editor.textContent = nextCaption;
        editor.dispatchEvent(new InputEvent("input", { bubbles: true, data: nextCaption, inputType: "insertText" }));
      }

      return editors.map((entry) => normalize(entry.innerText || entry.textContent || ""));
    }, { nextCaption: caption })
  );

  if (!Array.isArray(result) || result.length === 0) {
    throw new Error("Could not find a visible Meta caption editor.");
  }

  await waitFor(
    connection,
    "caption text",
    functionExpression(
      ({ firstLineNeedle }) => {
        const normalize = (value) => String(value ?? "").replace(/\s+/g, " ").trim().toLowerCase();
        return [...document.querySelectorAll('div[contenteditable="true"]')]
          .filter((entry) => {
            const rect = entry.getBoundingClientRect();
            return rect.width > 200 && rect.height > 0;
          })
          .some((entry) => normalize(entry.innerText || entry.textContent || "").includes(firstLineNeedle));
      },
      {
        firstLineNeedle: firstLine.toLowerCase()
      }
    ),
    15_000
  );
}

async function hasUploadedMedia(connection) {
  return evaluate(
    connection,
    `(() => document.body.innerText.includes('Photo will be auto-cropped') || document.body.innerText.includes('Photo(s) will be auto-cropped'))()`
  );
}

async function enableScheduling(connection) {
  const state = await evaluate(
    connection,
    `(() => {
      const input = document.querySelector('input[aria-label="Set date and time"]');
      if (!input) {
        return { found: false };
      }
      return {
        found: true,
        checked: input.checked || input.getAttribute('value') === 'true',
        hasTimeInputs: document.body.innerText.includes('Time input')
      };
    })()`
  );

  if (!state?.found) {
    throw new Error('Could not find the "Set date and time" control.');
  }

  if (!state.checked) {
    await evaluate(
      connection,
      `(() => {
        const input = document.querySelector('input[aria-label="Set date and time"]');
        input?.click();
        return true;
      })()`
    );
  }

  await waitFor(
    connection,
    "schedule controls",
    `(() => {
      const input = document.querySelector('input[aria-label="Set date and time"]');
      const checked = input && (input.checked || input.getAttribute('value') === 'true');
      return Boolean(checked && document.body.innerText.includes('Time input'));
    })()`,
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

async function setScheduleTime(connection, scheduleParts) {
  const updated = await evaluate(
    connection,
    functionExpression((nextParts) => {
      const getFiber = (element) => {
        for (const key of Object.keys(element || {})) {
          if (key.startsWith("__reactFiber$")) {
            return element[key];
          }
        }
        return null;
      };

      const inputs = [...document.querySelectorAll('input[aria-label="hours"]')];
      for (const input of inputs) {
        let fiber = getFiber(input);

        while (fiber) {
          const props = fiber.memoizedProps || fiber.pendingProps;
          if (props && props.scheduleTimes && props.setScheduleTimes) {
            const publishTime = props.scheduleTimes.publishTime;
            const nextPublishTime = publishTime.set(nextParts);
            props.setScheduleTimes({ publishTime: nextPublishTime });
            return {
              before: String(publishTime),
              after: String(nextPublishTime)
            };
          }
          fiber = fiber.return;
        }
      }

      return null;
    }, scheduleParts)
  );

  if (!updated) {
    throw new Error("Could not locate Meta schedule state.");
  }

  const expectedLabel = timeLabel(
    new Date(TODAY.year, TODAY.month - 1, TODAY.day, scheduleParts.hour, scheduleParts.minute, 0, 0)
  );
  const rawHours = scheduleParts.hour % 12 || 12;
  const expectedHour = pad(rawHours);
  const expectedMinute = pad(scheduleParts.minute);
  const expectedMeridiem = scheduleParts.hour >= 12 ? "PM" : "AM";

  await waitFor(
    connection,
    `schedule time ${expectedLabel}`,
    functionExpression(({ hour, minute, meridiem }) => {
      const values = [...document.querySelectorAll('input[aria-label="hours"], input[aria-label="minutes"], input[aria-label="meridiem"]')]
        .map((entry) => (entry.parentElement?.innerText || "").replace(/\s+/g, " ").trim());
      return values.length >= 6 &&
        values[0] === hour &&
        values[1] === minute &&
        values[2] === meridiem &&
        values[3] === hour &&
        values[4] === minute &&
        values[5] === meridiem;
    }, {
      hour: expectedHour,
      minute: expectedMinute,
      meridiem: expectedMeridiem
    }),
    15_000
  );

  const warning = await evaluate(
    connection,
    `(() => document.body.innerText.includes('Scheduled posts need to be shared between 20 minutes and 29 days from when you create them.'))()`
  );
  if (warning) {
    throw new Error(`Meta still shows a schedule warning after setting ${expectedLabel}.`);
  }
}

async function waitForPublishButtonEnabled(connection) {
  await waitFor(
    connection,
    "enabled Publish button",
    `(() => {
      const normalize = (value) => (value || '').replace(/\\s+/g, ' ').trim();
      const buttons = [...document.querySelectorAll('button, [role="button"]')].map((element) => ({
        text: normalize(element.innerText || element.textContent || ''),
        disabled:
          element.disabled ||
          element.getAttribute('aria-disabled') === 'true' ||
          element.closest('[aria-disabled="true"]') !== null
      }));
      return buttons.some((entry) => entry.text === 'Publish' && !entry.disabled);
    })()`,
    30_000
  );
}

async function submitPublish(connection) {
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
      if (document.body.innerText.includes('Your post is now published')) {
        return 'published';
      }
      return '';
    })()`,
    45_000,
    1000
  );

  if (state === "publishing") {
    state = await waitFor(
      connection,
      "boost modal, published state, or planner",
      `(() => {
        if (location.href.includes('/latest/content_calendar/')) {
          return 'planner';
        }
        if (document.body.innerText.includes('Boost your post')) {
          return 'boost';
        }
        if (document.body.innerText.includes('Your post is now published')) {
          return 'published';
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

  if (state !== "published") {
    await waitFor(
      connection,
      "planner after publishing",
      `(() => !location.href.includes('/latest/composer') && document.body.innerText.includes('Planner'))()`,
      45_000,
      1000
    );
  }
}

async function publishPost(connection, post) {
  console.log(`Publishing "${post.name}" now`);
  await ensureComposer(connection);
  if (!(await hasUploadedMedia(connection))) {
    await uploadImages(connection, post.images);
  }
  await insertCaption(connection, post.caption);
  await waitForPublishButtonEnabled(connection);
  await submitPublish(connection);
}

async function main() {
  const posts = buildPosts();
  const connection = await openConnection();

  try {
    for (const post of posts) {
      await publishPost(connection, post);
    }

    const results = posts.map((post) => ({
      name: post.name,
      images: post.images
    }));

    console.log(JSON.stringify(results, null, 2));
  } finally {
    connection.close();
  }
}

main().catch((error) => {
  console.error(error.stack || String(error));
  process.exitCode = 1;
});
