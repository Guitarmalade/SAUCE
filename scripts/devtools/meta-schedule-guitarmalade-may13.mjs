#!/usr/bin/env node

import fs from "node:fs/promises";

const TEMPLATE_URL = new URL("./meta-schedule-guitarmalade-may11.mjs", import.meta.url);

const TODAY_BLOCK = `const TODAY = { year: 2026, month: 5, day: 13 };`;

const ASSETS_BLOCK = `const ASSETS = {
  intermediateArpeggio:
    "/Users/chrisschreiner/Desktop/Guitarmalade Warmups/diatonic arpeggios in pos 1 and 2 copy.jpg",
  diatonicSeventhChords:
    "/Users/chrisschreiner/Desktop/Guitarmalade Warmups/diatonic 7th chords 5th and 6th string root 2.jpg",
  advancedArpeggioWorkout:
    "/Users/chrisschreiner/Desktop/Guitarmalade Warmups/Arpeggio practice andy copy.jpg",
  diminishedSweepArpeggios:
    "/Users/chrisschreiner/Desktop/Guitarmalade Warmups/diminished sweep copy.jpg",
  bandPractice: "/Users/chrisschreiner/Desktop/Guitarmalade 2020/2020memes/band practice copy.jpg",
  choosePrs: "/Users/chrisschreiner/Desktop/Guitarmalade 2020/2020memes/choose prs copy.jpg",
  bucketheadPedalboard:
    "/Users/chrisschreiner/Desktop/Guitarmalade 2020/2020memes/BH Pedalboard copy.jpg",
  bucketheadSavedMe: "/Users/chrisschreiner/Desktop/Guitarmalade 2020/2020memes/bh saved copy.jpg",
  bucketheadTinyDesk:
    "/Users/chrisschreiner/Desktop/Guitarmalade 2020/2020memes/bucket tiny desk copy.jpg"
};`;

const POSTS_BLOCK = `function buildPosts() {
  return [
    {
      name: "Intermediate Arpeggio Cheat Sheet",
      requestedTime: "8:00 AM",
      scheduledDate: parseTimeLabel("8:00 AM"),
      images: [ASSETS.intermediateArpeggio],
      caption: \`Intermediate arpeggio work is where scale knowledge starts turning into real harmonic control. Triads first, 7th chords next, then make it musical.\`
    },
    {
      name: "Band Practice Starts at 8:00",
      requestedTime: "10:07 AM",
      scheduledDate: parseTimeLabel("10:07 AM"),
      images: [ASSETS.bandPractice],
      caption: \`Arpeggio practice always sounds great until real life shows up 32 minutes early.\`
    },
    {
      name: "Choose PRS",
      requestedTime: "11:11 AM",
      scheduledDate: parseTimeLabel("11:11 AM"),
      images: [ASSETS.choosePrs],
      caption: \`Trying to act normal while comparing flame tops, neck shapes, and pickup configs like it is life or death.\`
    },
    {
      name: "Diatonic 7th Chords Cheat Sheet",
      requestedTime: "12:05 PM",
      scheduledDate: parseTimeLabel("12:05 PM"),
      images: [ASSETS.diatonicSeventhChords],
      caption: \`Diatonic 7th chords are one of the fastest ways to connect scales, harmony, and fretboard movement. If you want your playing to sound more intentional, this is worth drilling.\`
    },
    {
      name: "Advanced Arpeggio Workout",
      requestedTime: "12:50 PM",
      scheduledDate: parseTimeLabel("12:50 PM"),
      images: [ASSETS.advancedArpeggioWorkout],
      caption: \`Advanced arpeggio workout is a strong way to clean up your picking and actually hear the harmony move. If you want better control over 7th chord arpeggios, start here.\`
    },
    {
      name: "Buckethead Pedalboard Meme",
      requestedTime: "1:07 PM",
      scheduledDate: parseTimeLabel("1:07 PM"),
      images: [ASSETS.bucketheadPedalboard],
      caption: \`HBD\`
    },
    {
      name: "Buckethead Saved Me Meme",
      requestedTime: "5:30 PM",
      scheduledDate: parseTimeLabel("5:30 PM"),
      images: [ASSETS.bucketheadSavedMe],
      caption: \`Happy Birthday\`
    },
    {
      name: "Diminished Sweep Arpeggios",
      requestedTime: "8:00 PM",
      scheduledDate: parseTimeLabel("8:00 PM"),
      images: [ASSETS.diminishedSweepArpeggios],
      caption: \`Diminished sweep arpeggios are a strong way to add tension, symmetry, and a different sound to your lead playing. If your sweeps feel too predictable, this is a good direction.\`
    },
    {
      name: "Buckethead Tiny Desk Meme",
      requestedTime: "9:08 PM",
      scheduledDate: parseTimeLabel("9:08 PM"),
      images: [ASSETS.bucketheadTinyDesk],
      caption: \`HBD\`
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
