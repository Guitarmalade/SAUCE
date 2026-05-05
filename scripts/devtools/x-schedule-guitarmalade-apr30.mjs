#!/usr/bin/env node

import process from "node:process";

const BROWSER_URL = process.env.CDP_BROWSER_URL ?? "http://127.0.0.1:9222";
const HOME_URL = "https://x.com/home";
const COMPOSE_URL = "https://x.com/compose/post";
const SCHEDULED_URL = "https://x.com/compose/post/unsent/scheduled";
const COMPOSE_MODAL = '[role="dialog"][aria-labelledby="modal-header"]';
const TARGET_DAY = { year: 2026, month: 4, day: 30 };

const ASSETS = {
  tappingChordProgressions: "/Users/chrisschreiner/Desktop/Guitarmalade Warmups/tappin chord prog copy.jpg",
  stringSkippingArpeggio: "/Users/chrisschreiner/Desktop/Guitarmalade Warmups/String skipping arpeggio cheat sheet copy.jpg",
  shoegazeSauce: "/Users/chrisschreiner/Desktop/Guitarmalade Warmups/Shoegaze sauce 1 copy.jpg",
  addNineChords: "/Users/chrisschreiner/Desktop/Guitarmalade Warmups/secret chords add 9 copy.jpg"
};

function pad(value) {
  return String(value).padStart(2, "0");
}

function normalizeText(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

function timeLabel(date) {
  const rawHours = date.getHours();
  const hours12 = rawHours % 12 || 12;
  const meridiem = rawHours >= 12 ? "PM" : "AM";
  return `${hours12}:${pad(date.getMinutes())} ${meridiem}`;
}

function parseTimeLabel(label) {
  const match = String(label).trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) {
    throw new Error(`Invalid time label: ${label}`);
  }

  let hour = Number(match[1]) % 12;
  const minute = Number(match[2]);
  const meridiem = match[3].toUpperCase();
  if (meridiem === "PM") {
    hour += 12;
  }

  return new Date(TARGET_DAY.year, TARGET_DAY.month - 1, TARGET_DAY.day, hour, minute, 0, 0);
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

function buildPosts() {
  return [
    {
      name: "Tapping Chord Progressions",
      requestedTime: "8:00 AM",
      scheduledDate: parseTimeLabel("8:00 AM"),
      images: [ASSETS.tappingChordProgressions],
      caption:
        "Never know what to practice when the chords change? Start with a real progression. This gives your tapping a job so it stops sounding random and starts sounding musical. Comment SAUCE for the link. #guitar #tapping"
    },
    {
      name: "String Skipping Arpeggio",
      requestedTime: "12:05 PM",
      scheduledDate: parseTimeLabel("12:05 PM"),
      images: [ASSETS.stringSkippingArpeggio],
      caption:
        "Learned a bunch of licks but still cannot connect them? This string-skipping arpeggio page helps turn shapes into lines you can actually use in solos. Great fix for disconnected practice. Comment SAUCE for the link. #guitar #leadguitar"
    },
    {
      name: "Shoegaze Sauce",
      requestedTime: "12:50 PM",
      scheduledDate: parseTimeLabel("12:50 PM"),
      images: [ASSETS.shoegazeSauce],
      caption:
        "Not sure how to turn scales, chords, and lead ideas into music? This page gives you a practice path: notes, voicings, loop, then improv. Much easier to integrate concepts when the steps are clear. Comment SAUCE for the link. #guitar #shoegaze"
    },
    {
      name: "Saucey Add 9 Chords",
      requestedTime: "8:00 PM",
      scheduledDate: parseTimeLabel("8:00 PM"),
      images: [ASSETS.addNineChords],
      caption:
        "If practice feels dry, steal better sounds. These add9 voicings are easy to drop into songs and great for connecting chord work to melody and solo ideas. Comment SAUCE for the link. #guitar #songwriting"
    }
  ];
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
      socket.addEventListener("error", () => reject(new Error(`Failed to connect to ${socketUrl}`)), {
        once: true
      });
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

async function getXPage() {
  const response = await fetch(`${BROWSER_URL}/json/list`);
  if (!response.ok) {
    throw new Error(`Could not reach Chrome at ${BROWSER_URL}`);
  }

  const pages = await response.json();
  const page = pages.find((entry) => entry.type === "page" && entry.url.includes("x.com"));
  if (!page) {
    throw new Error("No X page is open in the debug browser.");
  }

  return page;
}

async function openFreshPage(url) {
  const response = await fetch(`${BROWSER_URL}/json/new?${encodeURIComponent(url)}`, {
    method: "PUT"
  });

  if (!response.ok) {
    throw new Error(`Could not open Chrome page for ${url}`);
  }

  return response.json();
}

async function openConnection() {
  const page = await getXPage();
  const connection = await CDPConnection.open(page.webSocketDebuggerUrl);
  await connection.send("Page.enable");
  await connection.send("Runtime.enable");
  await connection.send("DOM.enable");
  return connection;
}

async function openFreshConnection(url) {
  const page = await openFreshPage(url);
  const connection = await CDPConnection.open(page.webSocketDebuggerUrl);
  await connection.send("Page.enable");
  await connection.send("Runtime.enable");
  await connection.send("DOM.enable");
  return { connection, page };
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

async function navigate(connection, url) {
  await evaluate(
    connection,
    functionExpression((nextUrl) => {
      if (location.href !== nextUrl) {
        location.href = nextUrl;
      }
      return true;
    }, url)
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

  const rect = await evaluate(
    connection,
    functionExpression((needle) => {
      const element = document.querySelector(needle);
      if (!element) {
        return null;
      }

      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0
        ? {
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height
          }
        : null;
    }, selector)
  );

  if (!rect) {
    throw new Error(`Could not click selector: ${selector}`);
  }

  await clickAt(connection, rect.left + rect.width / 2, rect.top + rect.height / 2);
}

async function navigateHome(connection) {
  await navigate(connection, HOME_URL);
  await waitFor(
    connection,
    "X home",
    `(() => location.href === ${JSON.stringify(HOME_URL)} && Boolean(document.querySelector('[data-testid="SideNav_NewTweet_Button"]')))()`,
    30_000
  );
}

async function openScheduledList(connection) {
  await navigate(connection, SCHEDULED_URL);
  await waitFor(
    connection,
    "scheduled drafts list",
    `(() => location.href === ${JSON.stringify(SCHEDULED_URL)} && document.body.innerText.includes('Drafts') && document.body.innerText.includes('Scheduled'))()`,
    60_000
  );
}

async function getScheduledSummaries(connection) {
  const summaries = await evaluate(
    connection,
    `(() => {
      const text = document.body.innerText || '';
      const matches = [...text.matchAll(/Will send on [^\\n]+/g)].map((match) => match[0].trim());
      return [...new Set(matches)];
    })()`
  );

  return summaries;
}

async function listScheduledSummaries() {
  const { connection } = await openFreshConnection(SCHEDULED_URL);

  try {
    await waitFor(
      connection,
      "scheduled drafts list",
      `(() => location.href === ${JSON.stringify(SCHEDULED_URL)} && document.body.innerText.includes('Drafts') && document.body.innerText.includes('Scheduled'))()`,
      60_000
    );

    return getScheduledSummaries(connection);
  } finally {
    connection.close();
  }
}

async function openScheduledPost(connection, summary) {
  const opened = await evaluate(
    connection,
    functionExpression((expectedSummary) => {
      const row = [...document.querySelectorAll("*")]
        .map((element) => {
          const text = normalize(element.innerText || element.textContent || "");
          const rect = element.getBoundingClientRect();
          return {
            element,
            tag: element.tagName.toLowerCase(),
            text,
            area: rect.width * rect.height,
            visible: rect.width > 0 && rect.height > 0
          };
        })
        .filter((item) => item.visible && item.text.includes(expectedSummary))
        .sort((left, right) => {
          if (left.tag === "button" && right.tag !== "button") {
            return -1;
          }
          if (left.tag !== "button" && right.tag === "button") {
            return 1;
          }
          return left.area - right.area;
        })[0]?.element;

      if (!row) {
        return false;
      }

      row.click();
      return true;

      function normalize(value) {
        return String(value ?? "")
          .replace(/\s+/g, " ")
          .trim();
      }
    }, summary)
  );

  if (!opened) {
    throw new Error(`Could not find scheduled row: ${summary}`);
  }

  await waitFor(
    connection,
    `scheduled post ${summary}`,
    functionExpression(
      ({ modalSelector, expectedSummary }) => {
        return (
          location.href === "https://x.com/compose/post" &&
          Boolean(document.querySelector(`${modalSelector} [data-testid="tweetButton"]`)) &&
          normalize(document.querySelector(`${modalSelector} [data-testid="scheduledTweetIndicator"]`)?.innerText || "")
            .includes(normalize(expectedSummary))
        );

        function normalize(value) {
          return String(value ?? "")
            .replace(/\s+/g, " ")
            .trim();
        }
      },
      { modalSelector: COMPOSE_MODAL, expectedSummary: summary }
    ),
    30_000
  );
}

async function openNewComposer(connection) {
  const composerReadyExpression = functionExpression((modalSelector) => {
    return (
      location.href === "https://x.com/compose/post" &&
      Boolean(document.querySelector(`${modalSelector} [data-testid="tweetButton"]`)) &&
      !document.querySelector(`${modalSelector} [data-testid="scheduledTweetIndicator"]`)
    );
  }, COMPOSE_MODAL);

  await navigate(connection, COMPOSE_URL);

  try {
    await waitFor(connection, "dedicated composer", composerReadyExpression, 20_000);
    return;
  } catch (error) {
    await navigateHome(connection);
    await clickSelector(connection, '[data-testid="SideNav_NewTweet_Button"]');
    await waitFor(connection, "dedicated composer", composerReadyExpression, 30_000);
  }
}

async function getCurrentDraftState(connection) {
  return evaluate(
    connection,
    functionExpression((modalSelector) => {
      const dialog = document.querySelector(modalSelector);
      const editor = dialog?.querySelector('[data-testid="tweetTextarea_0"]');
      const indicator = dialog?.querySelector('[data-testid="scheduledTweetIndicator"]');
      return {
        text: normalize(editor?.innerText || editor?.textContent || ""),
        mediaCount: dialog?.querySelectorAll('[aria-label="Remove media"]').length ?? 0,
        indicator: normalize(indicator?.innerText || indicator?.textContent || "")
      };

      function normalize(value) {
        return String(value ?? "")
          .replace(/\s+/g, " ")
          .trim();
      }
    }, COMPOSE_MODAL)
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

async function clearMedia(connection) {
  await evaluate(
    connection,
    functionExpression((modalSelector) => {
      const dialog = document.querySelector(modalSelector);
      if (!dialog) {
        return 0;
      }

      const removeButtons = [...dialog.querySelectorAll('[aria-label="Remove media"]')];
      for (const button of removeButtons) {
        button.click();
      }

      return removeButtons.length;
    }, COMPOSE_MODAL)
  );

  await waitFor(
    connection,
    "cleared media",
    functionExpression((modalSelector) => {
      const dialog = document.querySelector(modalSelector);
      return Boolean(dialog) && dialog.querySelectorAll('[aria-label="Remove media"]').length === 0;
    }, COMPOSE_MODAL),
    15_000,
    400
  );
}

async function uploadImages(connection, imagePaths) {
  const { root } = await connection.send("DOM.getDocument", { depth: 4, pierce: true });
  const { nodeId } = await connection.send("DOM.querySelector", {
    nodeId: root.nodeId,
    selector: `${COMPOSE_MODAL} input[data-testid="fileInput"]`
  });

  if (!nodeId) {
    throw new Error("Could not find the dedicated composer file input.");
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
  await new Promise((resolve) => setTimeout(resolve, 2_000));
}

async function waitForScheduledSummary(connection, summary, timeoutMs = 40_000) {
  const start = Date.now();

  while (Date.now() - start <= timeoutMs) {
    const summaries = await listScheduledSummaries();
    if (summaries.includes(summary)) {
      return summaries;
    }

    await new Promise((resolve) => setTimeout(resolve, 1_000));
  }

  throw new Error(`Timed out waiting for scheduled entry: ${summary}`);
}

async function createScheduledPost(connection, post) {
  const summary = xScheduleSummary(post.scheduledDate);
  console.log(`Creating "${post.name}" for ${summary}`);
  await openNewComposer(connection);
  await clearMedia(connection);
  await setComposerText(connection, post.caption);
  await uploadImages(connection, post.images);
  await openScheduleDialog(connection);
  await setSchedule(connection, post.scheduledDate);
  await confirmSchedule(connection, post.scheduledDate);
  await saveComposer(connection);
  await waitForScheduledSummary(connection, summary);
}

async function ensurePost(connection, post) {
  const summary = xScheduleSummary(post.scheduledDate);
  const summaries = await listScheduledSummaries();

  if (summaries.includes(summary)) {
    console.log(`Found existing "${post.name}" draft at ${summary}`);
    return;
  }

  await createScheduledPost(connection, post);
}

async function verifyPost(connection, post) {
  const summary = xScheduleSummary(post.scheduledDate);
  await openScheduledList(connection);
  await openScheduledPost(connection, summary);

  await waitFor(
    connection,
    `verified caption for ${post.name}`,
    functionExpression(
      ({ modalSelector, expectedText, expectedMediaCount }) => {
        const dialog = document.querySelector(modalSelector);
        const editor = dialog?.querySelector('[data-testid="tweetTextarea_0"]');
        const text = normalize(editor?.innerText || editor?.textContent || "");
        const mediaCount = dialog?.querySelectorAll('[aria-label="Remove media"]').length ?? 0;
        return text === expectedText && mediaCount === expectedMediaCount;

        function normalize(value) {
          return String(value ?? "")
            .replace(/\s+/g, " ")
            .trim();
        }
      },
      {
        modalSelector: COMPOSE_MODAL,
        expectedText: normalizeText(post.caption),
        expectedMediaCount: post.images.length
      }
    ),
    15_000,
    300
  );

  const state = await getCurrentDraftState(connection);
  if (state.text !== normalizeText(post.caption)) {
    throw new Error(`Caption verification failed for ${post.name}.`);
  }
  if (state.mediaCount !== post.images.length) {
    throw new Error(`Media verification failed for ${post.name}.`);
  }
  if (state.indicator !== summary) {
    throw new Error(`Schedule verification failed for ${post.name}.`);
  }

  console.log(`Verified "${post.name}"`);
}

async function main() {
  const posts = buildPosts();
  const connection = await openConnection();

  try {
    for (const post of posts) {
      await ensurePost(connection, post);
    }
    const summaries = await listScheduledSummaries();
    console.log(
      JSON.stringify(
        {
          scheduledSummaries: summaries,
          posts: posts.map((post) => ({
            name: post.name,
            time: timeLabel(post.scheduledDate),
            images: post.images.length
          }))
        },
        null,
        2
      )
    );
  } finally {
    connection.close();
  }
}

main().catch((error) => {
  console.error(error.stack || String(error));
  process.exitCode = 1;
});
