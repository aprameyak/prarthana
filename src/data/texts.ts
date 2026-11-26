import { getPrayer, type Prayer } from "./prayers";

export type TextFamily = "vedas" | "ramayana" | "mahabharata" | "puranas";

export type ScriptureText = {
  id: TextFamily;
  title: string;
  familyLabel: string;
  summary: string;
  prayerIds: string[];
  external?: {
    label: string;
    href: string;
  };
};

export const TEXTS: ScriptureText[] = [
  {
    id: "vedas",
    title: "Vedas",
    familyLabel: "Shruti",
    summary: "Rigveda in Latin transliteration. Related mantras are under Prayers.",
    prayerIds: [
      "gayatri",
      "maha-mrityunjaya",
      "rudram-open",
      "purnamadah",
      "asato-ma",
      "shanti-mantra",
    ],
  },
  {
    id: "ramayana",
    title: "Ramayana",
    familyLabel: "Itihasa",
    summary: "Valmiki Ramayana by kanda, in Latin transliteration.",
    prayerIds: [
      "rama-taraka",
      "rama-raksha-1",
      "ramachandra-mantra",
      "sita-mantra",
      "lakshmana-mantra",
      "aditya-hridayam-1",
      "hanuman-chalisa-doha",
    ],
  },
  {
    id: "mahabharata",
    title: "Mahabharata",
    familyLabel: "Itihasa",
    summary: "Bhagavad Gita in Latin transliteration. Search the full Gita on GitaGPT.",
    prayerIds: ["brahmaarpanam", "om-namo-bhagavate-vasudevaya"],
    external: {
      label: "Search the Gita",
      href: "https://gitagpt.aprameyakannan.com",
    },
  },
  {
    id: "puranas",
    title: "Puranas",
    familyLabel: "Smriti",
    summary: "Vishnu Sahasranama names in Latin transliteration.",
    prayerIds: [
      "vishnu-sahasranama-dhyana",
      "dashavatara-1",
      "venkatesha-suprabhatam-1",
      "mukunda-mala-1",
      "madhurashtakam-1",
    ],
  },
];

export function getText(id: string): ScriptureText | undefined {
  return TEXTS.find((t) => t.id === id);
}

export function prayersForText(text: ScriptureText): Prayer[] {
  return text.prayerIds
    .map((id) => getPrayer(id))
    .filter((p): p is Prayer => Boolean(p));
}

export type CorpusManifestEntry = {
  id: string;
  title: string;
  family: string;
  path: string;
  verseCount: number;
  kanda?: string;
  parts?: CorpusManifestEntry[];
};

export type TextsManifest = {
  generated: string;
  note?: string;
  corpora: CorpusManifestEntry[];
};

export type CorpusVerse = {
  ref: string;
  chapter?: number;
  hymn?: number;
  verse?: number;
  kanda?: string;
  transliteration: string;
};

export type CorpusFile = {
  id: string;
  title: string;
  family: string;
  source: string;
  licence?: string;
  verseCount: number;
  verses: CorpusVerse[];
  kandas?: CorpusManifestEntry[];
};
