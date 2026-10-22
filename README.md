# PHAZED AI

**Blueprint to priced electrical quote, automatically.**

PHAZED AI is electrical estimation automation for contractors, builders, and estimators. Upload a floor plan, and AI agents read the AS/NZS 1102 legend, count every point, and calculate cable, labour, and materials. You get back a quality-checked quote, priced ex GST.

Built on the Gold Coast, QLD.

## What this repo is

The **engine room** behind PHAZED's GoHighLevel setup. GHL handles clients, forms and pipelines. This repo handles the estimating logic, and GitHub keeps it tested and running.

| Part | What it does |
| --- | --- |
| `lib/estimate/` | Pricing rules, the deterministic estimate engine, review gates, and intake validation |
| `app/api/intake` | GHL webhook: checks a blueprint submission before anything runs |
| `app/api/estimate` | Gumloop posts the scan here and gets back a priced estimate with one review outcome. Tags and a note are written to GHL |
| `app/api/health` | Uptime check |
| `.github/workflows/ci.yml` | Every push re-runs the real 98-point job; wrong maths can't deploy |
| `.github/workflows/uptime.yml` | Daily ping; opens an Issue if the API is down |
| `app/page.tsx` | Public landing page at https://phazed-ai.vercel.app |

- **How it fits together:** [`docs/architecture.md`](docs/architecture.md)
- **Switching it on (Vercel + GHL + Gumloop):** [`docs/setup.md`](docs/setup.md)
- **Pricing rules explained:** [`docs/estimating-pipeline.md`](docs/estimating-pipeline.md)

## Changing prices

Edit `lib/estimate/config.ts`, then update the expected totals in `tests/engine.test.ts`, and push. CI confirms the maths, and Vercel deploys automatically.

## Run locally

Requires Node.js 18.18 or newer.

```bash
npm install
npm run dev     # http://localhost:3000
npm run ci      # typecheck + tests + production build
```

---

© PHAZED AI · Electrical estimation automation · Gold Coast, QLD
