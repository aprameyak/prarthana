# Real data sources for enrichment

Use these to **check and expand** catalog rows. Prefer named editions over blogs.  
Transliteration stays IAST via `sanscript`. Meanings: public-domain translations or human draft — never scrape modern copyrighted commentaries.

## Prefer (reuse-friendly)

### 1. Nitya open JSON — best machine-readable stotra pack
- **URL:** https://getnitya.com/en/about/data/
- **Files:** `https://getnitya.com/data/{deity}/{text}/{script}.json`  
  Scripts: `dev`, `iast`, `roman`, plus Indic scripts
- **Example:** https://getnitya.com/data/hanuman/chalisa/iast.json
- **License:** Traditional text in JSON = **Public Domain Mark 1.0** (any use).  
  Their **meanings/notes on the website** = **CC BY-NC-SA 4.0** — **do not copy** into Prarthana meanings.
- **Overlap with our catalog:** Gayatri, Mahamrityunjaya, Chalisa (verse-by-verse), Lingashtakam, Madhurashtakam, Mahalakshmi Ashtakam, Achyutashtakam, Kanakadhara, Bajrang Baan, aartis, Venkatesa Suprabhatam, Śāntākāraṃ, etc.
- **How to use:** Pull `dev` + `iast` per verse → fill `sanskrit` / `transliteration` → cite `Nitya (getnitya.com) …/data/…` + credit them → write meaning separately (PD translation or human).

### 2. Sanskrit Wikisource — primary check for stotras
- **URL:** https://sa.wikisource.org/
- **License:** Transcriptions typically **CC BY-SA 4.0**; underlying traditional text public domain
- **Proven path:** Daily Pooja lists exact revision IDs for many stotras we care about:  
  https://www.dailypooja.online/sources.html  
  (Ganapati Atharvashirsha, Rama Raksha, Annapurna, Mahalakshmi Ashtakam, Rudrashtakam, Soundarya Lahari, Vishnu Sahasranama, …)
- **How to use:** Cite `Sanskrit Wikisource, <title>, revision <n>`. Generate IAST locally. Meaning from PD English or human draft.

### 3. VedaWeb + GRETIL — Vedic / scholarly Sanskrit
- **VedaWeb:** https://vedaweb.uni-koeln.de/ · data https://github.com/VedaWebProject/vedaweb-data (per-file CC in TEI)
- **GRETIL:** https://gretil.sub.uni-goettingen.de/gretil.html
- **Use for:** Ṛgveda / Taittirīya forms (Gayatri RV 3.62.10, Tryambaka RV 7.59.12), Upaniṣad śānti verses, other śruti — not aarti/chalisa
- **Digital Corpus of Sanskrit (DCS):** https://sanskrit-linguistics.org/dcs/ — lemma search / attestation, not a stotra dump

### 4. Public-domain English for meanings
| Work | Source | Notes |
|------|--------|--------|
| Rigveda | R. T. H. Griffith, 1896 (Wikisource / Sacred Texts) | Gayatri, Mrityunjaya sense |
| Bhagavad Gītā | Annie Besant 1922 (Dev + EN); Edwin Arnold 1885; Swarupananda 1909 | For Gītā rows (e.g. 4.24) |
| Upaniṣads | Sacred Books of the East / PD editions on Wikisource | Asato mā, Pūrṇam adaḥ, etc. |

Do **not** paste modern Gita Press / ISKCON / commercial app translations.

## Use carefully

| Source | Why careful |
|--------|-------------|
| **Daily Pooja** https://www.dailypooja.online/sources.html | Good **map of Wikisource revisions** + IAST; their site content is CC BY-SA — attribution/share-alike if you reuse their adapted text |
| **SARIT** https://wujastyk.github.io/SARIT-corpus/ | Scholarly TEI search; check each text’s licence |
| **HREEM / similar libraries** | Often cite GRETIL/Wikisource well — use as a **pointer**, verify upstream |

## Avoid / do not bulk-copy

| Source | Reason |
|--------|--------|
| **sanskritdocuments.org** | Explicit: personal study only; no repost/promotion of other sites without permission |
| **stotrasamhita / Stotra Sangrahah** | “Personal use only — not for commercial printing/distribution”; often derived from sanskritdocuments |
| Random blogs, WhatsApp PDFs, SEO mantra sites | No edition, high error rate |
| Nitya **website meanings** | CC BY-NC-SA — incompatible with unrestricted app reuse |

## Enrichment order (mapped to Prarthana gaps)

1. **Verify the 7 already marked verified** against Wikisource/VedaWeb + Griffith/Besant; keep `source` strings precise (edition + revision).
2. **Replace festival one-liners** only when a real festival-linked śloka exists in Wikisource/Nitya; otherwise **delete or demote** — do not invent.
3. **Expand openings → verse rows** from Nitya JSON where we already have “Opening” stubs:  
   Chalisa, Lingashtakam, Madhurashtakam, Achyutashtakam, Bajrang Baan, aartis, Kanakadhara, Mahalakshmi Ashtakam.
4. **Atharvashirsha / Rama Raksha / Annapurna / Rudram openings** — Wikisource revisions listed on Daily Pooja sources page.
5. Meanings: PD translation first; else human/Gemini **draft** only (`accuracy: draft`), never `verified` without source check.

## Cite format (for `source` field)

```
Nitya getnitya.com/data/hanuman/chalisa (dev+iast); text PDM 1.0
Sanskrit Wikisource, रामरक्षास्तोत्रम्, revision 54878 (CC BY-SA 4.0)
Ṛgveda 3.62.10 via VedaWeb / Wikisource; meaning after Griffith 1896 (PD)
Bhagavad Gītā 4.24; Sanskrit+EN after Besant 1922 (PD)
```

## Do not

- Auto-merge Nitya/Wikisource into `verified`
- Copy NC meanings onto the live site
- Treat sanskritdocuments.org as an open corpus
- Bulk-scrape without caching / rate limits (Nitya asks ≤1 full crawl/day)
