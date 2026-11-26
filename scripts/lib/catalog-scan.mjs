import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

export const CATALOG_FILES = [
  path.join(root, "src/data/catalog.ts"),
  path.join(root, "src/data/catalog-more.ts"),
];

export const DRAFTS_DIR = path.join(root, "src/data/drafts");

const DEVANAGARI = /[\u0900-\u097F]/;

/** Parse prayer-ish objects from catalog TS by id (best-effort text scan). */
export function loadPrayerRecords() {
  const records = [];
  for (const file of CATALOG_FILES) {
    const text = fs.readFileSync(file, "utf8");
    const idMatches = [...text.matchAll(/\bid:\s*"([^"]+)"/g)];
    for (const match of idMatches) {
      const id = match[1];
      const from = match.index ?? 0;
      const slice = text.slice(from, from + 3500);
      const field = (name) => {
        const m =
          slice.match(new RegExp(`${name}:\\s*\`([\\s\\S]*?)\``)) ||
          slice.match(new RegExp(`${name}:\\s*"([^"]*)"`));
        return m?.[1] ?? "";
      };
      const accuracy =
        slice.match(/accuracy:\s*"([^"]+)"/)?.[1] ?? "unreviewed";
      records.push({
        id,
        file,
        sanskrit: field("sanskrit"),
        transliteration: field("transliteration"),
        meaning: field("meaning"),
        accuracy,
        source: slice.match(/source:\s*"([^"]*)"/)?.[1] ?? "",
      });
    }
  }
  return records;
}

export function needsCompletion(row) {
  if (row.accuracy === "verified") return false;
  if (!row.transliteration.trim()) return true;
  if (DEVANAGARI.test(row.transliteration)) return true;
  if (!row.meaning.trim()) return true;
  if (row.meaning.trim().length < 40) return true;
  return false;
}

export function reasons(row) {
  const out = [];
  if (!row.transliteration.trim()) out.push("missing-transliteration");
  if (DEVANAGARI.test(row.transliteration)) out.push("transliteration-not-latin");
  if (!row.meaning.trim()) out.push("missing-meaning");
  else if (row.meaning.trim().length < 40) out.push("meaning-too-thin");
  if (row.accuracy !== "verified") out.push(`accuracy:${row.accuracy}`);
  return out;
}
