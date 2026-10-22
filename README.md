# PHAZED AI

**AI agents designed to ship.**

PHAZED AI builds AI agents, workforces, and execution systems for modern businesses. Specialized agents handle research, coding, review, validation, and deployment as one loop, so teams get from idea to product faster.

## What this repo includes

- A Next.js 15 + TypeScript landing page with a dark theme, animations, and a responsive layout
- An animated "workforce run" terminal in the hero
- Cards for the six agents, an execution-loop pipeline, a features section, and an early-access CTA
- [`docs/workforce.md`](docs/workforce.md), which describes the multi-agent architecture

## The workforce

| Agent | Role |
| --- | --- |
| **Orchestrator** | Breaks goals into tasks, routes them, and tracks progress |
| **Researcher** | Gathers context from code, docs, and data, and flags risks |
| **Builder** | Writes implementation plans and code |
| **Reviewer** | Checks correctness, security, and architecture |
| **QA** | Tests behavior, edge cases, and reliability |
| **Deploy** | Confirms production readiness and runs the release |

## Getting started

Requires Node.js 18.18 or newer.

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

### Production build

```bash
npm run build
npm run start
```

### Type check

```bash
npm run typecheck
```

## Project structure

```
app/
  layout.tsx    # Root layout and SEO metadata
  page.tsx      # Landing page (content arrays at the top of the file)
  globals.css   # Design tokens, components, and animations
docs/
  workforce.md  # Multi-agent architecture
```

## Customizing

- **Copy and content:** edit the `stats`, `agents`, `runLog`, and `features` arrays at the top of `app/page.tsx`.
- **Brand colors:** change the CSS variables in `:root` in `app/globals.css`.
- **Contact address:** the CTA button uses `mailto:hello@phazed.ai`. Change it to your real inbox before launch.

## Deploy

The fastest option is [Vercel](https://vercel.com/new): import the repo and it detects Next.js automatically. Any host that runs `next build` and `next start` also works.

## Roadmap

- [ ] `/workforces` page with animated architecture diagrams
- [ ] Pricing section
- [ ] Product demo video
- [ ] Waitlist form backed by a database
- [ ] Working agent orchestration backend

---

© PHAZED AI. Intelligence that moves work.
