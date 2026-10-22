import { requireApiKey } from "@/lib/auth";
import { validateIntake } from "@/lib/estimate/intake";
import { addContactNote, addContactTags } from "@/lib/ghl";

export const dynamic = "force-dynamic";

/**
 * POST /api/intake
 * Point the GHL workflow "Webhook" action here when a blueprint form is submitted.
 * Checks the submission BEFORE any scan runs. On a hard stop it tags the contact
 * so a GHL workflow can ask the client for the missing info — no email loops.
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

  const result = validateIntake(body);
  const contactId = result.status === "ready" ? result.job.contactId : result.contactId;

  let ghl = null;
  if (contactId) {
    const lines =
      result.status === "ready"
        ? ["✅ PHAZED intake OK — blueprint received, ready to scan.", ...result.warnings]
        : ["🚨 PHAZED hard stop — missing: " + result.missing.join(", "), ...result.warnings];
    ghl = await Promise.all([addContactTags(contactId, result.tags), addContactNote(contactId, lines.join("\n"))]);
  }

  return Response.json({ ...result, ghl }, { status: result.status === "ready" ? 200 : 422 });
}
