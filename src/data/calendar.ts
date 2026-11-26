import type { Festival } from "./types";
import raw from "./hindu-festivals.json";

export type FestivalDay = {
  id: string;
  name: string;
  date: string;
  year: number;
  status: "verified" | "calculated" | string;
  /** Matching tag in our prayer catalog, when one exists. */
  prayerFestival: Festival | null;
};

const PRAYER_FESTIVAL_BY_SLUG: Record<string, Festival | null> = {
  "makar-sankranti": "Makar Sankranti",
  "maha-shivratri": "Maha Shivaratri",
  holi: "Holi",
  "ram-navami": "Rama Navami",
  "raksha-bandhan": "Raksha Bandhan",
  janmashtami: "Janmashtami",
  "ganesh-chaturthi": "Ganesh Chaturthi",
  navratri: "Navaratri",
  dussehra: "Durga Puja",
  "karwa-chauth": "Karva Chauth",
  dhanteras: "Diwali",
  "choti-diwali": "Diwali",
  "govardhan-puja": "Diwali",
  "bhai-dooj": "Diwali",
  "chhath-puja": "Chhath Puja",
};

export const FESTIVAL_CALENDAR_META = raw.meta;

export const FESTIVAL_DAYS: FestivalDay[] = raw.rows.map((row) => ({
  id: `${row.festival}-${row.date}`,
  name: row.name,
  date: row.date,
  year: row.year,
  status: row.status,
  prayerFestival: PRAYER_FESTIVAL_BY_SLUG[row.festival] ?? null,
}));

function todayIso(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function upcomingFestivalDays(limit = 12): FestivalDay[] {
  const today = todayIso();
  return FESTIVAL_DAYS.filter((f) => f.date >= today).slice(0, limit);
}

export function festivalDaysForYear(year: number): FestivalDay[] {
  return FESTIVAL_DAYS.filter((f) => f.year === year);
}

export function formatFestivalDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
