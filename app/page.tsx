import type { CSSProperties } from "react";

const stats = [
  { value: "10x", label: "faster execution" },
  { value: "24/7", label: "AI workforce coverage" },
  { value: "6", label: "core executing agents" },
];

const agents = [
  {
    name: "Orchestrator",
    icon: "◎",
    glow: "rgba(56, 232, 255, 0.16)",
    color: "#38e8ff",
    summary: "Turns a goal into a plan, assigns work to specialists, and keeps the whole loop moving.",
    tags: ["planning", "routing", "progress"],
  },
  {
    name: "Researcher",
    icon: "⌕",
    glow: "rgba(165, 180, 252, 0.16)",
    color: "#a5b4fc",
    summary: "Reads code, docs, and data, then reports back with context, risks, and dependencies.",
    tags: ["context", "analysis", "risk"],
  },
  {
    name: "Builder",
    icon: "⌘",
    glow: "rgba(139, 92, 246, 0.18)",
    color: "#a78bfa",
    summary: "Writes implementation plans and production code, then patches systems and interfaces.",
    tags: ["code", "integration", "patching"],
  },
  {
    name: "Reviewer",
    icon: "✓",
    glow: "rgba(244, 114, 182, 0.14)",
    color: "#f472b6",
    summary: "Checks correctness, security, and architecture, and flags edge cases before anything ships.",
    tags: ["security", "architecture", "quality"],
  },
  {
    name: "QA",
    icon: "◈",
    glow: "rgba(250, 204, 21, 0.12)",
    color: "#facc15",
    summary: "Tests real behavior and edge cases, and confirms reliability before a release goes out.",
    tags: ["testing", "validation", "reliability"],
  },
  {
    name: "Deploy",
    icon: "↗",
    glow: "rgba(34, 211, 166, 0.16)",
    color: "#22d3a6",
    summary: "Confirms production readiness, runs the release pipeline, and reports on the result.",
    tags: ["release", "monitoring", "rollout"],
  },
];

const runLog = [
  { agent: "orchestrator", color: "#38e8ff", msg: "goal received → \"automate content publishing\"" },
  { agent: "researcher", color: "#a5b4fc", msg: "scanned 214 files, 3 APIs · 2 risks flagged" },
  { agent: "builder", color: "#a78bfa", msg: "generated workflow engine · +1,284 −96 lines" },
  { agent: "reviewer", color: "#f472b6", msg: "security + architecture pass · 1 fix applied" },
  { agent: "qa", color: "#facc15", msg: "48/48 checks passing" },
  { agent: "deploy", color: "#22d3a6", msg: "shipped to production", ok: true },
];

const features = [
  {
    title: "Execution, not chat",
    body: "Each agent owns one stage of delivery, so a goal turns into shipped work instead of a long conversation.",
  },
  {
    title: "Built-in quality gates",
    body: "Review and QA are part of the loop. Nothing reaches production without passing both.",
  },
  {
    title: "Works with your stack",
    body: "Agents work inside your repos, docs, and pipelines. You don't have to rebuild around a new platform.",
  },
  {
    title: "Transparent by default",
    body: "Every step is logged and reviewable, so you can see why something happened.",
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
            <a href="#workforce">Workforce</a>
            <a href="#loop">Execution loop</a>
            <a href="#why">Why PHAZED</a>
          </nav>
          <a href="#contact" className="btn btn-primary btn-sm">
            Get early access
          </a>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container">
            <span className="pill">
              <span className="pill-dot" aria-hidden />
              AI workforces are now in private beta
            </span>
            <h1>
              AI agents <span className="gradient-text">designed to ship.</span>
            </h1>
            <p>
              PHAZED AI builds AI workforces and execution systems. Specialized agents research, build, review,
              test, and deploy together, taking your team from prompt to product.
            </p>
            <div className="hero-ctas">
              <a href="#contact" className="btn btn-primary">
                Build with PHAZED →
              </a>
              <a href="#workforce" className="btn btn-ghost">
                Meet the workforce
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

            <div className="terminal" role="img" aria-label="Example PHAZED AI workforce run log">
              <div className="terminal-bar">
                <span />
                <span />
                <span />
                <b>phazed run --goal &quot;automate content publishing&quot;</b>
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

        <section id="workforce">
          <div className="container">
            <span className="eyebrow">// The workforce</span>
            <h2 className="section-title">Six specialists, one execution layer.</h2>
            <p className="section-lede">
              PHAZED splits the work across focused agents instead of relying on one general assistant. Each agent
              is accountable for its own stage of delivery.
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
          </div>
        </section>

        <section id="loop">
          <div className="container">
            <span className="eyebrow">// The execution loop</span>
            <h2 className="section-title">From objective to production, on repeat.</h2>
            <p className="section-lede">
              Every task runs through the same loop: define, research, build, review, test, deploy. The process is
              repeatable, so the results are too.
            </p>

            <div className="pipeline" aria-label="Execution loop">
              {["Objective", ...agents.slice(1).map((a) => a.name)].map((step, i, arr) => (
                <span key={step} style={{ display: "contents" }}>
                  <span className="pipe-node">{step}</span>
                  {i < arr.length - 1 && <span className="pipe-link" aria-hidden />}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section id="why">
          <div className="container">
            <span className="eyebrow">// Why PHAZED</span>
            <h2 className="section-title">Intelligence that moves work.</h2>
            <div className="feature-grid">
              {features.map((f, i) => (
                <div className="card" key={f.title}>
                  <div className="feature-num">0{i + 1}</div>
                  <h3>{f.title}</h3>
                  <p>{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact">
          <div className="container">
            <div className="cta">
              <span className="eyebrow">// Early access</span>
              <h2 className="section-title">
                Design your <span className="gradient-text">execution layer</span> with AI.
              </h2>
              <p className="section-lede">
                We&apos;re onboarding a small group of teams to deploy their first AI workforce. Tell us what you want
                to ship.
              </p>
              <div className="hero-ctas">
                <a href="mailto:hello@phazed.ai?subject=PHAZED%20AI%20early%20access" className="btn btn-primary">
                  Request access →
                </a>
                <a href="#workforce" className="btn btn-ghost">
                  See how it works
                </a>
              </div>
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
          <span>© {new Date().getFullYear()} PHAZED AI. The workforce behind your next wave of automation.</span>
        </div>
      </footer>
    </>
  );
}
