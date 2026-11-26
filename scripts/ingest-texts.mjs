#!/usr/bin/env node
/**
 * Fetch scripture sources and write Latin transliteration JSON under public/texts/.
 *
 *   npm run ingest:texts
 *   npm run ingest:texts -- --only gita,rigveda
 *   npm run ingest:texts -- --only ramayana --kanda bala
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { toIast } from "./lib/text-iast.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "public", "texts");

const ONLY = (() => {
  const i = process.argv.indexOf("--only");
  if (i === -1) return null;
  return new Set(
    String(process.argv[i + 1] || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  );
})();

const KANDA_FILTER = (() => {
  const i = process.argv.indexOf("--kanda");
  if (i === -1) return null;
  return String(process.argv[i + 1] || "").trim().toLowerCase() || null;
})();

function want(id) {
  return !ONLY || ONLY.has(id);
}

async function fetchText(url) {
  const res = await fetch(url, {
    headers: { "user-agent": "prarthana-ingest/0.1 (+https://github.com/aprameyak/prarthana)" },
  });
  if (!res.ok) throw new Error(`GET ${url} → ${res.status}`);
  return res.text();
}

async function fetchJson(url) {
  return JSON.parse(await fetchText(url));
}

function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data) + "\n");
}

/** Minimal CSV parser that respects quotes. */
function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let i = 0;
  let inQuotes = false;
  while (i < text.length) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          cell += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i += 1;
        continue;
      }
      cell += ch;
      i += 1;
      continue;
    }
    if (ch === '"') {
      inQuotes = true;
      i += 1;
      continue;
    }
    if (ch === ",") {
      row.push(cell);
      cell = "";
      i += 1;
      continue;
    }
    if (ch === "\n" || (ch === "\r" && text[i + 1] === "\n")) {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
      i += ch === "\r" ? 2 : 1;
      continue;
    }
    if (ch === "\r") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
      i += 1;
      continue;
    }
    cell += ch;
    i += 1;
  }
  if (cell.length || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

async function ingestGita() {
  console.log("gita: downloading…");
  const verses = await fetchJson(
    "https://raw.githubusercontent.com/gita/gita/master/data/verse.json"
  );
  const outVerses = verses.map((v) => {
    const transliteration = (v.transliteration || toIast(v.text || ""))
      .replace(/\s+\n/g, "\n")
      .trim();
    return {
      ref: `${v.chapter_number}.${v.verse_number}`,
      chapter: Number(v.chapter_number),
      verse: Number(v.verse_number),
      transliteration,
    };
  });
  const corpus = {
    id: "bhagavad-gita",
    title: "Bhagavad Gita",
    family: "mahabharata",
    source: "gita/gita verse.json (Unlicense)",
    licence: "Unlicense",
    verseCount: outVerses.length,
    verses: outVerses,
  };
  writeJson(path.join(OUT, "mahabharata", "bhagavad-gita.json"), corpus);
  console.log(`gita: ${outVerses.length} verses`);
  return {
    id: corpus.id,
    title: corpus.title,
    family: corpus.family,
    path: "mahabharata/bhagavad-gita.json",
    verseCount: corpus.verseCount,
  };
}

async function ingestRigveda() {
  console.log("rigveda: downloading CSV…");
  const csv = await fetchText(
    "https://huggingface.co/datasets/rajkumarmahto/Vedas/resolve/main/rigveda_complete.csv"
  );
  const rows = parseCsv(csv);
  const header = rows[0].map((h) => h.trim());
  const idx = {
    mandala: header.indexOf("Mandala"),
    sukta: header.indexOf("Sukta"),
    rik: header.indexOf("Rik_Number"),
    samhita: header.indexOf("Samhita_Devanagari"),
  };
  if (Object.values(idx).some((n) => n < 0)) {
    throw new Error(`rigveda: unexpected CSV header: ${header.join(",")}`);
  }
  const verses = [];
  for (const row of rows.slice(1)) {
    if (!row[idx.samhita]) continue;
    const chapter = Number(row[idx.mandala]);
    const hymn = Number(row[idx.sukta]);
    const verse = Number(row[idx.rik]);
    if (!chapter || !hymn || !verse) continue;
    verses.push({
      ref: `${chapter}.${hymn}.${verse}`,
      chapter,
      hymn,
      verse,
      transliteration: toIast(row[idx.samhita]),
    });
  }
  const corpus = {
    id: "rigveda",
    title: "Rigveda",
    family: "vedas",
    source:
      "rajkumarmahto/Vedas CSV (GRETIL-derived); Devanagari to IAST via sanscript",
    licence: "See GRETIL / dataset terms",
    verseCount: verses.length,
    verses,
  };
  writeJson(path.join(OUT, "vedas", "rigveda.json"), corpus);
  console.log(`rigveda: ${verses.length} verses`);
  return {
    id: corpus.id,
    title: corpus.title,
    family: corpus.family,
    path: "vedas/rigveda.json",
    verseCount: corpus.verseCount,
  };
}

const RAMAYANA_KANDAS = [
  { id: "bala", key: "balakanda", file: "balakanda_all.json", title: "Bala Kanda" },
  { id: "ayodhya", key: "ayodhyakanda", file: "ayodhyakanda_all.json", title: "Ayodhya Kanda" },
  { id: "aranya", key: "aranyakanda", file: "aranyakanda_all.json", title: "Aranya Kanda" },
  {
    id: "kishkindha",
    key: "kishkindhakanda",
    file: "kishkindhakanda_all.json",
    title: "Kishkindha Kanda",
  },
  { id: "sundara", key: "sundarakanda", file: "sundarakanda_all.json", title: "Sundara Kanda" },
  { id: "yuddha", key: "yuddha_kanda", file: "yudhhakanda_all.json", title: "Yuddha Kanda" },
  { id: "uttara", key: "uttarakanda", file: "uttarakanda_all.json", title: "Uttara Kanda" },
];

async function ingestRamayana() {
  const base =
    "https://raw.githubusercontent.com/svenkatreddy/Ramayana_Book/master/san";
  const kandas = [];
  let total = 0;

  for (const kanda of RAMAYANA_KANDAS) {
    if (KANDA_FILTER && kanda.id !== KANDA_FILTER) continue;
    console.log(`ramayana: ${kanda.id}…`);
    const raw = await fetchJson(`${base}/${kanda.file}`);
    const block = raw[kanda.key];
    if (!block?.chapters) throw new Error(`ramayana: missing ${kanda.key} in ${kanda.file}`);
    const verses = [];
    for (const ch of block.chapters) {
      const chapter = Number(ch.chapter_number);
      (ch.slokas || []).forEach((sloka, i) => {
        verses.push({
          ref: `${kanda.id}.${chapter}.${i + 1}`,
          kanda: kanda.id,
          chapter,
          verse: i + 1,
          transliteration: toIast(sloka),
        });
      });
    }
    const corpus = {
      id: `ramayana-${kanda.id}`,
      title: `Ramayana · ${kanda.title}`,
      family: "ramayana",
      source:
        "svenkatreddy/Ramayana_Book (Wikisource Sanskrit); Devanagari to IAST via sanscript",
      licence: "CC BY-SA 4.0 (Wikisource transcription)",
      verseCount: verses.length,
      verses,
    };
    const rel = `ramayana/${kanda.id}.json`;
    writeJson(path.join(OUT, rel), corpus);
    kandas.push({
      id: corpus.id,
      title: corpus.title,
      family: "ramayana",
      path: rel,
      verseCount: corpus.verseCount,
      kanda: kanda.id,
    });
    total += verses.length;
    console.log(`ramayana: ${kanda.id} ${verses.length} verses`);
  }

  writeJson(path.join(OUT, "ramayana", "index.json"), {
    id: "ramayana",
    title: "Ramayana",
    family: "ramayana",
    kandaCount: kandas.length,
    verseCount: total,
    parts: kandas,
  });
  return {
    id: "ramayana",
    title: "Ramayana",
    family: "ramayana",
    path: "ramayana/index.json",
    verseCount: total,
    parts: kandas,
  };
}

async function ingestSahasranama() {
  console.log("puranas: vishnu sahasranama…");
  const atlas = await fetchJson(
    "https://raw.githubusercontent.com/sahasranama/sahasranama.github.io/main/data/atlas.json"
  );
  const verses = (atlas.nodes || []).map((n) => ({
    ref: String(n.n),
    chapter: Number(n.sloka) || 1,
    verse: Number(n.n),
    transliteration: (n.iast || toIast(n.dev || "")).trim(),
  }));
  const corpus = {
    id: "vishnu-sahasranama",
    title: "Vishnu Sahasranama",
    family: "puranas",
    source: "sahasranama.github.io atlas.json (IAST names only)",
    licence: "Traditional names; English meanings omitted",
    verseCount: verses.length,
    verses,
  };
  writeJson(path.join(OUT, "puranas", "vishnu-sahasranama.json"), corpus);
  console.log(`puranas: ${verses.length} names`);
  return {
    id: corpus.id,
    title: corpus.title,
    family: corpus.family,
    path: "puranas/vishnu-sahasranama.json",
    verseCount: corpus.verseCount,
  };
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const corpora = [];

  if (want("gita") || want("mahabharata")) corpora.push(await ingestGita());
  if (want("rigveda") || want("vedas")) corpora.push(await ingestRigveda());
  if (want("ramayana")) corpora.push(await ingestRamayana());
  if (want("sahasranama") || want("puranas")) corpora.push(await ingestSahasranama());

  if (!corpora.length) {
    console.error("Nothing selected. Use --only gita,rigveda,ramayana,puranas");
    process.exit(1);
  }

  // Merge with existing manifest entries when running --only
  const manifestPath = path.join(OUT, "manifest.json");
  let previous = [];
  if (fs.existsSync(manifestPath) && ONLY) {
    try {
      previous = JSON.parse(fs.readFileSync(manifestPath, "utf8")).corpora || [];
    } catch {
      previous = [];
    }
  }
  const byId = new Map(previous.map((c) => [c.id, c]));
  for (const c of corpora) byId.set(c.id, c);

  const familyOrder = ["vedas", "ramayana", "mahabharata", "puranas"];
  const merged = [...byId.values()].sort((a, b) => {
    const ai = familyOrder.indexOf(a.family);
    const bi = familyOrder.indexOf(b.family);
    if (ai !== bi) return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    return a.title.localeCompare(b.title);
  });

  const manifest = {
    generated: new Date().toISOString(),
    note: "Transliteration only; English meanings from upstream packs are not included.",
    corpora: merged,
  };
  writeJson(manifestPath, manifest);
  console.log(`wrote ${manifestPath} (${manifest.corpora.length} corpora)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
