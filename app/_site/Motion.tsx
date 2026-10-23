"use client";

import { useEffect } from "react";

// One small client runtime for the whole page, driven by data attributes so
// page.tsx stays a server component:
//   data-reveal          fades/lifts in when it enters the viewport
//   data-count="98"      counts up when revealed (data-prefix / data-suffix / data-decimals)
//   data-scroll          gets --p (0 → 1) as it scrolls through the viewport
//   data-scroll="exit"   gets --p (0 → 1) as it scrolls off the top (for the hero)
//   data-steps           sticky "six agents" rail; children carry data-step
//   data-gauge           confidence gauge that cycles through the three outcomes
//   data-spot            cursor spotlight (--mx / --my)
export default function Motion() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups: (() => void)[] = [];

    // Reveals + count-ups
    const countUp = (el: HTMLElement) => {
      const target = Number(el.dataset.count);
      const decimals = Number(el.dataset.decimals ?? 0);
      const fmt = (n: number) =>
        `${el.dataset.prefix ?? ""}${n.toLocaleString("en-AU", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })}${el.dataset.suffix ?? ""}`;
      if (reduced) {
        el.textContent = fmt(target);
        return;
      }
      const t0 = performance.now();
      const dur = 1600;
      const step = (now: number) => {
        const k = Math.min(1, (now - t0) / dur);
        el.textContent = fmt(target * (1 - Math.pow(1 - k, 4)));
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const revealIo = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          el.classList.add("is-in");
          el.querySelectorAll<HTMLElement>("[data-count]").forEach(countUp);
          if (el.dataset.count) countUp(el);
          revealIo.unobserve(el);
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -6% 0px" },
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => revealIo.observe(el));
    cleanups.push(() => revealIo.disconnect());

    // Scroll-linked progress for camera-style moves (dolly, crane, parallax)
    const scrollEls = Array.from(document.querySelectorAll<HTMLElement>("[data-scroll]"));
    if (!reduced && scrollEls.length) {
      let ticking = false;
      const update = () => {
        ticking = false;
        const vh = window.innerHeight;
        for (const el of scrollEls) {
          const r = el.getBoundingClientRect();
          const raw = el.dataset.scroll === "exit" ? -r.top / r.height : (vh - r.top) / (vh + r.height);
          const p = Math.min(1, Math.max(0, raw));
          el.style.setProperty("--p", p.toFixed(4));
        }
      };
      const onScroll = () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
      };
      update();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      cleanups.push(() => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      });
    }

    // Sticky agent steps
    document.querySelectorAll<HTMLElement>("[data-steps]").forEach((wrap) => {
      const steps = Array.from(wrap.querySelectorAll<HTMLElement>("[data-step]"));
      const num = wrap.querySelector<HTMLElement>("[data-step-num]");
      const name = wrap.querySelector<HTMLElement>("[data-step-name]");
      const activate = (i: number) => {
        steps.forEach((s, j) => s.classList.toggle("is-active", j === i));
        wrap.style.setProperty("--step", String((i + 1) / steps.length));
        wrap.style.setProperty("--step-color", steps[i].dataset.color ?? "var(--accent)");
        if (num) num.textContent = String(i + 1).padStart(2, "0");
        if (name) name.textContent = steps[i].dataset.name ?? "";
      };
      activate(0);
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) activate(steps.indexOf(e.target as HTMLElement));
          }
        },
        { rootMargin: "-45% 0px -45% 0px" },
      );
      steps.forEach((s) => io.observe(s));
      cleanups.push(() => io.disconnect());
    });

    // Confidence gauge: sweep through auto-approved → quick review → manual audit
    document.querySelectorAll<HTMLElement>("[data-gauge]").forEach((g) => {
      const readings = [93, 78, 61];
      const cards = Array.from(document.querySelectorAll<HTMLElement>("[data-gate]"));
      const value = g.querySelector<HTMLElement>("[data-gauge-value]");
      let i = 0;
      let timer = 0;
      const show = () => {
        const v = readings[i];
        g.style.setProperty("--angle", `${-90 + (v / 100) * 180}deg`);
        if (value) value.textContent = `${v}%`;
        cards.forEach((c, j) => c.classList.toggle("is-active", j === i));
        i = (i + 1) % readings.length;
      };
      const io = new IntersectionObserver(([e]) => {
        window.clearInterval(timer);
        if (e.isIntersecting) {
          show();
          if (!reduced) timer = window.setInterval(show, 2600);
        }
      });
      io.observe(g);
      cleanups.push(() => {
        io.disconnect();
        window.clearInterval(timer);
      });
    });

    // Cursor spotlight
    if (!reduced && window.matchMedia("(pointer: fine)").matches) {
      document.querySelectorAll<HTMLElement>("[data-spot]").forEach((el) => {
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          el.style.setProperty("--mx", `${e.clientX - r.left}px`);
          el.style.setProperty("--my", `${e.clientY - r.top}px`);
        };
        el.addEventListener("pointermove", move);
        cleanups.push(() => el.removeEventListener("pointermove", move));
      });
    }

    return () => cleanups.forEach((c) => c());
  }, []);

  return null;
}
