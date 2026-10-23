import { describe, expect, it } from "vitest";
import { PLAN_H, PLAN_W, symbols } from "@/app/_site/plan";
import fixture from "./fixtures/new-residential-98pt.json";

const count = (kind: string) => symbols.filter((s) => s.kind === kind).length;

describe("landing page scan demo plan", () => {
  it("draws the same number of points as the real job", () => {
    expect(symbols.length).toBe(fixture.totalPoints);
  });

  it("matches the job's point mix", () => {
    const c = fixture.counts;
    expect(count("light")).toBe(c.lights);
    expect(count("gpo") + count("switch")).toBe(c.gpoAndSwitch);
    expect(count("fan")).toBe(c.fansAndExhaust);
    expect(count("data")).toBe(c.dataOutlets);
    expect(count("smoke")).toBe(c.smokeAlarms);
    expect(count("msb")).toBe(c.switchboards);
    expect(count("solar")).toBe(c.solar);
  });

  it("keeps every symbol inside the drawing", () => {
    for (const s of symbols) {
      expect(s.x).toBeGreaterThan(0);
      expect(s.x).toBeLessThan(PLAN_W);
      expect(s.y).toBeGreaterThan(0);
      expect(s.y).toBeLessThan(PLAN_H);
    }
  });
});
