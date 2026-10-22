---
name: Pricing change
about: Change a rate, labour hour, material cost or review threshold
labels: pricing
---

**What's changing** (e.g. labour rate $120 → $130/hr)

**Why**

**Effective from**

The rates live in `lib/estimate/config.ts`. After changing them, update the expected totals in `tests/engine.test.ts` so CI confirms the new numbers.
