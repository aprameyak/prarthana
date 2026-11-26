export type Deity =
  | "Ganesha"
  | "Shiva"
  | "Vishnu"
  | "Devi"
  | "Hanuman"
  | "Surya"
  | "General";

export type Occasion = "morning" | "evening" | "anytime" | "festival";

export type Prayer = {
  id: string;
  title: string;
  deity: Deity;
  occasion: Occasion;
  sanskrit: string;
  transliteration: string;
  meaning: string;
  tags: string[];
};

export const PRAYERS: Prayer[] = [
  {
    id: "gayatri",
    title: "Gayatri Mantra",
    deity: "Surya",
    occasion: "morning",
    sanskrit:
      "ॐ भूर्भुवः स्वः\nतत्सवितुर्वरेण्यं\nभर्गो देवस्य धीमहि\nधियो यो नः प्रचोदयात् ॥",
    transliteration:
      "Om bhūr bhuvaḥ svaḥ\ntat savitur vareṇyaṃ\nbhargo devasya dhīmahi\ndhiyo yo naḥ pracodayāt",
    meaning:
      "We meditate on the divine light of the Sun that illuminates the three worlds. May that light awaken and guide our intellect.",
    tags: ["mantra", "daily", "wisdom"],
  },
  {
    id: "ganesha-vandana",
    title: "Ganesha Vandana",
    deity: "Ganesha",
    occasion: "anytime",
    sanskrit:
      "वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ ।\nनिर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥",
    transliteration:
      "Vakratuṇḍa mahākāya sūryakoṭi samaprabha\nNirvighnaṃ kuru me deva sarvakāryeṣu sarvadā",
    meaning:
      "O Lord with the curved trunk and vast form, shining like a million suns—remove obstacles from all my undertakings, always.",
    tags: ["opening", "new beginnings"],
  },
  {
    id: "om-namah-shivaya",
    title: "Om Namah Shivaya",
    deity: "Shiva",
    occasion: "anytime",
    sanskrit: "ॐ नमः शिवाय",
    transliteration: "Om namaḥ śivāya",
    meaning:
      "A salutation to Shiva—the auspicious one. A five-syllable mantra of surrender, purification, and still awareness.",
    tags: ["mantra", "japa", "meditation"],
  },
  {
    id: "maha-mrityunjaya",
    title: "Maha Mrityunjaya Mantra",
    deity: "Shiva",
    occasion: "anytime",
    sanskrit:
      "ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् ।\nउर्वारुकमिव बन्धनान् मृत्योर्मुक्षीय माऽमृतात् ॥",
    transliteration:
      "Om tryambakaṃ yajāmahe sugandhiṃ puṣṭivardhanam\nUrvārukamiva bandhanān mṛtyormukṣīya mā'mṛtāt",
    meaning:
      "We worship the three-eyed One, fragrant and nourishing. As a cucumber is freed from its vine, may we be freed from death into immortality—not denied of the nectar of life.",
    tags: ["healing", "protection", "mantra"],
  },
  {
    id: "om-namo-narayanaya",
    title: "Om Namo Narayanaya",
    deity: "Vishnu",
    occasion: "anytime",
    sanskrit: "ॐ नमो नारायणाय",
    transliteration: "Om namo nārāyaṇāya",
    meaning:
      "Salutations to Narayana—Vishnu as the resting place of all beings. A mantra of devotion, refuge, and compassion.",
    tags: ["mantra", "bhakti", "japa"],
  },
  {
    id: "hanuman-chalisa-doha",
    title: "Hanuman Chalisa — Opening Doha",
    deity: "Hanuman",
    occasion: "anytime",
    sanskrit:
      "श्रीगुरु चरन सरोज रज निज मनु मुकुर सुधारि ।\nबरनउँ रघुबर बिमल जसु जो दायकु फल चारि ॥",
    transliteration:
      "Śrīguru carana saroja raja nija manu mukura sudhāri\nBaranaūṃ raghubara bimala jasu jo dāyaku phala cāri",
    meaning:
      "With the dust of the Guru's lotus feet I polish the mirror of my mind, and sing the pure glory of Raghuvira, which grants the four fruits of life.",
    tags: ["chalisa", "courage", "devotion"],
  },
  {
    id: "saraswati-vandana",
    title: "Saraswati Vandana",
    deity: "Devi",
    occasion: "morning",
    sanskrit:
      "या कुन्देन्दुतुषारहारधवला या शुभ्रवस्त्रावृता\nया वीणावरदण्डमण्डितकरा या श्वेतपद्मासना ।\nया ब्रह्माच्युतशङ्करप्रभृतिभिर्देवैः सदा वन्दिता\nसा मां पातु सरस्वती भगवती निःशेषजाड्यापहा ॥",
    transliteration:
      "Yā kundendutuṣārahāradhavalā yā śubhravastrāvṛtā\nYā vīṇāvaradaṇḍamaṇḍitakarā yā śvetapadmāsanā\nYā brahmācyutaśaṅkaraprabhṛtibhirdevaiḥ sadā vanditā\nSā māṃ pātu sarasvatī bhagavatī niḥśeṣajāḍyāpahā",
    meaning:
      "May Goddess Saraswati—radiant as jasmine, moon, and snow, seated on a white lotus, forever praised by the gods—protect me and remove all dullness of mind.",
    tags: ["learning", "arts", "study"],
  },
  {
    id: "shanti-mantra",
    title: "Shanti Mantra",
    deity: "General",
    occasion: "evening",
    sanskrit:
      "ॐ सर्वे भवन्तु सुखिनः\nसर्वे सन्तु निरामयाः ।\nसर्वे भद्राणि पश्यन्तु\nमा कश्चिद्दुःखभाग्भवेत् ।\nॐ शान्तिः शान्तिः शान्तिः ॥",
    transliteration:
      "Om sarve bhavantu sukhinaḥ\nsarve santu nirāmayāḥ\nsarve bhadrāṇi paśyantu\nmā kaścid duḥkhabhāg bhavet\nOm śāntiḥ śāntiḥ śāntiḥ",
    meaning:
      "May all be happy. May all be free from illness. May all see what is auspicious. May none suffer. Peace, peace, peace.",
    tags: ["peace", "closing", "universal"],
  },
  {
    id: "asato-ma",
    title: "Asato Ma Sad Gamaya",
    deity: "General",
    occasion: "anytime",
    sanskrit:
      "असतो मा सद्गमय ।\nतमसो मा ज्योतिर्गमय ।\nमृत्योर्मा अमृतं गमय ॥",
    transliteration:
      "Asato mā sad gamaya\nTamaso mā jyotir gamaya\nMṛtyor mā amṛtaṃ gamaya",
    meaning:
      "Lead me from the unreal to the real, from darkness to light, from death to immortality.",
    tags: ["upanishad", "guidance", "mantra"],
  },
  {
    id: "lakshmi-ashtakshara",
    title: "Om Shreem Mahalakshmyai Namah",
    deity: "Devi",
    occasion: "evening",
    sanskrit: "ॐ श्रीं महालक्ष्म्यै नमः",
    transliteration: "Om śrīṃ mahālakṣmyai namaḥ",
    meaning:
      "Salutations to Mahalakshmi. A seed mantra invoking abundance, grace, and inner wealth.",
    tags: ["lakshmi", "prosperity", "japa"],
  },
];

export const DEITIES: Deity[] = [
  "Ganesha",
  "Shiva",
  "Vishnu",
  "Devi",
  "Hanuman",
  "Surya",
  "General",
];

export function getPrayer(id: string): Prayer | undefined {
  return PRAYERS.find((p) => p.id === id);
}

export function filterPrayers(opts: {
  deity?: string;
  occasion?: string;
  q?: string;
}): Prayer[] {
  const q = opts.q?.trim().toLowerCase() ?? "";
  return PRAYERS.filter((p) => {
    if (opts.deity && opts.deity !== "all" && p.deity !== opts.deity) return false;
    if (opts.occasion && opts.occasion !== "all" && p.occasion !== opts.occasion)
      return false;
    if (!q) return true;
    const hay = `${p.title} ${p.deity} ${p.transliteration} ${p.meaning} ${p.tags.join(" ")}`.toLowerCase();
    return hay.includes(q);
  });
}
