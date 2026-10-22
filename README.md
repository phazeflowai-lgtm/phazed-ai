# PHAZED AI

**Blueprint to priced electrical quote, automatically.**

PHAZED AI is electrical estimation automation for contractors, builders, and estimators. Upload a floor plan, and AI agents read the AS/NZS 1102 legend, count every point, and calculate cable, labour, and materials. You get back a quality-checked quote, priced ex GST.

Built on the Gold Coast, QLD.

## This repo

The marketing site for PHAZED AI, built with Next.js 15 and TypeScript.

- Hero with real figures from a sample run and an animated estimate log
- **How it works:** the six-agent estimating pipeline
- **What it detects:** the electrical point types PHAZED reads from plans
- **Quality checks:** confidence bands, sanity limits, blueprint requirements
- **Who it's for:** contractors, builders and developers, estimating teams
- A "free sample estimate" call to action that opens a pre-filled email

Pipeline details: [`docs/estimating-pipeline.md`](docs/estimating-pipeline.md)

## The pipeline

| Agent | Job |
| --- | --- |
| **Intake** | Pulls the job and blueprint from the CRM; stops if anything is missing |
| **Vision Scan** | Reads the AS/NZS 1102 legend and scale, then counts points room by room |
| **Takeoff** | Calculates cable runs per size, with drops, terminations, and 10% waste |
| **Pricing** | Calculates labour hours × rate plus materials, ex GST |
| **Quality Gate** | Scores confidence, applies sanity limits, sends unsure jobs to a person |
| **Quote Delivery** | Emails the PDF quote with the full breakdown |

## Run locally

Requires Node.js 18.18 or newer.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm run start   # production
npm run typecheck
```

## Editing content

All copy lives in arrays at the top of `app/page.tsx` (`stats`, `agents`, `runLog`, `detects`, `gates`, `checks`, `audiences`). The contact email is `CONTACT_EMAIL` in the same file. Brand colours are CSS variables in `app/globals.css`.

## Deploy

Import the repo at [vercel.com/new](https://vercel.com/new). Vercel detects Next.js automatically. Then point your domain at it.

---

© PHAZED AI · Electrical estimation automation · Gold Coast, QLD
