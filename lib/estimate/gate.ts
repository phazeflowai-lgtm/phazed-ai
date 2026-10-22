import { GATES, TAGS } from "./config";
import type { Estimate, GateResult, Outcome, ScanResult } from "./types";

const SEVERITY: Outcome[] = ["auto_approved", "quick_review", "manual_audit", "hard_stop"];
const worst = (a: Outcome, b: Outcome) => (SEVERITY.indexOf(a) >= SEVERITY.indexOf(b) ? a : b);

const OUTCOME_TAG: Record<Outcome, string> = {
  auto_approved: TAGS.autoApproved,
  quick_review: TAGS.quickReview,
  manual_audit: TAGS.manualAudit,
  hard_stop: TAGS.hardStop,
};

/**
 * Decides exactly ONE outcome per estimate. Previously a single job could fire
 * both "Quick Review" and "Manual Audit", and a 72% scan was labelled
 * "Auto-Approved". Here the bands are exclusive and the worst check wins.
 */
export function gateEstimate(scan: ScanResult, estimate: Estimate): GateResult {
  const reasons: string[] = [];
  const extraTags: string[] = [];
  let outcome: Outcome = "auto_approved";

  const conf = scan.confidence;
  if (!Number.isFinite(conf) || conf < 0 || conf > 100) {
    outcome = worst(outcome, "manual_audit");
    reasons.push(`Confidence score invalid (${conf}).`);
  } else if (conf < GATES.quickReviewMin) {
    outcome = worst(outcome, "manual_audit");
    reasons.push(`Confidence ${conf}% is below ${GATES.quickReviewMin}%.`);
  } else if (conf < GATES.autoApproveMin) {
    outcome = worst(outcome, "quick_review");
    reasons.push(`Confidence ${conf}% is in the ${GATES.quickReviewMin}–${GATES.autoApproveMin - 1}% review band.`);
  }

  if (scan.dpi !== undefined && scan.dpi < GATES.minDpi) {
    outcome = worst(outcome, "quick_review");
    extraTags.push(TAGS.lowQualityBlueprint);
    reasons.push(`Blueprint is ${scan.dpi} DPI (needs ${GATES.minDpi}+). Request a CAD-exported PDF.`);
  }

  if (scan.totalPoints <= 0) {
    outcome = worst(outcome, "manual_audit");
    reasons.push("No electrical points detected.");
  }

  const clamps: string[] = [];
  if (estimate.cableMPerPoint > GATES.maxCableMPerPoint) {
    clamps.push(`cable ${estimate.cableMPerPoint} m/pt > ${GATES.maxCableMPerPoint} m/pt`);
  }
  if (estimate.costPerPoint > GATES.maxCostPerPoint) {
    clamps.push(`cost $${estimate.costPerPoint}/pt > $${GATES.maxCostPerPoint}/pt`);
  }
  if (clamps.length) {
    outcome = worst(outcome, "manual_audit");
    extraTags.push(TAGS.sanityClamp);
    reasons.push(`Sanity clamp tripped: ${clamps.join("; ")}.`);
  }

  if (outcome === "auto_approved") reasons.push(`Confidence ${conf}% and all checks passed.`);

  return { outcome, reasons, tags: [OUTCOME_TAG[outcome], ...extraTags] };
}
