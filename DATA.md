# Prayer data rules

The catalog is the product. **Accuracy beats quantity.**

## Hard requirements (every entry)

| Field | Script | Rule |
|-------|--------|------|
| `sanskrit` | Devanagari / Indic OK | Must match a cited traditional form — no invented lines |
| `transliteration` | **Latin only** | Must match the Sanskrit (IAST preferred) |
| `meaning` | **English / Latin only** | Faithful sense of the text — not vague AI filler |

Missing transliteration or meaning → **do not merge**.

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
