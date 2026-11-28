# Prarthana

A Sanatana Dharma prayer companion. **Everything on the site is Latin script** — transliteration to read aloud, English meaning to understand. Favorites stay on your device.

Live site: https://prarthana.aprameyakannan.com

See [DATA.md](./DATA.md). Devanagari may exist in the data files for sourcing; it is not published in the UI.

```bash
npm run enrich:prayer -- --sanskrit "ॐ नमः शिवाय"
npm run enrich:prayer -- --sanskrit "ॐ नमः शिवाय" --translate   # needs GEMINI_API_KEY
npm run validate:prayers
```

## Develop

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
