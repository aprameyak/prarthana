import { CATALOG } from "./catalog";
import { CATALOG_MORE } from "./catalog-more";
import type { Festival, Occasion, Prayer, PrayerKind } from "./types";

export type { Deity, Festival, Occasion, Prayer, PrayerKind } from "./types";
export {
  DEITIES,
  FESTIVALS,
  KINDS,
  OCCASIONS,
  OCCASION_LABELS,
  KIND_LABELS,
} from "./types";

export const PRAYERS: Prayer[] = [...CATALOG, ...CATALOG_MORE];

export function getPrayer(id: string): Prayer | undefined {
  return PRAYERS.find((p) => p.id === id);
}

export function filterPrayers(opts: {
  deity?: string;
  occasion?: string;
  festival?: string;
  kind?: string;
  q?: string;
}): Prayer[] {
  const q = opts.q?.trim().toLowerCase() ?? "";
  return PRAYERS.filter((p) => {
    if (opts.deity && opts.deity !== "all" && !p.deities.includes(opts.deity as never)) {
      return false;
    }
    if (
      opts.occasion &&
      opts.occasion !== "all" &&
      !p.occasions.includes(opts.occasion as Occasion)
    ) {
      return false;
    }
    if (
      opts.festival &&
      opts.festival !== "all" &&
      !p.festivals.includes(opts.festival as Festival)
    ) {
      return false;
    }
    if (opts.kind && opts.kind !== "all" && p.kind !== (opts.kind as PrayerKind)) {
      return false;
    }
    if (!q) return true;
    const hay = [
      p.title,
      p.deities.join(" "),
      p.occasions.join(" "),
      p.festivals.join(" "),
      p.kind,
      p.transliteration,
      p.meaning,
      p.tags.join(" "),
    ]
      .join(" ")
      .toLowerCase();
    return hay.includes(q);
  });
}
