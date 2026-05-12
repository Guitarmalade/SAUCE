#!/usr/bin/env node

import fs from "node:fs/promises";

const TEMPLATE_URL = new URL("./meta-schedule-guitarmalade-may11.mjs", import.meta.url);

const TODAY_BLOCK = `const TODAY = { year: 2026, month: 5, day: 12 };`;

const ASSETS_BLOCK = `const ASSETS = {
  twelveBarBluesShuffleTwo:
    "/Users/chrisschreiner/Desktop/Guitarmalade Warmups/Guitarmalade Blues Bible/a blues 1 copy.jpg",
  twelveBarBluesShuffleAndImprov:
    "/Users/chrisschreiner/Desktop/Guitarmalade Warmups/Guitarmalade Blues Bible/a blues improv 1 copy.jpg",
  abacVsAaabMelodicMotif:
    "/Users/chrisschreiner/Desktop/Guitarmalade Warmups/Guitarmalade Blues Bible/abac vs aaab copy.jpg",
  bluesBendsObliqueBends:
    "/Users/chrisschreiner/Desktop/Guitarmalade Warmups/Guitarmalade Blues Bible/big blues bends copy.jpg",
  jazzGuitaristsVsBluesDads:
    "/Users/chrisschreiner/Desktop/Guitarmalade 2020/2020memes/big brain blues dad copy.jpg",
  kidnappersScaleList:
    "/Users/chrisschreiner/Desktop/Guitarmalade 2020/2020memes/Kidnappers throw copy.jpg",
  chaseTheChordsNope:
    "/Users/chrisschreiner/Desktop/Guitarmalade 2020/2020memes/blues chages copy.jpg",
  chasingTheChordsPower:
    "/Users/chrisschreiner/Desktop/Guitarmalade 2020/2020memes/POWER MEME copy 2.jpg",
  bluesManB5: "/Users/chrisschreiner/Desktop/Guitarmalade 2020/2020memes/dafoe 3 blues.jpg"
};`;

const POSTS_BLOCK = `function buildPosts() {
  return [
    {
      name: "12 Bar Blues Shuffle 2",
      requestedTime: "8:00 AM",
      scheduledDate: parseTimeLabel("8:00 AM"),
      images: [ASSETS.twelveBarBluesShuffleTwo],
      caption: \`Blues Dad BBQ starts with a 12 bar shuffle you can actually use. Groove first, then make it musical. Comment BBQ and I'll send it over.\`
    },
    {
      name: "Jazz Guitarists vs Blues Dads",
      requestedTime: "10:07 AM",
      scheduledDate: parseTimeLabel("10:07 AM"),
      images: [ASSETS.jazzGuitaristsVsBluesDads],
      caption: \`You can learn every scale in the book, but most blues dads know where home is. Want the Blues Dad BBQ lesson? Comment BBQ and I'll send it over.\`
    },
    {
      name: "Kidnappers Returning Me After I List Every Scale",
      requestedTime: "11:11 AM",
      scheduledDate: parseTimeLabel("11:11 AM"),
      images: [ASSETS.kidnappersScaleList],
      caption: \`There are a lot of scale options over a blues. Most players need fewer options and better phrasing. Comment BBQ and I'll send it over.\`
    },
    {
      name: "12 Bar Blues Shuffle + Improv",
      requestedTime: "12:05 PM",
      scheduledDate: parseTimeLabel("12:05 PM"),
      images: [ASSETS.twelveBarBluesShuffleAndImprov],
      caption: \`Here's where the shuffle opens up. Learn where to improvise without losing the groove. Comment BBQ and I'll send it over.\`
    },
    {
      name: "ABAC vs AAAB Melodic Motif",
      requestedTime: "12:50 PM",
      scheduledDate: parseTimeLabel("12:50 PM"),
      images: [ASSETS.abacVsAaabMelodicMotif],
      caption: \`Want your blues playing to sound more musical? This shows how repetition and variation make your licks stronger. Comment BBQ and I'll send it over.\`
    },
    {
      name: "Chase the Chords / No I Don't Think I Will",
      requestedTime: "1:07 PM",
      scheduledDate: parseTimeLabel("1:07 PM"),
      images: [ASSETS.chaseTheChordsNope],
      caption: \`A lot of players avoid chasing the changes because it feels complicated. Blues Dad BBQ keeps it practical. Comment BBQ and I'll send it over.\`
    },
    {
      name: "What Gives People Feelings of Power",
      requestedTime: "5:30 PM",
      scheduledDate: parseTimeLabel("5:30 PM"),
      images: [ASSETS.chasingTheChordsPower],
      caption: \`Nothing makes a blues solo feel stronger than landing on the changes with intention. Comment BBQ and I'll send it over.\`
    },
    {
      name: "Blues Bends - Oblique Bends",
      requestedTime: "8:00 PM",
      scheduledDate: parseTimeLabel("8:00 PM"),
      images: [ASSETS.bluesBendsObliqueBends],
      caption: \`Blues bends are where the attitude lives. These bend ideas add the phrasing that makes a blues line speak. Comment BBQ and I'll send it over.\`
    },
    {
      name: "Add b5 to a Minor Pentatonic",
      requestedTime: "9:08 PM",
      scheduledDate: parseTimeLabel("9:08 PM"),
      images: [ASSETS.bluesManB5],
      caption: \`Add one note and suddenly everybody becomes a certified blues man. Want the Blues Dad BBQ lesson? Comment BBQ and I'll send it over.\`
    }
  ];
}`;

const CAPTION_BLOCK = `async function insertCaption(connection, caption) {
  const firstLine = caption.split("\\n").find((line) => line.trim()) ?? "SAUCE";
  const result = await evaluate(
    connection,
    functionExpression(({ nextCaption }) => {
      const normalize = (value) => String(value ?? "").replace(/\\s+/g, " ").trim();
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
        const normalize = (value) => String(value ?? "").replace(/\\s+/g, " ").trim().toLowerCase();
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
}`;

function replaceExact(source, from, to) {
  if (!source.includes(from)) {
    throw new Error(`Could not find exact block: ${from}`);
  }

  return source.replace(from, to);
}

function replaceSection(source, startMarker, endMarker, replacement) {
  const start = source.indexOf(startMarker);
  if (start === -1) {
    throw new Error(`Could not find section start: ${startMarker}`);
  }

  const end = source.indexOf(endMarker, start);
  if (end === -1) {
    throw new Error(`Could not find section end: ${endMarker}`);
  }

  return `${source.slice(0, start)}${replacement}\n\n${source.slice(end)}`;
}

let source = await fs.readFile(TEMPLATE_URL, "utf8");
source = replaceExact(source, `const TODAY = { year: 2026, month: 5, day: 11 };`, TODAY_BLOCK);
source = replaceSection(source, `const ASSETS = {`, `function pad(value) {`, ASSETS_BLOCK);
source = replaceSection(source, `function buildPosts() {`, `class CDPConnection {`, POSTS_BLOCK);
source = replaceSection(source, `async function insertCaption(connection, caption) {`, `async function enableScheduling(connection) {`, CAPTION_BLOCK);

const moduleUrl = `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`;
await import(moduleUrl);
