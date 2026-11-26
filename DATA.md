# Prayer data rules

The catalog is the product. **Accuracy beats quantity.**

**Published app UI is Latin-only** (transliteration + English meaning).  
Devanagari may be stored in the catalog for source accuracy / enrichment, but it is **not shown** on the site.

Devanagari (or any Indic script) alone is **not enough** in the data layer either — every entry must have Latin transliteration and English meaning.

## Hard requirements (every entry)

| Field | Script | Rule |
|-------|--------|------|
| `sanskrit` | Devanagari / Indic OK | Source text — never the only field |
| `transliteration` | **Latin only** | Pronunciation (IAST). Required. |
| `meaning` | **English / Latin only** | Translation/sense. Required. |

Missing transliteration or meaning → **do not merge**.

## How to produce Latin fields

### One-off
```bash
npm run enrich:prayer -- --sanskrit "ॐ नमः शिवाय"
npm run enrich:prayer -- --sanskrit "ॐ नमः शिवाय" --translate   # GEMINI_API_KEY
```

### Periodic draft completion (recommended)
Weekly GitHub Action **Enrich Catalog Drafts** (or local):

```bash
# Scan gaps → write src/data/drafts/enrichment-YYYY-MM-DD.json
GEMINI_API_KEY=... npm run complete:drafts -- --limit 10 --translate

# After human review of that JSON:
npm run apply:drafts -- src/data/drafts/enrichment-YYYY-MM-DD.json
npm run validate:prayers
```

**Policy**
- Transliteration: deterministic IAST (`sanscript`) — not AI  
- Meaning: Gemini may draft only  
- Output accuracy is always `draft`  
- Action opens a **PR with the JSON**; it does not auto-merge into verified catalog  
- `verified` + `source` are human-only

## Accuracy fields

| Field | Values | Rule |
|-------|--------|------|
| `accuracy` | `unreviewed` \| `draft` \| `verified` | Default `unreviewed`. Only `verified` after human check against `source`. |
| `completeness` | `full` \| `excerpt` | `excerpt` if only an opening/partial verse of a longer work |
| `source` | string | Scripture, stotra name, or standard edition used for the text |

### When is an entry `verified`?

1. Sanskrit checked against a named source  
2. Transliteration matches that Sanskrit  
3. Meaning checked so it does not contradict the text  
4. `source` filled in  

Until then it stays `unreviewed` or `draft` and should be labeled as such in the UI.

## Collection order

1. Short, fixed mantras/slokas with clear standard forms (Gayatri, panchakshari, meal shlokas)  
2. Well-known stotra verses with edition cited  
3. Festival packs  
4. Long works **verse-by-verse** (Chalisa, Ashtakam) — each row its own transliteration + meaning  

Never paste a whole Chalisa as one unchecked blob.

## Where to get real text

See **[SOURCES.md](./SOURCES.md)** — Nitya PD JSON, Sanskrit Wikisource, VedaWeb/GRETIL, PD English editions.  
Prefer those over blogs. Do not bulk-copy sanskritdocuments.org.

## Do not

- Invent Sanskrit to “fill” a festival  
- Copy from random blogs without checking  
- Mark `verified` without a source  
- Prefer poetic paraphrase over clear meaning  

## Validate

```bash
npm run validate:prayers
```

Checks Latin transliteration + meaning presence. Human verification is still required for `accuracy: verified`.
