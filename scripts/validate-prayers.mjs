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

for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  const blocks = text.split(/\n\s*\{/).slice(1);
  for (const block of blocks) {
    const id = block.match(/id:\s*"([^"]+)"/)?.[1];
    if (!id) continue;
    count += 1;
    const transliteration =
      block.match(/transliteration:\s*`([^`]*)`/)?.[1] ??
      block.match(/transliteration:\s*"([^"]*)"/)?.[1] ??
      "";
    const meaning =
      block.match(/meaning:\s*`([^`]*)`/)?.[1] ??
      block.match(/meaning:\s*"([^"]*)"/)?.[1] ??
      "";
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
}

if (errors.length) {
  console.error(`validate-prayers: ${errors.length} issue(s) in ${count} prayers`);
  for (const e of errors) console.error(" -", e);
  process.exit(1);
}

console.log(
  `validate-prayers: ok (${count} prayers, all have Latin transliteration + meaning)`
);
