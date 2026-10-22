import { RATES } from "./config";
import type { Estimate, Line, ScanResult } from "./types";

export const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

function cableLine(label: string, rawM: number, rate: number): Line {
  const qty = round2(rawM * (1 + RATES.wasteFactor));
  return { label, qty, unit: "m", rate, amount: round2(qty * rate) };
}

function labourLine(label: string, qty: number, hoursEach: number): Line {
  return { label, qty, unit: "pt", rate: hoursEach, amount: round2(qty * hoursEach) };
}

/** Deterministic pricing: same scan in, same quote out. No AI arithmetic. */
export function priceEstimate(scan: ScanResult, rates = RATES): Estimate {
  const { cablePerMetre: c, defaultRunM, hoursPerPoint: h, materials: m } = rates;

  const runFor = (kind: string) =>
    scan.dedicated
      .filter((d) => d.kind === kind)
      .reduce((sum, d) => sum + (d.runM ?? defaultRunM.dedicated), 0);

  const cableLines: Line[] = [
    cableLine("Power 2.5mm", scan.cable.powerRunM, c.power),
    cableLine("Lighting 1.5mm", scan.cable.lightingRunM, c.lighting),
    cableLine("Oven/cooktop 6.0mm", runFor("oven"), c.oven),
    cableLine("Hot water 4.0mm", runFor("hot_water"), c.hotWater),
    cableLine("Other dedicated 2.5mm", runFor("other"), c.power),
    cableLine("Data/TV Cat6", scan.counts.dataOutlets * defaultRunM.data, c.data),
  ].filter((l) => l.qty > 0);

  const n = scan.counts;
  const labourLines: Line[] = [
    labourLine("GPOs & switches", n.gpoAndSwitch, h.gpoAndSwitch),
    labourLine("Lights", n.lights, h.lights),
    labourLine("Fans & exhausts", n.fansAndExhaust, h.fansAndExhaust),
    labourLine("Data outlets", n.dataOutlets, h.dataOutlets),
    labourLine("Smoke alarms", n.smokeAlarms, h.smokeAlarms),
    labourLine("Dedicated circuits", scan.dedicated.length, h.dedicated),
    labourLine("Switchboards", n.switchboards, h.switchboards),
    labourLine("Solar (panels + inverter)", n.solar, h.solar),
  ].filter((l) => l.qty > 0);

  const cableTotalM = round2(cableLines.reduce((s, l) => s + l.qty, 0));
  const cableCost = round2(cableLines.reduce((s, l) => s + l.amount, 0));
  const labourHours = round2(labourLines.reduce((s, l) => s + l.amount, 0));
  const labourCost = round2(labourHours * rates.labourRatePerHour);

  const materialLines: Line[] = [
    { label: "Cable (all sizes)", qty: 1, unit: "lot", rate: cableCost, amount: cableCost },
    { label: "RCD", qty: n.rcd, unit: "ea", rate: m.rcd, amount: round2(n.rcd * m.rcd) },
    { label: "Switchboard", qty: n.switchboards, unit: "ea", rate: m.switchboard, amount: round2(n.switchboards * m.switchboard) },
    { label: "Smoke alarms", qty: n.smokeAlarms, unit: "ea", rate: m.smokeAlarm, amount: round2(n.smokeAlarms * m.smokeAlarm) },
    { label: "Fittings", qty: scan.totalPoints, unit: "pt", rate: m.fittingPerPoint, amount: round2(scan.totalPoints * m.fittingPerPoint) },
  ].filter((l) => l.qty > 0 && l.amount > 0);

  const materialsCost = round2(materialLines.reduce((s, l) => s + l.amount, 0));
  const subtotal = round2(labourCost + materialsCost);
  const minimumApplied = subtotal < rates.minimumCharge;
  const totalExGst = minimumApplied ? rates.minimumCharge : subtotal;
  const gst = round2(totalExGst * rates.gstRate);
  const points = Math.max(scan.totalPoints, 1);

  return {
    cableLines,
    labourLines,
    materialLines,
    cableTotalM,
    cableCost,
    labourHours,
    labourCost,
    materialsCost,
    subtotal,
    minimumApplied,
    totalExGst,
    gst,
    totalIncGst: round2(totalExGst + gst),
    costPerPoint: round2(totalExGst / points),
    cableMPerPoint: round2(cableTotalM / points),
  };
}

const money = (n: number) => `$${n.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/** Plain-text breakdown, written to the GHL contact as a note. */
export function formatBreakdown(scan: ScanResult, e: Estimate): string {
  const rows = (lines: Line[]) => lines.map((l) => `  • ${l.label}: ${l.qty} ${l.unit} × ${l.rate} = ${money(l.amount)}`);
  const hourRows = (lines: Line[]) => lines.map((l) => `  • ${l.label}: ${l.qty} pts × ${l.rate} hr = ${l.amount} hrs`);
  return [
    `⚡ PHAZED estimate — ${scan.jobAddress || "address not supplied"}`,
    `Points: ${scan.totalPoints} · Confidence: ${scan.confidence}%`,
    "",
    `Cable (${e.cableTotalM} m incl. ${RATES.wasteFactor * 100}% waste):`,
    ...rows(e.cableLines),
    "",
    `Labour (${e.labourHours} hrs @ ${money(RATES.labourRatePerHour)}/hr = ${money(e.labourCost)}):`,
    ...hourRows(e.labourLines),
    "",
    `Materials (${money(e.materialsCost)}):`,
    ...rows(e.materialLines),
    "",
    e.minimumApplied ? `Minimum charge applied (${money(RATES.minimumCharge)}).` : "",
    `TOTAL EX GST: ${money(e.totalExGst)}`,
    `GST: ${money(e.gst)} · TOTAL INC GST: ${money(e.totalIncGst)}`,
  ]
    .filter((l, i, a) => !(l === "" && a[i - 1] === ""))
    .join("\n");
}
