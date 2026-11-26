import { CATALOG } from "./catalog";
import { CATALOG_MORE } from "./catalog-more";
import type { Completeness, Festival, Occasion, Prayer, PrayerKind } from "./types";

export type { Deity, Festival, Occasion, Prayer, PrayerKind, AccuracyStatus } from "./types";
export {
  DEITIES,
  FESTIVALS,
  KINDS,
  OCCASIONS,
  OCCASION_LABELS,
  KIND_LABELS,
} from "./types";

function inferCompleteness(title: string): Completeness {
  return /opening|spirit|verse\s*1|short|remembrance/i.test(title)
    ? "excerpt"
    : "full";
}

/** Ensure every row has accuracy metadata; nothing is verified by default. */
function normalize(
  prayer: Omit<Prayer, "accuracy" | "completeness"> &
    Partial<Pick<Prayer, "accuracy" | "completeness" | "source">>
): Prayer {
  return {
    ...prayer,
    festivals: prayer.festivals ?? [],
    tags: prayer.tags ?? [],
    accuracy: prayer.accuracy ?? "unreviewed",
    completeness: prayer.completeness ?? inferCompleteness(prayer.title),
  };
}

export const PRAYERS: Prayer[] = [...CATALOG, ...CATALOG_MORE].map(normalize);

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
