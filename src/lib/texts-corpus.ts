import type { CorpusManifestEntry, TextsManifest } from "@/data/texts";

/** Verse JSON packs for a family (skips index-only entries). */
export function loadableCorpora(
  manifest: TextsManifest | null,
  family: string
): CorpusManifestEntry[] {
  if (!manifest) return [];

  const index = manifest.corpora.find((c) => c.id === family);
  const fromParts = index?.parts?.length
    ? index.parts
    : manifest.corpora.filter(
        (c) => c.family === family && !c.path.endsWith("/index.json") && c.id !== family
      );

  const seen = new Set<string>();
  return fromParts.filter((c) => {
    if (!c.path || c.path.endsWith("/index.json")) return false;
    if (seen.has(c.id)) return false;
    seen.add(c.id);
    return true;
  });
}

export function corpusUrl(path: string): string {
  return `/texts/${path.replace(/^\/+/, "")}`;
}
