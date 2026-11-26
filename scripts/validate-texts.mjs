#!/usr/bin/env node
/** Check public/texts packs exist and match the UI family lookup. */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const TEXTS = path.join(ROOT, "public", "texts");
const FAMILIES = ["vedas", "ramayana", "mahabharata", "puranas"];

function loadableCorpora(manifest, family) {
  const index = manifest.corpora.find((c) => c.id === family);
  const fromParts = index?.parts?.length
    ? index.parts
    : manifest.corpora.filter(
        (c) => c.family === family && !c.path.endsWith("/index.json") && c.id !== family
      );
  const seen = new Set();
  return fromParts.filter((c) => {
    if (!c.path || c.path.endsWith("/index.json")) return false;
    if (seen.has(c.id)) return false;
    seen.add(c.id);
    return true;
  });
}

const manifestPath = path.join(TEXTS, "manifest.json");
if (!fs.existsSync(manifestPath)) {
  console.error("missing public/texts/manifest.json — run npm run ingest:texts");
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
let errors = 0;

for (const family of FAMILIES) {
  const list = loadableCorpora(manifest, family);
  if (!list.length) {
    console.error(`${family}: no packs`);
    errors += 1;
    continue;
  }
  for (const entry of list) {
    const file = path.join(TEXTS, entry.path);
    if (!fs.existsSync(file)) {
      console.error(`${family}: missing ${entry.path}`);
      errors += 1;
      continue;
    }
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    if (!Array.isArray(data.verses) || !data.verses.length) {
      console.error(`${family}: ${entry.path} has no verses`);
      errors += 1;
      continue;
    }
    if (data.verseCount !== data.verses.length) {
      console.error(
        `${family}: ${entry.path} verseCount ${data.verseCount} != verses ${data.verses.length}`
      );
      errors += 1;
    }
    const first = data.verses[0];
    if (!first.ref || !first.transliteration || /[\u0900-\u097F]/.test(first.transliteration)) {
      console.error(`${family}: ${entry.path} bad first verse`);
      errors += 1;
    }
  }
  console.log(
    `${family}: ok (${list.length} pack(s), ${list.reduce((n, c) => n + c.verseCount, 0)} verses)`
  );
}

if (errors) {
  console.error(`validate-texts: ${errors} error(s)`);
  process.exit(1);
}
console.log("validate-texts: ok");
