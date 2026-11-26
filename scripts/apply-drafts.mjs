#!/usr/bin/env node
/**
 * Apply a reviewed enrichment JSON into catalog TS files.
 * Updates transliteration + meaning; forces accuracy to "draft".
 * Never writes accuracy "verified".
 *
 * Usage:
 *   node scripts/apply-drafts.mjs src/data/drafts/enrichment-2026-11-26.json
 */

import fs from "node:fs";
import path from "node:path";
import { CATALOG_FILES } from "./lib/catalog-scan.mjs";

const draftPath = process.argv[2];
if (!draftPath) {
  console.error("Usage: node scripts/apply-drafts.mjs <drafts.json>");
  process.exit(1);
}

const draft = JSON.parse(fs.readFileSync(draftPath, "utf8"));
const proposals = draft.proposals || [];
if (!proposals.length) {
  console.error("No proposals in draft file.");
  process.exit(1);
}

function escapeForDoubleQuotes(s) {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function replaceField(block, name, value) {
  const backtick = new RegExp(`${name}:\\s*\`[\\s\\S]*?\``, "m");
  const quoted = new RegExp(`${name}:\\s*"[^"]*"`, "m");
  const useTicks = /\n/.test(value) || value.includes('"');
  const next = useTicks
    ? `${name}: \`${value.replace(/`/g, "'")}\``
    : `${name}: "${escapeForDoubleQuotes(value)}"`;
  if (backtick.test(block)) return block.replace(backtick, next);
  if (quoted.test(block)) return block.replace(quoted, next);
  // insert before tags or closing
  if (/tags:/.test(block)) {
    return block.replace(/tags:/, `${next},\n    tags:`);
  }
  return block;
}

function upsertAccuracy(block) {
  if (/accuracy:\s*"verified"/.test(block)) {
    // Do not downgrade verified rows via drafts.
    return { block, skippedVerified: true };
  }
  if (/accuracy:\s*"([^"]+)"/.test(block)) {
    return {
      block: block.replace(/accuracy:\s*"[^"]+"/, 'accuracy: "draft"'),
      skippedVerified: false,
    };
  }
  if (/tags:/.test(block)) {
    return {
      block: block.replace(/tags:/, 'accuracy: "draft",\n    tags:'),
      skippedVerified: false,
    };
  }
  return { block, skippedVerified: false };
}

let applied = 0;
let skipped = 0;

for (const file of CATALOG_FILES) {
  let text = fs.readFileSync(file, "utf8");
  for (const p of proposals) {
    if (!p.id || !p.transliteration) continue;
    if (!p.meaning) {
      skipped += 1;
      continue;
    }
    const re = new RegExp(
      `([\\s\\S]*?\\bid:\\s*"${p.id}"[\\s\\S]*?)(?=\\n\\s*\\{\\n|\\n\\s*p\\(\\{|\\n\\];|\\nexport|$)`
    );
    // Simpler: find id and patch a window
    const idToken = `id: "${p.id}"`;
    const idx = text.indexOf(idToken);
    if (idx === -1) continue;
    const windowEnd = Math.min(text.length, idx + 4000);
    const before = text.slice(0, idx);
    let window = text.slice(idx, windowEnd);
    // cut window at next sibling object start if present
    const cut = window.search(/\n\s*(?:p\()?\{\n\s*id:/);
    if (cut > 0) window = window.slice(0, cut);

    let next = window;
    next = replaceField(next, "transliteration", p.transliteration);
    next = replaceField(next, "meaning", p.meaning);
    const acc = upsertAccuracy(next);
    next = acc.block;
    if (acc.skippedVerified) {
      skipped += 1;
      continue;
    }
    text = before + next + text.slice(idx + window.length);
    applied += 1;
  }
  fs.writeFileSync(file, text);
}

console.log(`Applied ${applied} proposal(s); skipped ${skipped}.`);
console.log("Reminder: accuracy stays draft until a human verifies + sets source.");
