# Prayer data rules

The catalog is the product. Every entry must be readable without knowing Devanagari.

## Required for every prayer

| Field | Script | Rule |
|-------|--------|------|
| `sanskrit` | Devanagari / Indic OK | Original text |
| `transliteration` | **Latin only** | How to pronounce it (IAST or clear Roman) |
| `meaning` | **Latin / English only** | What it means, plain language |

An entry with Sanskrit but no Latin transliteration or meaning is **incomplete** — do not merge it.

## Also collect

- `deities[]`, `occasions[]`, `festivals[]`, `kind`
- Prefer accurate short meanings over poetic fluff
- Long works (Chalisa, Ashtakam): one entry per verse/section later, each with its own transliteration + meaning

## Validate

```bash
npm run validate:prayers
```
