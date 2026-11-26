#!/usr/bin/env node
/**
 * Periodic data-completion assistant (draft only).
 *
 * 1. Find catalog rows that need Latin transliteration / English meaning
 * 2. Fix transliteration with sanscript (deterministic)
 * 3. Draft English meaning with Gemini (optional)
 * 4. Write src/data/drafts/<stamp>.json — never sets accuracy=verified
 *
 * Usage:
 *   node scripts/complete-drafts.mjs --limit 10
 *   GEMINI_API_KEY=... node scripts/complete-drafts.mjs --limit 10 --translate
 */

import fs from "node:fs";
import path from "node:path";
import Sanscript from "sanscript";
import {
  DRAFTS_DIR,
  loadPrayerRecords,
  needsCompletion,
  reasons,
} from "./lib/catalog-scan.mjs";

function arg(name, fallback = null) {
  const i = process.argv.indexOf(name);
  if (i === -1) return fallback;
  return process.argv[i + 1] ?? fallback;
}

function hasFlag(name) {
  return process.argv.includes(name);
}

function latinizePunctuation(text) {
  return text
    .replace(/\u0964/g, ".")
    .replace(/\u0965/g, "..")
    .replace(/[\u0900-\u097F]/g, "");
}

function toIast(sanskrit) {
  if (!sanskrit.trim()) return "";
  if (!/[\u0900-\u097F]/.test(sanskrit)) return sanskrit;
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
  if (!key) return null;

  const prompt = `You catalog Sanatana Dharma prayers. Write one plain-English meaning (2-4 sentences).
Be faithful; do not invent. If the Sanskrit looks like an opening fragment, say it is an excerpt.
JSON only: {"meaning":"..."}

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
      generationConfig: {
        temperature: 0.2,
        responseMimeType: "application/json",
      },
    }),
  });
  if (!resp.ok) {
    throw new Error(`Gemini HTTP ${resp.status}: ${(await resp.text()).slice(0, 240)}`);
  }
  const data = await resp.json();
  const text =
    data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") || "";
  try {
    return String(JSON.parse(text).meaning || "").trim();
  } catch {
    return text.trim();
  }
}

const limit = Math.max(1, Number(arg("--limit", "8")) || 8);
const doTranslate = hasFlag("--translate");
const candidates = loadPrayerRecords().filter(needsCompletion).slice(0, limit);

if (candidates.length === 0) {
  console.log("No rows need completion.");
  process.exit(0);
}

const proposals = [];
for (const row of candidates) {
  const transliteration = toIast(row.sanskrit) || row.transliteration;
  let meaning = row.meaning;
  let meaningSource = "existing";
  if (doTranslate && (!meaning || meaning.length < 40)) {
    try {
      const drafted = await draftMeaning(row.sanskrit, transliteration);
      if (drafted) {
        meaning = drafted;
        meaningSource = "gemini-draft";
      }
    } catch (e) {
      console.error(`meaning draft failed for ${row.id}:`, e.message || e);
    }
  }
  proposals.push({
    id: row.id,
    reasons: reasons(row),
    sanskrit: row.sanskrit,
    transliteration,
    meaning: meaning || null,
    meaningSource,
    accuracy: "draft",
    note: "Draft only. Human must check against a source before accuracy=verified.",
  });
}

fs.mkdirSync(DRAFTS_DIR, { recursive: true });
const stamp = new Date().toISOString().slice(0, 10);
const outPath = path.join(DRAFTS_DIR, `enrichment-${stamp}.json`);
const payload = {
  generatedAt: new Date().toISOString(),
  policy: "Never auto-verify. Apply only after review via npm run apply:drafts.",
  count: proposals.length,
  proposals,
};
fs.writeFileSync(outPath, JSON.stringify(payload, null, 2) + "\n");
console.log(`Wrote ${proposals.length} draft proposal(s) → ${outPath}`);
