#!/usr/bin/env node

import process from "node:process";

const BROWSER_URL = process.env.CDP_BROWSER_URL ?? "http://127.0.0.1:9222";
const TODAY = { year: 2026, month: 4, day: 27 };

const ASSETS = {
  breakOutPractice: "/Users/chrisschreiner/Desktop/Guitarmalade Warmups/Break OUT the box NEW page 5 copy.jpg",
  breakOutCheat: "/Users/chrisschreiner/Desktop/Guitarmalade Warmups/Break Out of Box 3 copy.jpg",
  layerCake: "/Users/chrisschreiner/Desktop/Guitarmalade Warmups/A Min Layer cake copy.jpg",
  andalusian: "/Users/chrisschreiner/Desktop/Chord Tone Soloing for ROCK Guitar Players/Andalusian Cadence Chreat Sheet copy.jpg",
  sweepSauce: "/Users/chrisschreiner/Desktop/Guitarmalade Warmups/A min sweep tensions copy.jpg",
  scaleDegrees: "/Users/chrisschreiner/Desktop/Guitarmalade Warmups/All Scale Degrees copy.jpg"
};

function pad(value) {
  return String(value).padStart(2, "0");
}

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60_000);
}

function roundUpToFiveMinutes(date) {
  const rounded = new Date(date.getTime());
  rounded.setSeconds(0, 0);
  const minutes = rounded.getMinutes();
  const remainder = minutes % 5;
  if (remainder !== 0) {
    rounded.setMinutes(minutes + (5 - remainder));
  }
  return rounded;
}

function timeLabel(date) {
  const rawHours = date.getHours();
  const hours12 = rawHours % 12 || 12;
  const meridiem = rawHours >= 12 ? "PM" : "AM";
  return `${hours12}:${pad(date.getMinutes())} ${meridiem}`;
}

function toScheduleParts(date) {
  return {
    year: TODAY.year,
    month: TODAY.month,
    day: TODAY.day,
    hour: date.getHours(),
    minute: date.getMinutes(),
    second: 0
  };
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

  return new Date(2026, 3, 27, hour, minute, 0, 0);
}

function buildPosts() {
  const now = new Date();
  const firstMorning = process.env.MORNING_ONE
    ? parseTimeLabel(process.env.MORNING_ONE)
    : roundUpToFiveMinutes(addMinutes(now, 25));
  const secondMorning = process.env.MORNING_TWO
    ? parseTimeLabel(process.env.MORNING_TWO)
    : addMinutes(firstMorning, 25);
  const middayOne = new Date(2026, 3, 27, 12, 5, 0, 0);
  const middayTwo = new Date(2026, 3, 27, 12, 50, 0, 0);

  return [
    {
      name: "Break OUT of the Box",
      requestedTime: "9:35 AM",
      scheduledDate: firstMorning,
      images: [ASSETS.breakOutPractice, ASSETS.breakOutCheat],
      caption: `Stuck repeating the same A minor pentatonic box every solo?\n\nThis is how you start breaking out without sounding random.\n\nThese shapes show you how to move across the neck, connect positions, and make your lines sound way more musical fast.\n\nComment SAUCE for the link.\n\n#guitarlesson #leadguitar #pentatonic #guitarsolo #guitarpractice`
    },
    {
      name: "Saucey A Minor Sweep Arpeggios",
      requestedTime: "10:00 AM",
      scheduledDate: secondMorning,
      images: [ASSETS.sweepSauce, ASSETS.scaleDegrees],
      caption: `Want your solos to sound smarter tonight?\n\nStart seeing the neck as notes and functions, not just boxes and guesses.\n\nThese two pages help you hear:\nwhere the chord tones are\nwhere the tensions live\nhow to turn shapes into actual music\n\nIf you want the full breakdown, comment SAUCE for the link.\n\n#guitarlesson #sweeppicking #arpeggios #musictheory #fretboardtraining`
    },
    {
      name: "Layer Cake",
      requestedTime: "12:05 PM",
      scheduledDate: middayOne,
      images: [ASSETS.layerCake],
      caption: `Most players memorize shapes.\nBetter players understand the layers inside the shape.\n\nRoot notes.\nTriads.\nArpeggios.\nPentatonic.\nFull scale.\n\nWhen you see how they stack, the fretboard starts making sense.\n\nComment SAUCE for the link.\n\n#guitarlesson #fretboard #musictheory #guitarplayer #guitarpractice`
    },
    {
      name: "Andalusian Cadence",
      requestedTime: "12:50 PM",
      scheduledDate: middayTwo,
      images: [ASSETS.andalusian],
      caption: `If you love dark, dramatic guitar sounds, learn this progression cold.\n\nThe Andalusian cadence shows up everywhere because it instantly sounds musical, tense, and cinematic.\n\nSteal the chord movement.\nSteal the arpeggios.\nSteal the vibe.\n\nComment SAUCE for the link.\n\n#guitarlesson #chordprogression #andalusiancadence #flamencoguitar #guitarist`
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
    `(() => ({ url: location.href, hasComposer: document.body.innerText.includes('Add photo/video') }))()`
  );

  if (state.url.includes("/latest/composer/") && state.hasComposer) {
    return;
  }

  await clickButton(connection, "Create post");
  await waitFor(
    connection,
    "composer",
    `(() => location.href.includes('/latest/composer/') && document.body.innerText.includes('Add photo/video'))()`,
    30_000
  );
}

async function focusEditor(connection) {
  const rect = await evaluate(
    connection,
    `(() => {
      const editor = [...document.querySelectorAll('div[contenteditable=\"true\"][role=\"combobox\"]')]
        .find((entry) => {
          const rect = entry.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0;
        });
      if (!editor) {
        return null;
      }

      const rect = editor.getBoundingClientRect();
      editor.innerHTML = '';
      editor.focus();
      return {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height
      };
    })()`
  );

  if (!rect) {
    throw new Error("Could not find the post caption editor.");
  }

  await clickAt(connection, rect.left + 8, rect.top + Math.max(rect.height / 2, 8));
}

async function insertCaption(connection, caption) {
  await focusEditor(connection);
  await connection.send("Input.insertText", { text: caption });
  const firstLine = caption.split("\n").find((line) => line.trim()) ?? "SAUCE";
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

  const expectedLabel = timeLabel(new Date(2026, 3, 27, scheduleParts.hour, scheduleParts.minute, 0, 0));
  const [expectedHour, expectedMinuteMeridiem] = expectedLabel.split(":");
  const expectedMinute = expectedMinuteMeridiem.slice(0, 2);
  const expectedMeridiem = expectedMinuteMeridiem.slice(3);

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

async function waitForScheduleButtonEnabled(connection) {
  await waitFor(
    connection,
    "enabled Schedule button",
    `(() => {
      const normalize = (value) => (value || '').replace(/\\s+/g, ' ').trim();
      const buttons = [...document.querySelectorAll('button, [role=\"button\"]')].map((element) => ({
        text: normalize(element.innerText || element.textContent || ''),
        disabled:
          element.disabled ||
          element.getAttribute('aria-disabled') === 'true' ||
          element.closest('[aria-disabled=\"true\"]') !== null
      }));
      return buttons.some((entry) => entry.text === 'Schedule' && !entry.disabled);
    })()`,
    30_000
  );
}

async function submitSchedule(connection) {
  await clickButton(connection, "Schedule");

  let state = await waitFor(
    connection,
    "schedule result",
    `(() => {
      if (location.href.includes('/latest/content_calendar/')) {
        return 'planner';
      }
      if (document.body.innerText.includes('Boost your post')) {
        return 'boost';
      }
      if (document.body.innerText.includes('Scheduling your post')) {
        return 'scheduling';
      }
      return '';
    })()`,
    45_000,
    1000
  );

  if (state === "scheduling") {
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
    "planner after scheduling",
    `(() => !location.href.includes('/latest/composer/') && document.body.innerText.includes('Planner'))()`,
    45_000,
    1000
  );
}

async function schedulePost(connection, post) {
  console.log(`Scheduling "${post.name}" for ${timeLabel(post.scheduledDate)} EDT`);
  await ensureComposer(connection);
  await uploadImages(connection, post.images);
  await insertCaption(connection, post.caption);
  await enableScheduling(connection);
  await setScheduleTime(connection, toScheduleParts(post.scheduledDate));
  await waitForScheduleButtonEnabled(connection);
  await submitSchedule(connection);
}

async function main() {
  const posts = buildPosts();
  const startIndex = Number(process.env.START_INDEX ?? "0");
  const connection = await openConnection();

  try {
    for (const post of posts.slice(startIndex)) {
      await schedulePost(connection, post);
    }

    const results = posts.map((post) => ({
      name: post.name,
      requestedTime: post.requestedTime,
      scheduledTime: timeLabel(post.scheduledDate),
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
