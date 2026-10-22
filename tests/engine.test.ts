import { describe, expect, it } from "vitest";
import { priceEstimate } from "@/lib/estimate/engine";
import { parseScan } from "@/lib/estimate/parse";
import type { ScanResult } from "@/lib/estimate/types";
import fixture from "./fixtures/new-residential-98pt.json";

const scan = fixture as ScanResult;

describe("priceEstimate — real 98-point new residential job", () => {
  const e = priceEstimate(scan);

  it("matches the cable takeoff from the live quote", () => {
    expect(e.cableTotalM).toBe(822.14);
    expect(e.cableCost).toBe(2023.12);
  });

  it("matches labour", () => {
    expect(e.labourHours).toBe(67.05);
    expect(e.labourCost).toBe(8046);
  });

  it("matches materials and the total ex GST", () => {
    expect(e.materialsCost).toBe(5248.12);
    expect(e.totalExGst).toBe(13294.12);
    expect(e.minimumApplied).toBe(false);
    expect(e.gst).toBe(1329.41);
  });
});

describe("priceEstimate — small jobs", () => {
  it("applies the $850 minimum charge", () => {
    const e = priceEstimate({
      ...scan,
      totalPoints: 2,
      cable: { powerRunM: 10, lightingRunM: 0 },
      dedicated: [],
      counts: { gpoAndSwitch: 2, lights: 0, fansAndExhaust: 0, dataOutlets: 0, smokeAlarms: 0, switchboards: 0, solar: 0, rcd: 0 },
    });
    expect(e.minimumApplied).toBe(true);
    expect(e.totalExGst).toBe(850);
  });
});

describe("parseScan", () => {
  it("accepts the fixture", () => {
    expect("scan" in parseScan(fixture)).toBe(true);
  });

  it("rejects missing contactId and bad numbers", () => {
    const r = parseScan({ ...fixture, contactId: "", confidence: "abc", counts: { lights: -1 } });
    expect("errors" in r && r.errors.length).toBeGreaterThanOrEqual(3);
  });

  it("coerces numeric strings (GHL/Gumloop often send strings)", () => {
    const r = parseScan({ ...fixture, confidence: "88", totalPoints: "98" });
    expect("scan" in r && r.scan.confidence).toBe(88);
  });
});
