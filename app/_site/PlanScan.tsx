"use client";

import { useEffect, useRef } from "react";
import { PLAN_H, PLAN_W, rooms, runs, symbols, type PlanSymbol } from "./plan";

// Final figures from the real 98-point job (see tests/engine.test.ts).
const TOTAL_CABLE_M = 822.14;
const TOTAL_EX_GST = 13294.12;
const SCAN_MS = 4200;
const CYCLE_MS = 8200;

const log = [
  { at: 0, agent: "intake", color: "var(--c-intake)", msg: "plan received · new residential · 300 DPI" },
  { at: 0.12, agent: "vision", color: "var(--c-vision)", msg: "AS/NZS 1102 legend matched · scale 1:100" },
  { at: 0.55, agent: "takeoff", color: "var(--c-takeoff)", msg: "cable runs measured · 10% waste added" },
  { at: 0.92, agent: "pricing", color: "var(--c-pricing)", msg: "67.05 labour hrs · materials $5,248.12" },
  { at: 1, agent: "quality", color: "var(--c-quality)", msg: "sanity checks passed · one outcome" },
  { at: 1, agent: "quote", color: "var(--c-quote)", msg: "quote ready · ex GST", ok: true },
];

const money = (n: number) =>
  n.toLocaleString("en-AU", { style: "currency", currency: "AUD", minimumFractionDigits: 2 });

function Glyph({ s }: { s: PlanSymbol }) {
  switch (s.kind) {
    case "light":
      return (
        <>
          <circle r="7" />
          <path d="M-5 -5 L5 5 M5 -5 L-5 5" />
        </>
      );
    case "gpo":
      return (
        <>
          <rect x="-7" y="-4" width="14" height="8" rx="1.5" />
          <path d="M-3 -1 V1 M3 -1 V1" />
        </>
      );
    case "switch":
      return (
        <>
          <circle r="3" />
          <path d="M2 -2 L7 -7" />
        </>
      );
    case "fan":
      return (
        <>
          <circle r="10" />
          <path d="M0 0 C4 -8 9 -4 0 0 C-4 8 -9 4 0 0 M0 0 C8 4 4 9 0 0 C-8 -4 -4 -9 0 0" />
        </>
      );
    case "data":
      return <path d="M0 -7 L7 5 H-7 Z" />;
    case "smoke":
      return (
        <>
          <circle r="8" />
          <text y="3.5" textAnchor="middle">S</text>
        </>
      );
    case "msb":
      return (
        <>
          <rect x="-16" y="-10" width="32" height="20" />
          <path d="M-16 10 L-4 -10 M-6 10 L6 -10 M4 10 L16 -10" />
        </>
      );
    case "solar":
      return (
        <>
          <rect x="-22" y="-12" width="44" height="24" />
          <path d="M-11 -12 V12 M0 -12 V12 M11 -12 V12 M-22 0 H22" />
        </>
      );
    case "dedicated":
      return (
        <>
          <rect x="-12" y="-9" width="24" height="18" rx="2" />
          <text y="3.5" textAnchor="middle">{s.label}</text>
        </>
      );
  }
}

export default function PlanScan() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const syms = Array.from(el.querySelectorAll<SVGGElement>("[data-sym]"));
    const lines = Array.from(el.querySelectorAll<HTMLElement>("[data-log]"));
    const beam = el.querySelector<SVGGElement>("[data-beam]")!;
    const ptsOut = el.querySelector<HTMLElement>("[data-out='pts']")!;
    const cableOut = el.querySelector<HTMLElement>("[data-out='cable']")!;
    const priceOut = el.querySelector<HTMLElement>("[data-out='price']")!;
    const bar = el.querySelector<HTMLElement>("[data-out='bar']")!;

    const render = (progress: number, lit: number) => {
      const f = lit / syms.length;
      ptsOut.textContent = String(lit);
      cableOut.textContent = `${(TOTAL_CABLE_M * f).toFixed(2)} m`;
      priceOut.textContent = money(TOTAL_EX_GST * f);
      bar.style.transform = `scaleX(${f})`;
      beam.style.transform = `translateX(${progress * PLAN_W}px)`;
      el.classList.toggle("is-done", lit === syms.length);
      lines.forEach((l) => l.classList.toggle("is-on", progress >= Number(l.dataset.log)));
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      syms.forEach((s) => s.classList.add("is-lit"));
      render(1, syms.length);
      return;
    }

    let raf = 0;
    let start = 0;
    let lit = 0;
    let cycle = 0;
    let visible = false;

    const tick = (now: number) => {
      if (!start) start = now;
      const elapsed = now - start;
      const t = elapsed % CYCLE_MS;
      const progress = Math.min(1, t / SCAN_MS);
      if (Math.floor(elapsed / CYCLE_MS) !== cycle) {
        cycle = Math.floor(elapsed / CYCLE_MS);
        syms.forEach((s) => s.classList.remove("is-lit"));
        lit = 0;
      }
      const beamX = progress * PLAN_W;
      // Symbols are sorted by x, so light them in order as the beam passes.
      while (lit < syms.length && Number(syms[lit].dataset.x) <= beamX) {
        syms[lit].classList.add("is-lit");
        lit++;
      }
      render(progress, lit);
      if (visible) raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        cancelAnimationFrame(raf);
        if (visible) {
          start = 0;
          cycle = 0;
          syms.forEach((s) => s.classList.remove("is-lit"));
          lit = 0;
          raf = requestAnimationFrame(tick);
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="scan" ref={root}>
      <div className="scan-stage">
        <div className="scan-chrome">
          <span className="scan-dot" aria-hidden />
          <b>new-residential-build.pdf</b>
          <span className="scan-meta">sheet E-01 · 1:100</span>
        </div>
        <svg
          className="plan"
          viewBox={`0 0 ${PLAN_W} ${PLAN_H}`}
          role="img"
          aria-label="Electrical floor plan being scanned. 98 points detected."
        >
          <defs>
            <linearGradient id="beam" x1="0" x2="1">
              <stop offset="0" stopColor="#38e8ff" stopOpacity="0" />
              <stop offset="0.85" stopColor="#38e8ff" stopOpacity="0.18" />
              <stop offset="1" stopColor="#ffffff" stopOpacity="0.9" />
            </linearGradient>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M20 0 H0 V20" fill="none" stroke="currentColor" strokeOpacity="0.07" />
            </pattern>
          </defs>
          <rect width={PLAN_W} height={PLAN_H} fill="url(#grid)" />
          <g className="walls">
            {rooms.map((r) => (
              <g key={r.name}>
                <rect x={r.x} y={r.y} width={r.w} height={r.h} />
                <text x={r.x + 10} y={r.y + 15}>
                  {r.name}
                </text>
              </g>
            ))}
            <text x="20" y="568" className="roof-label">
              ROOF · PV ARRAY
            </text>
          </g>
          <g className="runs">
            {runs.map((d) => (
              <path key={d} d={d} pathLength={1} />
            ))}
          </g>
          <g className="syms">
            {symbols.map((s, i) => (
              <g
                key={i}
                data-sym
                data-x={s.x}
                className={`sym sym-${s.kind}`}
                transform={`translate(${s.x} ${s.y})`}
              >
                <Glyph s={s} />
              </g>
            ))}
          </g>
          <g data-beam className="beam">
            <rect x="-140" y="0" width="140" height={PLAN_H} fill="url(#beam)" />
            <rect x="-1" y="0" width="2" height={PLAN_H} fill="#fff" />
          </g>
        </svg>
      </div>

      <aside className="scan-panel" aria-live="off">
        <div className="readout">
          <div>
            <span className="readout-label">Points detected</span>
            <span className="readout-value" data-out="pts">
              0
            </span>
          </div>
          <div>
            <span className="readout-label">Cable incl. waste</span>
            <span className="readout-value sm" data-out="cable">
              0.00 m
            </span>
          </div>
        </div>
        <div className="readout-price">
          <span className="readout-label">Quote, ex GST</span>
          <span className="readout-value lg" data-out="price">
            $0.00
          </span>
          <div className="meter">
            <span data-out="bar" />
          </div>
        </div>
        <ol className="scan-log">
          {log.map((l) => (
            <li key={l.agent} data-log={l.at}>
              <b style={{ color: l.color }}>{l.agent}</b>
              <span className={l.ok ? "ok" : undefined}>
                {l.ok ? "✔ " : ""}
                {l.msg}
              </span>
            </li>
          ))}
        </ol>
      </aside>
    </div>
  );
}
