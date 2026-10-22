import { describe, expect, it } from "vitest";
import { priceEstimate } from "@/lib/estimate/engine";
import { gateEstimate } from "@/lib/estimate/gate";
import type { ScanResult } from "@/lib/estimate/types";
import fixture from "./fixtures/new-residential-98pt.json";

const base = { ...(fixture as ScanResult), dpi: 300 };
const gate = (over: Partial<ScanResult>) => {
  const scan = { ...base, ...over };
  return gateEstimate(scan, priceEstimate(scan));
};

describe("gateEstimate — exactly one outcome per job", () => {
  it("88% → auto-approved (was wrongly labelled 'below 70%')", () => {
    const g = gate({ confidence: 88 });
    expect(g.outcome).toBe("auto_approved");
    expect(g.tags).toEqual(["phazed-auto-approved"]);
  });

  it("72% → quick review (was wrongly sent as 'Auto-Approved')", () => {
    expect(gate({ confidence: 72 }).outcome).toBe("quick_review");
  });

  it("boundaries: 85 auto, 84 review, 70 review, 69 audit", () => {
    expect(gate({ confidence: 85 }).outcome).toBe("auto_approved");
    expect(gate({ confidence: 84 }).outcome).toBe("quick_review");
    expect(gate({ confidence: 70 }).outcome).toBe("quick_review");
    expect(gate({ confidence: 69 }).outcome).toBe("manual_audit");
  });

  it("low DPI blocks auto-approval and tags low-quality-blueprint", () => {
    const g = gate({ confidence: 95, dpi: 130 });
    expect(g.outcome).toBe("quick_review");
    expect(g.tags).toContain("low-quality-blueprint");
  });

  it("sanity clamp: >25 m cable per point → manual audit", () => {
    const g = gate({ confidence: 95, cable: { powerRunM: 5000, lightingRunM: 0 } });
    expect(g.outcome).toBe("manual_audit");
    expect(g.tags).toContain("phazed-sanity-clamp");
  });

  it("invalid confidence → manual audit", () => {
    expect(gate({ confidence: 150 }).outcome).toBe("manual_audit");
  });

  it("the real 98-point job (72%, 130 DPI) → quick review only", () => {
    const g = gate({ confidence: 72, dpi: 130 });
    expect(g.outcome).toBe("quick_review");
    expect(g.tags).toEqual(["phazed-quick-review", "low-quality-blueprint"]);
  });
});
