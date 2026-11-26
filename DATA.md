# Prayer data rules

The catalog is the product. **Accuracy beats quantity.**

Devanagari (or any Indic script) alone is **not enough**. Every entry must also be **transliterated into Latin** and **translated into English** so anyone can read and understand it.

## Hard requirements (every entry)

| Field | Script | Rule |
|-------|--------|------|
| `sanskrit` | Devanagari / Indic OK | Source text — never the only field |
| `transliteration` | **Latin only** | Pronunciation (IAST). Required. |
| `meaning` | **English / Latin only** | Translation/sense. Required. |

Missing transliteration or meaning → **do not merge**.

## How to produce Latin fields

```bash
# IAST transliteration from Devanagari (deterministic)
npm run enrich:prayer -- --sanskrit "ॐ नमः शिवाय"

# Also draft English meaning (needs GEMINI_API_KEY); stays accuracy=draft
npm run enrich:prayer -- --sanskrit "ॐ नमः शिवाय" --translate
```

- Transliteration: `sanscript` Devanagari → IAST  
- Meaning: optional Gemini draft only — still must be human-checked before `verified`  
- Never mark `verified` from the enrich script alone

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
