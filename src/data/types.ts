export const DEITIES = [
  "Ganesha",
  "Shiva",
  "Parvati",
  "Vishnu",
  "Lakshmi",
  "Krishna",
  "Rama",
  "Sita",
  "Hanuman",
  "Devi",
  "Durga",
  "Saraswati",
  "Kali",
  "Skanda",
  "Surya",
  "Chandra",
  "Guru",
  "Navagraha",
  "Tulsi",
  "General",
] as const;

export type Deity = (typeof DEITIES)[number];

export const OCCASIONS = [
  "morning",
  "evening",
  "night",
  "meal",
  "study",
  "travel",
  "healing",
  "protection",
  "prosperity",
  "new-beginnings",
  "anytime",
] as const;

export type Occasion = (typeof OCCASIONS)[number];

export const FESTIVALS = [
  "Diwali",
  "Navaratri",
  "Durga Puja",
  "Holi",
  "Janmashtami",
  "Rama Navami",
  "Hanuman Jayanti",
  "Maha Shivaratri",
  "Ganesh Chaturthi",
  "Makar Sankranti",
  "Pongal",
  "Raksha Bandhan",
  "Karva Chauth",
  "Ekadasashi",
  "Guru Purnima",
  "Krishna Paksha",
  "Ugadi",
  "Gudi Padwa",
  "Onam",
  "Chhath Puja",
  "Kartik Purnima",
  "Vasanta Panchami",
  "Mahalaya",
] as const;

export type Festival = (typeof FESTIVALS)[number];

export const KINDS = [
  "mantra",
  "stotra",
  "aarti",
  "chalisa",
  "ashtakam",
  "sloka",
  "suprabhatam",
  "prayer",
] as const;

export type PrayerKind = (typeof KINDS)[number];

export const ACCURACY = ["unreviewed", "draft", "verified"] as const;
export type AccuracyStatus = (typeof ACCURACY)[number];

export const COMPLETENESS = ["full", "excerpt"] as const;
export type Completeness = (typeof COMPLETENESS)[number];

/**
 * Hard rules for every prayer:
 * - `sanskrit` may use Devanagari (or other Indic script) for sourcing; never shown in the UI
 * - `transliteration` MUST be Latin script, match the Sanskrit, and is what the app publishes
 * - `meaning` MUST be English in Latin script and faithful to the text
 * - Prefer `verified` only after human check + `source`
 * Never ship an entry missing transliteration or meaning.
 */
export type Prayer = {
  id: string;
  title: string;
  deities: Deity[];
  occasions: Occasion[];
  festivals: Festival[];
  kind: PrayerKind;
  /** Original text (often Devanagari). */
  sanskrit: string;
  /** Required. Latin-script transliteration for reading aloud. */
  transliteration: string;
  /** Required. Plain English meaning in Latin script. */
  meaning: string;
  tags: string[];
  /** Named scripture/stotra/edition used for the Sanskrit. */
  source?: string;
  /** Human verification state. Default unreviewed. */
  accuracy: AccuracyStatus;
  /** Full unit vs opening/partial of a longer work. */
  completeness: Completeness;
};

export const OCCASION_LABELS: Record<Occasion, string> = {
  morning: "Morning",
  evening: "Evening",
  night: "Night",
  meal: "Before meals",
  study: "Study",
  travel: "Travel",
  healing: "Healing",
  protection: "Protection",
  prosperity: "Prosperity",
  "new-beginnings": "New beginnings",
  anytime: "Anytime",
};

export const KIND_LABELS: Record<PrayerKind, string> = {
  mantra: "Mantra",
  stotra: "Stotra",
  aarti: "Aarti",
  chalisa: "Chalisa",
  ashtakam: "Ashtakam",
  sloka: "Sloka",
  suprabhatam: "Suprabhatam",
  prayer: "Prayer",
};
