import { timingSafeEqual } from "node:crypto";

/**
 * Checks the shared API key sent by GHL / Gumloop in the `x-phazed-key` header
 * (or `Authorization: Bearer <key>`). Returns an error Response, or null if OK.
 * If PHAZED_API_KEY isn't set the API stays locked.
 */
export function requireApiKey(req: Request): Response | null {
  const expected = process.env.PHAZED_API_KEY;
  if (!expected) {
    return Response.json({ error: "PHAZED_API_KEY is not configured on the server." }, { status: 503 });
  }
  const sent =
    req.headers.get("x-phazed-key") ?? req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  const a = Buffer.from(sent);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return Response.json({ error: "Unauthorised" }, { status: 401 });
  }
  return null;
}
