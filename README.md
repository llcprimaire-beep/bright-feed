# Bright Feed

Only good news, from all over the world. A calm, pastel, image-rich feed of 100% positive stories — acts of kindness, planet wins, science breakthroughs, and happy animals — curated automatically from dedicated good-news publications.

Every card links straight to the original article. Full stories are never republished.

## How it works

```
GitHub Actions (every 4h)
  └─ scripts/fetch-feeds.mjs
       ├─ fetch good-news RSS feeds (scripts/sources.mjs)
       ├─ dedupe: exact URL hash + near-duplicate titles (scripts/dedupe.mjs)
       ├─ images: feed media fields → first content <img> → og:image from article page
       └─ write data/items.json → commit → push
             └─ Vercel auto-deploys the static site
```

Sources: Good News Network, Positive News, Nice News, The Optimist Daily, Reasons to be Cheerful, Good Good Good, Upworthy (+ BrightVibes when their feed is valid XML).

## Local development

```bash
npm install
node scripts/fetch-feeds.mjs   # populate data/items.json
npm run dev                    # http://localhost:3000
```

## Operations

| What | Where |
|---|---|
| Change sources | `scripts/sources.mjs` |
| Cron frequency | `.github/workflows/fetch-news.yml` |
| Enable AdSense | Vercel env `NEXT_PUBLIC_ADSENSE_CLIENT_ID` = `ca-pub-...` |
| Canonical URL | Vercel env `NEXT_PUBLIC_SITE_URL` |

## Before applying for AdSense

1. Fill in bracketed `[placeholders]` in `src/app/about|privacy|terms/page.tsx`.
2. Let the site accumulate 2–4 weeks of content.
3. AdSense requires a custom domain (not *.vercel.app).
