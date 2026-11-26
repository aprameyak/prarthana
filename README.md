# Prarthana

A Sanatana Dharma prayer companion — mantras and verses with Sanskrit, **Latin transliteration**, and **English meaning** for every prayer. Favorites stay on your device.

See [DATA.md](./DATA.md) for catalog rules. Every prayer must have Latin transliteration + English meaning (not Devanagari alone).

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

## Deploy (Cloudflare Workers)

```bash
STATIC_EXPORT=1 npm run build
npx wrangler deploy
```

Custom domain pattern: `https://prarthana.aprameyakannan.com`
