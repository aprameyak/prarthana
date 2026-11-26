import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const files = [
  path.join(root, "src/data/catalog.ts"),
  path.join(root, "src/data/catalog-more.ts"),
];

const DEVANAGARI = /[\u0900-\u097F]/;
const errors = [];
let count = 0;

function check(id, transliteration, meaning) {
  count += 1;
  if (!transliteration.trim()) {
    errors.push(`${id}: missing Latin transliteration`);
  } else if (DEVANAGARI.test(transliteration)) {
    errors.push(`${id}: transliteration must be Latin script only`);
  }
  if (!meaning.trim()) {
    errors.push(`${id}: missing Latin/English meaning`);
  } else if (DEVANAGARI.test(meaning)) {
    errors.push(`${id}: meaning must be Latin script (English)`);
  }
}

for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  const idMatches = [...text.matchAll(/\bid:\s*"([^"]+)"/g)];
  for (const match of idMatches) {
    const id = match[1];
    const from = match.index ?? 0;
    const slice = text.slice(from, from + 2500);
    const transliteration =
      slice.match(/transliteration:\s*`([^`]*)`/)?.[1] ??
      slice.match(/transliteration:\s*"([^"]*)"/)?.[1] ??
      "";
    const meaning =
      slice.match(/meaning:\s*`([^`]*)`/)?.[1] ??
      slice.match(/meaning:\s*"([^"]*)"/)?.[1] ??
      "";
    check(id, transliteration, meaning);
  }
}

if (errors.length) {
  console.error(`validate-prayers: ${errors.length} issue(s) in ${count} prayers`);
  for (const e of errors) console.error(" -", e);
  process.exit(1);
}

console.log(
  `validate-prayers: ok (${count} prayers, all have Latin transliteration + meaning)`
);
