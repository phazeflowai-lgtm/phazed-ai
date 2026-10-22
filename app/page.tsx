import type { CSSProperties } from "react";

const CONTACT_EMAIL = "phazeflowai@gmail.com";
const SAMPLE_MAILTO = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
  "Sample electrical estimate request",
)}&body=${encodeURIComponent(
  "Hi PHAZED team,\n\nI'd like a sample estimate.\n\nJob type (residential / commercial / multi-res):\nJob suburb:\nBlueprint attached (CAD-exported PDF, 200+ DPI):\n\nThanks,",
)}`;

// Figures from a real PHAZED run on a 4-bed new residential build (Gold Coast).
const stats = [
  { value: "98", label: "electrical points detected" },
  { value: "8+ hrs", label: "of manual takeoff saved" },
  { value: "$13.3k", label: "priced quote, ex GST" },
];

const agents = [
  {
    name: "Intake",
    icon: "⇣",
    glow: "rgba(56, 232, 255, 0.16)",
    color: "#38e8ff",
    summary: "Takes the job from your CRM form: job address, job type, and the blueprint file. If any of these are missing, the job stops before any work is done.",
    tags: ["CRM form", "PDF / image", "job details"],
  },
  {
    name: "Vision Scan",
    icon: "⌕",
    glow: "rgba(165, 180, 252, 0.16)",
    color: "#a5b4fc",
    summary: "Reads the plan's symbol legend against AS/NZS 1102, finds the scale, and counts every GPO, light, switch, and dedicated circuit room by room.",
    tags: ["AS/NZS 1102", "scale detection", "point count"],
  },
  {
    name: "Takeoff",
    icon: "⌗",
    glow: "rgba(139, 92, 246, 0.18)",
    color: "#a78bfa",
    summary: "Works out cable runs per room for each cable size (1.5, 2.5, 4.0, and 6.0 mm, plus Cat6), including drops, terminations, and 10% waste.",
    tags: ["cable metreage", "per-room runs", "waste factor"],
  },
  {
    name: "Pricing",
    icon: "$",
    glow: "rgba(250, 204, 21, 0.12)",
    color: "#facc15",
    summary: "Applies your labour rate and hours per point, adds the switchboard, RCDs, smoke alarms, and fittings, and gives a total ex GST.",
    tags: ["labour hours", "materials", "ex GST"],
  },
  {
    name: "Quality Gate",
    icon: "✓",
    glow: "rgba(244, 114, 182, 0.14)",
    color: "#f472b6",
    summary: "Gives every estimate a confidence score and runs sanity checks. Estimates that don't pass are sent to a person for review instead of going straight to the client.",
    tags: ["confidence score", "sanity limits", "audit log"],
  },
  {
    name: "Quote Delivery",
    icon: "↗",
    glow: "rgba(34, 211, 166, 0.16)",
    color: "#22d3a6",
    summary: "Emails a quote PDF with a line-by-line breakdown of points, cable, labour, and materials, ready for you to review and send.",
    tags: ["PDF quote", "full breakdown", "email"],
  },
];

const runLog = [
  { agent: "intake", color: "#38e8ff", msg: "blueprint received · new residential build · 3 sheets" },
  { agent: "vision", color: "#a5b4fc", msg: "AS/NZS 1102 legend matched · scale 1:100 · 98 points" },
  { agent: "takeoff", color: "#a78bfa", msg: "cable 822.14 m incl. 10% waste · 4 dedicated circuits" },
  { agent: "pricing", color: "#facc15", msg: "67.05 labour hrs · materials $5,248.12" },
  { agent: "quality", color: "#f472b6", msg: "confidence scored · sanity checks passed" },
  { agent: "quote", color: "#22d3a6", msg: "$13,294.12 ex GST · PDF quote sent", ok: true },
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
  { title: "Sanity limits", body: "Flags any estimate with more than 25 m of cable per point or a cost above $400 per point." },
  { title: "Blueprint quality", body: "Requires a CAD-exported PDF at 200+ DPI. If the file is missing or too low-res, the job stops and the client is asked for a better copy." },
  { title: "Full audit trail", body: "Every job is logged with its confidence score, DPI, scale, and status, so you can trace each number." },
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

export default function Home() {
  return (
    <>
      <div className="backdrop" aria-hidden />

      <header className="nav">
        <div className="container nav-inner">
          <a href="#" className="logo">
            <span className="logo-mark" aria-hidden />
            PHAZED AI
          </a>
          <nav className="nav-links" aria-label="Primary">
            <a href="#how">How it works</a>
            <a href="#detects">What it detects</a>
            <a href="#quality">Quality checks</a>
            <a href="#who">Who it&apos;s for</a>
          </nav>
          <a href={SAMPLE_MAILTO} className="btn btn-primary btn-sm">
            Free sample estimate
          </a>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container">
            <span className="pill">
              <span className="pill-dot" aria-hidden />
              Electrical estimation automation · Gold Coast, QLD
            </span>
            <h1>
              Blueprint to <span className="gradient-text">priced electrical quote.</span>
            </h1>
            <p>
              Upload a floor plan. PHAZED AI reads the electrical legend, counts every point, and calculates cable,
              labour, and materials. You get back a quote ex GST, ready to send, in hours instead of nights.
            </p>
            <div className="hero-ctas">
              <a href={SAMPLE_MAILTO} className="btn btn-primary">
                Get a free sample estimate →
              </a>
              <a href="#how" className="btn btn-ghost">
                See how it works
              </a>
            </div>

            <div className="stats">
              {stats.map((s) => (
                <div className="stat" key={s.label}>
                  <div className="stat-value gradient-text">{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>
            <p className="stats-note">Real figures from a single PHAZED run on a 4-bed new residential build.</p>

            <div className="terminal" role="img" aria-label="Example PHAZED AI estimate run">
              <div className="terminal-bar">
                <span />
                <span />
                <span />
                <b>phazed estimate --plan new-residential-build.pdf</b>
              </div>
              <div className="terminal-body">
                {runLog.map((line, i) => (
                  <div className="log-line" key={line.agent} style={{ animationDelay: `${0.9 + i * 0.45}s` }}>
                    <span className="log-agent" style={{ color: line.color }}>
                      [{line.agent}]
                    </span>
                    <span className={line.ok ? "log-ok" : undefined}>
                      {line.ok ? "✔ " : ""}
                      {line.msg}
                    </span>
                  </div>
                ))}
                <div className="log-line" style={{ animationDelay: `${0.9 + runLog.length * 0.45}s` }}>
                  <span className="cursor" aria-hidden />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="how">
          <div className="container">
            <span className="eyebrow">// How it works</span>
            <h2 className="section-title">Six AI agents. One finished estimate.</h2>
            <p className="section-lede">
              Each stage of a takeoff is handled by a specialist agent. Each one checks the work of the one before
              it, so problems are caught before a quote reaches the client.
            </p>

            <div className="agent-grid">
              {agents.map((a, i) => (
                <article className="card" key={a.name} style={{ "--glow": a.glow } as CSSProperties}>
                  <div className="card-head">
                    <div className="agent-icon" style={{ color: a.color }} aria-hidden>
                      {a.icon}
                    </div>
                    <span className="agent-step">0{i + 1}</span>
                  </div>
                  <h3>{a.name}</h3>
                  <p>{a.summary}</p>
                  <div className="tags">
                    {a.tags.map((t) => (
                      <span className="tag" key={t}>
                        {t}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>

            <div className="pipeline" aria-label="Estimating pipeline">
              {agents.map((a, i, arr) => (
                <span key={a.name} style={{ display: "contents" }}>
                  <span className="pipe-node">{a.name}</span>
                  {i < arr.length - 1 && <span className="pipe-link" aria-hidden />}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section id="detects">
          <div className="container">
            <span className="eyebrow">// What it detects</span>
            <h2 className="section-title">It reads plans the way an electrician does.</h2>
            <p className="section-lede">
              PHAZED reads standard AS/NZS 1102 symbols and plan legends, then counts every point room by room.
            </p>
            <div className="detect-grid">
              {detects.map((d) => (
                <div className="detect" key={d}>
                  <span className="detect-dot" aria-hidden />
                  {d}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="quality">
          <div className="container">
            <span className="eyebrow">// Quality checks</span>
            <h2 className="section-title">Accuracy you can trust before you send.</h2>
            <p className="section-lede">
              PHAZED doesn&apos;t guess. Every estimate is scored, checked against sanity limits, and logged. When
              it isn&apos;t sure, it asks a person to check.
            </p>

            <div className="gate-grid">
              {gates.map((g) => (
                <div className="card gate" key={g.title} style={{ "--glow": `${g.color}22` } as CSSProperties}>
                  <div className="gate-band" style={{ color: g.color }}>
                    {g.band}
                  </div>
                  <h3>{g.title}</h3>
                  <p>{g.body}</p>
                </div>
              ))}
            </div>

            <div className="feature-grid three">
              {checks.map((c, i) => (
                <div className="card" key={c.title}>
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
            <span className="eyebrow">// Who it&apos;s for</span>
            <h2 className="section-title">Built by a sparky, for the trade.</h2>
            <p className="section-lede">
              PHAZED was built on the Gold Coast by a licensed electrician who was tired of losing nights to manual
              takeoffs. The pricing logic follows how jobs are actually wired and quoted in Queensland.
            </p>
            <div className="feature-grid three">
              {audiences.map((a, i) => (
                <div className="card" key={a.title}>
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
            <div className="cta">
              <span className="eyebrow">// Free sample estimate</span>
              <h2 className="section-title">
                Send us a plan. <span className="gradient-text">Get a priced quote back.</span>
              </h2>
              <p className="section-lede">
                Email a floor plan from a current job, and we&apos;ll send back a full electrical estimate with the
                breakdown, free. A CAD-exported PDF at 200+ DPI gives the best results.
              </p>
              <div className="hero-ctas">
                <a href={SAMPLE_MAILTO} className="btn btn-primary">
                  Request a sample estimate →
                </a>
                <a href="#how" className="btn btn-ghost">
                  How it works
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
          <a href="#" className="logo">
            <span className="logo-mark" aria-hidden />
            PHAZED AI
          </a>
          <span>© {new Date().getFullYear()} PHAZED AI · Electrical estimation automation · Gold Coast, QLD</span>
        </div>
      </footer>
    </>
  );
}
