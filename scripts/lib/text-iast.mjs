import Sanscript from "sanscript";

const DEVANAGARI = /[\u0900-\u097F]/;

export function latinizePunctuation(text) {
  return text
    .replace(/\u0964/g, ".")
    .replace(/\u0965/g, "..")
    .replace(/[\u0900-\u097F]/g, "");
}

/** Devanagari → IAST. Already-Latin input is cleaned and returned. */
export function toIast(text) {
  if (!text || !String(text).trim()) return "";
  return String(text)
    .split("\n")
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return "";
      if (!DEVANAGARI.test(trimmed)) {
        return trimmed.replace(/[|ǀǁ]/g, " ").replace(/\s+/g, " ").trim();
      }
      try {
        return latinizePunctuation(
          Sanscript.t(trimmed, "devanagari", "iast")
        ).trim();
      } catch {
        return latinizePunctuation(trimmed).trim();
      }
    })
    .filter(Boolean)
    .join("\n");
}
