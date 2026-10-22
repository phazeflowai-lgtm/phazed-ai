# PHAZED AI — project notes for Claude

## Business
PHAZED AI = electrical estimation automation, Gold Coast QLD (owner: phazeflowai@gmail.com).
Blueprint in → AS/NZS 1102 vision scan → cable/labour/materials takeoff → quote ex GST.
Customers: electrical contractors, builders/developers, estimators (SEQ focus).

## Architecture (see docs/architecture.md)
- **GoHighLevel** is the front end and CRM. Do NOT build a separate client-facing app/site that duplicates GHL.
- **Gumloop** agent does the vision scan only.
- **This repo** (deployed on Vercel at https://phazed-ai.vercel.app) is the engine:
  - `lib/estimate/config.ts`: all rates and review thresholds (single source of truth)
  - `lib/estimate/engine.ts`: deterministic pricing
  - `lib/estimate/gate.ts`: exactly one outcome per job (auto_approved / quick_review / manual_audit)
  - `lib/estimate/intake.ts`: validates GHL webhooks, detects unresolved `{{merge fields}}`
  - `lib/ghl.ts`: writes tags + notes to GHL contacts (LeadConnector API v2)
  - `app/api/{intake,estimate,health}`: endpoints
- `app/page.tsx` is a marketing landing page. Secondary; GHL hosts the real funnel.

## Rules
- Any pricing change: update `config.ts` AND the expected numbers in `tests/engine.test.ts`.
- The 98-point fixture must still price at $13,294.12 ex GST at current rates.
- Run `npm run ci` (typecheck + tests + build) before pushing. CI runs the same on GitHub.
- Never put API keys in the repo; they live in Vercel env vars (`.env.example` lists them).
- Australian spelling, prices ex GST.
