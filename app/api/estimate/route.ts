import { requireApiKey } from "@/lib/auth";
import { formatBreakdown, priceEstimate } from "@/lib/estimate/engine";
import { gateEstimate } from "@/lib/estimate/gate";
import { parseScan } from "@/lib/estimate/parse";
import { addContactNote, addContactTags } from "@/lib/ghl";

export const dynamic = "force-dynamic";

/**
 * POST /api/estimate
 * Called by the vision agent (Gumloop) with what it found on the blueprint.
 * Returns the priced estimate and ONE review outcome, and writes tags + a
 * breakdown note to the GHL contact so GHL workflows take it from there.
 */
export async function POST(req: Request) {
  const denied = requireApiKey(req);
  if (denied) return denied;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Body must be JSON" }, { status: 400 });
  }

  const parsed = parseScan(body);
  if ("errors" in parsed) return Response.json({ error: "Invalid scan", details: parsed.errors }, { status: 422 });

  const { scan } = parsed;
  const estimate = priceEstimate(scan);
  const gate = gateEstimate(scan, estimate);
  const breakdown = formatBreakdown(scan, estimate);

  const [tags, note] = await Promise.all([
    addContactTags(scan.contactId, gate.tags),
    addContactNote(scan.contactId, `${breakdown}\n\nReview: ${gate.outcome.replace("_", " ")}\n${gate.reasons.join("\n")}`),
  ]);

  return Response.json({
    contactId: scan.contactId,
    outcome: gate.outcome,
    reasons: gate.reasons,
    tags: gate.tags,
    totalExGst: estimate.totalExGst,
    estimate,
    breakdown,
    ghl: { tags, note },
  });
}
