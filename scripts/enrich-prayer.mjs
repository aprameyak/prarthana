#!/usr/bin/env node
/**
 * Turn Devanagari (or other Indic) source text into required Latin fields:
 * - transliteration: deterministic IAST via sanscript
 * - meaning: optional English draft via Gemini (accuracy stays "draft")
 *
 * Usage:
 *   node scripts/enrich-prayer.mjs --sanskrit "ॐ नमः शिवाय"
 *   node scripts/enrich-prayer.mjs --sanskrit "..." --translate
 *   echo "..." | node scripts/enrich-prayer.mjs --stdin --translate
 *
 * Never marks output as verified. Human check + source still required.
 */

import Sanscript from "sanscript";
import fs from "node:fs";

function arg(name, fallback = null) {
  const i = process.argv.indexOf(name);
  if (i === -1) return fallback;
  return process.argv[i + 1] ?? fallback;
}

function hasFlag(name) {
  return process.argv.includes(name);
}

function readSanskrit() {
  if (hasFlag("--stdin")) {
    return fs.readFileSync(0, "utf8").trim();
  }
  const fromArg = arg("--sanskrit");
  if (fromArg) return fromArg.trim();
  const file = arg("--file");
  if (file) return fs.readFileSync(file, "utf8").trim();
  console.error(
    "Provide --sanskrit TEXT, --file PATH, or --stdin with Indic source text."
  );
  process.exit(1);
}

function latinizePunctuation(text) {
  return text
    .replace(/\u0964/g, ".") // danda ।
    .replace(/\u0965/g, "..") // double danda ॥
    .replace(/[\u0900-\u097F]/g, ""); // drop any leftover Devanagari
}

function transliterate(sanskrit) {
  // Prefer Devanagari → IAST; if already Latin, return as-is.
  if (!/[\u0900-\u097F]/.test(sanskrit)) {
    return sanskrit;
  }
  return sanskrit
    .split("\n")
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return "";
      try {
        return latinizePunctuation(
          Sanscript.t(trimmed, "devanagari", "iast")
        ).trim();
      } catch {
        return latinizePunctuation(trimmed).trim();
      }
    })
    .join("\n");
}

async function draftMeaning(sanskrit, transliteration) {
  const key = (process.env.GEMINI_API_KEY || "").trim();
  if (!key) {
    return {
      meaning: null,
      note: "Set GEMINI_API_KEY and pass --translate to draft an English meaning.",
    };
  }

  const prompt = `You are helping catalog Sanatana Dharma prayers for a respectful app.
Given the Sanskrit and IAST transliteration, write ONE short plain-English meaning (2-4 sentences max).
Do not invent extra theology. If the text is only an opening fragment, say so.
Return JSON only: {"meaning":"..."}

Sanskrit:
${sanskrit}

IAST:
${transliteration}`;

  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
    encodeURIComponent(key);
  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.2, responseMimeType: "application/json" },
    }),
  });
  if (!resp.ok) {
    throw new Error(`Gemini HTTP ${resp.status}: ${(await resp.text()).slice(0, 300)}`);
  }
  const data = await resp.json();
  const text =
    data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") || "";
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    parsed = { meaning: text.trim() };
  }
  return { meaning: String(parsed.meaning || "").trim(), note: "draft only — not verified" };
}

const sanskrit = readSanskrit();
if (!sanskrit) {
  console.error("Empty Sanskrit input.");
  process.exit(1);
}

const transliteration = transliterate(sanskrit);
const out = {
  sanskrit,
  transliteration,
  meaning: null,
  accuracy: "draft",
  completeness: "full",
  note: "Transliteration is IAST from sanscript. Meaning must be added (or --translate) and human-verified before accuracy=verified.",
};

if (hasFlag("--translate")) {
  const draft = await draftMeaning(sanskrit, transliteration);
  out.meaning = draft.meaning;
  out.note = draft.note || out.note;
}

if (/[\u0900-\u097F]/.test(out.transliteration)) {
  console.error("ERROR: transliteration still contains Devanagari.");
  process.exit(1);
}

console.log(JSON.stringify(out, null, 2));
