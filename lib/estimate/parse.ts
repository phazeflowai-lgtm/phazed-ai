import type { DedicatedKind, ScanResult } from "./types";

const COUNT_KEYS = [
  "gpoAndSwitch",
  "lights",
  "fansAndExhaust",
  "dataOutlets",
  "smokeAlarms",
  "switchboards",
  "solar",
  "rcd",
] as const;
const KINDS: DedicatedKind[] = ["oven", "hot_water", "other"];

const num = (v: unknown) => (typeof v === "string" && v.trim() !== "" ? Number(v) : v);
const isNonNeg = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v) && v >= 0;

/** Validates the scan JSON posted by the vision agent. Returns the scan or a list of problems. */
export function parseScan(input: unknown): { scan: ScanResult } | { errors: string[] } {
  const errors: string[] = [];
  const b = (input ?? {}) as Record<string, any>;

  const contactId = typeof b.contactId === "string" ? b.contactId.trim() : "";
  if (!contactId) errors.push("contactId is required");

  const confidence = num(b.confidence);
  if (typeof confidence !== "number" || !Number.isFinite(confidence)) errors.push("confidence must be a number (0–100)");

  const totalPoints = num(b.totalPoints);
  if (!isNonNeg(totalPoints)) errors.push("totalPoints must be a number ≥ 0");

  const dpi = b.dpi === undefined || b.dpi === null || b.dpi === "" ? undefined : num(b.dpi);
  if (dpi !== undefined && !isNonNeg(dpi)) errors.push("dpi must be a number");

  const powerRunM = num(b.cable?.powerRunM ?? 0);
  const lightingRunM = num(b.cable?.lightingRunM ?? 0);
  if (!isNonNeg(powerRunM)) errors.push("cable.powerRunM must be a number ≥ 0");
  if (!isNonNeg(lightingRunM)) errors.push("cable.lightingRunM must be a number ≥ 0");

  const counts = {} as ScanResult["counts"];
  for (const k of COUNT_KEYS) {
    const v = num(b.counts?.[k] ?? 0);
    if (!isNonNeg(v)) errors.push(`counts.${k} must be a number ≥ 0`);
    else counts[k] = v;
  }

  const dedicated: ScanResult["dedicated"] = [];
  if (b.dedicated !== undefined && !Array.isArray(b.dedicated)) errors.push("dedicated must be an array");
  for (const [i, d] of (Array.isArray(b.dedicated) ? b.dedicated : []).entries()) {
    if (!KINDS.includes(d?.kind)) {
      errors.push(`dedicated[${i}].kind must be one of ${KINDS.join(", ")}`);
      continue;
    }
    const runM = d.runM === undefined || d.runM === null ? undefined : num(d.runM);
    if (runM !== undefined && !isNonNeg(runM)) errors.push(`dedicated[${i}].runM must be a number ≥ 0`);
    dedicated.push({ kind: d.kind, runM: runM as number | undefined });
  }

  if (errors.length) return { errors };

  return {
    scan: {
      contactId,
      jobAddress: typeof b.jobAddress === "string" ? b.jobAddress : undefined,
      jobType: typeof b.jobType === "string" ? b.jobType : undefined,
      confidence: confidence as number,
      dpi: dpi as number | undefined,
      totalPoints: totalPoints as number,
      cable: { powerRunM: powerRunM as number, lightingRunM: lightingRunM as number },
      dedicated,
      counts,
    },
  };
}
