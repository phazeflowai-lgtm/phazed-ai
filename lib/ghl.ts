// Minimal GoHighLevel (LeadConnector API v2) client.
// Needs GHL_PRIVATE_TOKEN: GHL → Settings → Private Integrations → create token
// with contacts.write scope. Without it, calls are skipped (not failed).

const BASE = "https://services.leadconnectorhq.com";

export type GhlResult = { skipped: true } | { ok: boolean; status: number };

async function ghl(path: string, body: unknown): Promise<GhlResult> {
  const token = process.env.GHL_PRIVATE_TOKEN;
  if (!token) return { skipped: true };
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Version: "2021-07-28",
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });
  return { ok: res.ok, status: res.status };
}

export const addContactTags = (contactId: string, tags: string[]) =>
  ghl(`/contacts/${encodeURIComponent(contactId)}/tags`, { tags });

export const addContactNote = (contactId: string, body: string) =>
  ghl(`/contacts/${encodeURIComponent(contactId)}/notes`, { body });
