import type { CSSProperties } from "react";
import Motion from "./_site/Motion";
import PlanScan from "./_site/PlanScan";

const CONTACT_EMAIL = "phazeflowai@gmail.com";
const SAMPLE_MAILTO = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
  "Sample electrical estimate request",
)}&body=${encodeURIComponent(
  "Hi PHAZED team,\n\nI'd like a sample estimate.\n\nJob type (residential / commercial / multi-res):\nJob suburb:\nBlueprint attached (CAD-exported PDF, 200+ DPI):\n\nThanks,",
)}`;

// Cinematic media generated with Higgsfield (Cinema Studio 2.5 stills, Kling 3.0 loop).
const MEDIA = "https://d8j0ntlcm91z4.cloudfront.net/user_3L5IGIjYZIPTSRoBWTWENtj7DaZ";
const HERO_POSTER = `${MEDIA}/hf_20261023_070544_966f8e4b-805e-4006-97d6-2a1107c95f23.png`;
const HERO_VIDEO = `${MEDIA}/hf_20261023_070726_e4413191-ef59-47e0-a605-f07639849654.mp4`;
const BOARD_IMAGE = `${MEDIA}/hf_20261023_070544_c0e528b7-9c0b-40af-a2b2-f622b4ab0e95.png`;

// Figures from a real PHAZED run on a 4-bed new residential build (Gold Coast).
const stats = [
  { count: 98, label: "electrical points detected" },
  { count: 8.17, decimals: 2, suffix: " hrs", label: "of manual takeoff saved" },
  { count: 13294.12, decimals: 2, prefix: "$", label: "priced quote, ex GST" },
];

const agents = [
  {
    name: "Intake",
    color: "#38e8ff",
    summary:
      "Takes the job from your CRM form: job address, job type, and the blueprint file. If any of these are missing, the job stops before any work is done.",
    tags: ["CRM form", "PDF / image", "job details"],
  },
  {
    name: "Vision Scan",
    color: "#a5b4fc",
    summary:
      "Reads the plan's symbol legend against AS/NZS 1102, finds the scale, and counts every GPO, light, switch, and dedicated circuit room by room.",
    tags: ["AS/NZS 1102", "scale detection", "point count"],
  },
  {
    name: "Takeoff",
    color: "#a78bfa",
    summary:
      "Works out cable runs per room for each cable size (1.5, 2.5, 4.0, and 6.0 mm, plus Cat6), including drops, terminations, and 10% waste.",
    tags: ["cable metreage", "per-room runs", "waste factor"],
  },
  {
    name: "Pricing",
    color: "#facc15",
    summary:
      "Applies your labour rate and hours per point, adds the switchboard, RCDs, smoke alarms, and fittings, and gives a total ex GST.",
    tags: ["labour hours", "materials", "ex GST"],
  },
  {
    name: "Quality Gate",
    color: "#f472b6",
    summary:
      "Gives every estimate a confidence score and runs sanity checks. Estimates that don't pass are sent to a person for review instead of going straight to the client.",
    tags: ["confidence score", "sanity limits", "audit log"],
  },
  {
    name: "Quote Delivery",
    color: "#22d3a6",
    summary:
      "Emails a quote PDF with a line-by-line breakdown of points, cable, labour, and materials, ready for you to review and send.",
    tags: ["PDF quote", "full breakdown", "email"],
  },
];

const detects = [
  "GPOs & weatherproof GPOs",
  "15A outlets",
  "Switches, dimmers & two-way",
  "LED downlights & sensor lights",
  "Ceiling fans & exhaust fans",
  "Smoke alarms",
  "RCD / RCBO protection",
  "Main switchboard (MSB)",
  "Oven, cooktop & hot water circuits",
  "Solar panels & inverters",
  "EV chargers",
  "HVAC & data / TV (Cat6)",
];

const gates = [
  {
    band: "85%+",
    title: "Auto-approved",
    body: "High-confidence scans go straight to a finished quote.",
    color: "#22d3a6",
  },
  {
    band: "70–84%",
    title: "Quick review",
    body: "The quote is generated, and you get a short checklist to confirm before it goes out.",
    color: "#facc15",
  },
  {
    band: "< 70%",
    title: "Manual audit",
    body: "Low-confidence scans are sent to a person for review. Nothing is sent to the client.",
    color: "#f472b6",
  },
];

const checks = [
  {
    title: "Sanity limits",
    body: "Flags any estimate with more than 25 m of cable per point or a cost above $400 per point.",
  },
  {
    title: "Blueprint quality",
    body: "Requires a CAD-exported PDF at 200+ DPI. If the file is missing or too low-res, the job stops and the client is asked for a better copy.",
  },
  {
    title: "Full audit trail",
    body: "Every job is logged with its confidence score, DPI, scale, and status, so you can trace each number.",
  },
];

const audiences = [
  {
    title: "Electrical contractors",
    body: "Stop spending your nights on takeoffs. Quote more jobs, faster, at the same rates every time.",
  },
  {
    title: "Builders & developers",
    body: "Get electrical scope and pricing early in preconstruction for residential, multi-res, and commercial builds.",
  },
  {
    title: "Estimators & preconstruction teams",
    body: "Use PHAZED as a back-office estimating partner when the pipeline is bigger than your team.",
  },
];

const headline = ["Blueprint", "to"];
const headlineAccent = ["priced", "electrical", "quote."];

function Logo() {
  return (
    <a href="#" className="logo">
      <svg className="logo-mark" viewBox="0 0 32 32" aria-hidden>
        <path d="M18 2 L6 18 H15 L13 30 L26 12 H17 Z" />
      </svg>
      PHAZED<span>AI</span>
    </a>
  );
}

export default function Home() {
  return (
    <>
      <Motion />
      <div className="grain" aria-hidden />

      <header className="nav">
        <div className="container nav-inner">
          <Logo />
          <nav className="nav-links" aria-label="Primary">
            <a href="#scan">Live scan</a>
            <a href="#how">How it works</a>
            <a href="#quality">Quality checks</a>
            <a href="#who">Who it&apos;s for</a>
          </nav>
          <a href={SAMPLE_MAILTO} className="btn btn-primary btn-sm">
            Free sample estimate
          </a>
        </div>
      </header>

      <main>
        <section className="hero" data-scroll="exit" data-spot>
          <div className="hero-media" aria-hidden>
            <video autoPlay muted loop playsInline preload="metadata" poster={HERO_POSTER}>
              <source src={HERO_VIDEO} type="video/mp4" />
            </video>
          </div>
          <div className="hero-shade" aria-hidden />
          <div className="hero-spot" aria-hidden />

          <div className="container hero-inner">
            <span className="pill">
              <span className="pill-dot" aria-hidden />
              Electrical estimation automation · Gold Coast, QLD
            </span>
            <h1 aria-label="Blueprint to priced electrical quote.">
              {headline.map((w, i) => (
                <span className="word" key={w} style={{ "--i": i } as CSSProperties} aria-hidden>
                  {w}{" "}
                </span>
              ))}
              <br />
              {headlineAccent.map((w, i) => (
                <span
                  className="word gradient-text"
                  key={w}
                  style={{ "--i": i + headline.length } as CSSProperties}
                  aria-hidden
                >
                  {w}{" "}
                </span>
              ))}
            </h1>
            <p className="hero-lede">
              Upload a floor plan. PHAZED AI reads the electrical legend, counts every point, and calculates cable,
              labour, and materials. You get back a quote ex GST, ready to send, in hours instead of nights.
            </p>
            <div className="hero-ctas">
              <a href={SAMPLE_MAILTO} className="btn btn-primary">
                Get a free sample estimate <span aria-hidden>→</span>
              </a>
              <a href="#scan" className="btn btn-ghost">
                Watch it scan a plan
              </a>
            </div>

            <div className="stats" data-reveal>
              {stats.map((s) => (
                <div className="stat" key={s.label}>
                  <div
                    className="stat-value"
                    data-count={s.count}
                    data-decimals={s.decimals}
                    data-prefix={s.prefix}
                    data-suffix={s.suffix}
                  >
                    0
                  </div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>
            <p className="stats-note">Real figures from a single PHAZED run on a 4-bed new residential build.</p>
          </div>

          <a href="#scan" className="scroll-cue" aria-label="Scroll to the live scan">
            <span />
          </a>
        </section>

        <div className="marquee" aria-label="What PHAZED detects">
          <div className="marquee-track">
            {[0, 1].map((k) => (
              <ul key={k} aria-hidden={k === 1}>
                {detects.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            ))}
          </div>
        </div>

        <section id="scan" className="scan-section">
          <div className="container">
            <div data-reveal>
              <span className="eyebrow">Live scan</span>
              <h2 className="section-title">
                Watch a real job price itself.
              </h2>
              <p className="section-lede">
                This is the 4-bed build from the figures above. The scan reads each symbol on the plan, and the
                takeoff and price add up as it goes, finishing at the quote that was sent to the client.
              </p>
            </div>
            <div className="scan-tilt" data-scroll data-reveal>
              <PlanScan />
            </div>
          </div>
        </section>

        <section id="how">
          <div className="container">
            <div data-reveal>
              <span className="eyebrow">How it works</span>
              <h2 className="section-title">Six AI agents. One finished estimate.</h2>
              <p className="section-lede">
                Each stage of a takeoff is handled by a specialist agent. Each one checks the work of the one
                before it, so problems are caught before a quote reaches the client.
              </p>
            </div>

            <div className="steps" data-steps>
              <div className="steps-rail" aria-hidden>
                <div className="steps-num" data-step-num>
                  01
                </div>
                <div className="steps-name" data-step-name>
                  Intake
                </div>
                <div className="steps-track">
                  <span />
                </div>
                <div className="steps-of">of 06</div>
              </div>
              <ol className="steps-list">
                {agents.map((a, i) => (
                  <li
                    className="step"
                    key={a.name}
                    data-step
                    data-name={a.name}
                    data-color={a.color}
                    style={{ "--c": a.color } as CSSProperties}
                  >
                    <span className="step-index">0{i + 1}</span>
                    <h3>{a.name}</h3>
                    <p>{a.summary}</p>
                    <div className="tags">
                      {a.tags.map((t) => (
                        <span className="tag" key={t}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section id="quality">
          <div className="container">
            <div data-reveal>
              <span className="eyebrow">Quality checks</span>
              <h2 className="section-title">Accuracy you can trust before you send.</h2>
              <p className="section-lede">
                PHAZED doesn&apos;t guess. Every estimate is scored, checked against sanity limits, and logged.
                When it isn&apos;t sure, it asks a person to check.
              </p>
            </div>

            <div className="gate-layout">
              <div className="gauge" data-gauge data-reveal role="img" aria-label="Confidence gauge">
                <svg viewBox="0 0 200 116" aria-hidden>
                  <path className="gauge-band" d="M20 100 A80 80 0 0 1 144.97 33.83" stroke="#f472b6" />
                  <path className="gauge-band" d="M147.02 35.28 A80 80 0 0 1 170.1 61.46" stroke="#facc15" />
                  <path className="gauge-band" d="M171.28 63.68 A80 80 0 0 1 180 100" stroke="#22d3a6" />
                  <g className="gauge-needle">
                    <path d="M100 100 L100 30" />
                    <circle cx="100" cy="100" r="7" />
                  </g>
                </svg>
                <div className="gauge-value" data-gauge-value>
                  93%
                </div>
                <div className="gauge-label">scan confidence</div>
              </div>

              <div className="gate-grid">
                {gates.map((g) => (
                  <div
                    className="card gate"
                    key={g.title}
                    data-gate
                    style={{ "--glow": `${g.color}33`, "--c": g.color } as CSSProperties}
                  >
                    <div className="gate-band">{g.band}</div>
                    <div>
                      <h3>{g.title}</h3>
                      <p>{g.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="feature-grid three">
              {checks.map((c, i) => (
                <div className="card" key={c.title} data-reveal style={{ "--d": i } as CSSProperties}>
                  <div className="feature-num">0{i + 1}</div>
                  <h3>{c.title}</h3>
                  <p>{c.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="who">
          <div className="container">
            <div className="story">
              <figure className="story-media" data-scroll data-reveal>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={BOARD_IMAGE} alt="A new residential switchboard with rows of RCBOs" loading="lazy" />
              </figure>
              <div data-reveal>
                <span className="eyebrow">Who it&apos;s for</span>
                <h2 className="section-title">Built by a sparky, for the trade.</h2>
                <p className="section-lede">
                  PHAZED was built on the Gold Coast by a licensed electrician who was tired of losing nights to
                  manual takeoffs. The pricing logic follows how jobs are actually wired and quoted in Queensland.
                </p>
              </div>
            </div>
            <div className="feature-grid three">
              {audiences.map((a, i) => (
                <div className="card" key={a.title} data-reveal style={{ "--d": i } as CSSProperties}>
                  <div className="feature-num">0{i + 1}</div>
                  <h3>{a.title}</h3>
                  <p>{a.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact">
          <div className="container">
            <div className="cta" data-reveal data-spot>
              <span className="eyebrow">Free sample estimate</span>
              <h2 className="section-title">
                Send us a plan. <span className="gradient-text">Get a priced quote back.</span>
              </h2>
              <p className="section-lede">
                Email a floor plan from a current job, and we&apos;ll send back a full electrical estimate with the
                breakdown, free. A CAD-exported PDF at 200+ DPI gives the best results.
              </p>
              <div className="hero-ctas">
                <a href={SAMPLE_MAILTO} className="btn btn-primary">
                  Request a sample estimate <span aria-hidden>→</span>
                </a>
                <a href="#scan" className="btn btn-ghost">
                  See the live scan
                </a>
              </div>
              <p className="cta-email">
                or email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <Logo />
          <span>© {new Date().getFullYear()} PHAZED AI · Electrical estimation automation · Gold Coast, QLD</span>
        </div>
      </footer>
    </>
  );
}
