export const dynamic = "force-dynamic";

/** GET /api/health — public uptime check. Shows which integrations are configured, never their values. */
export function GET() {
  return Response.json({
    ok: true,
    service: "phazed-ai",
    commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "local",
    configured: {
      apiKey: Boolean(process.env.PHAZED_API_KEY),
      ghl: Boolean(process.env.GHL_PRIVATE_TOKEN),
    },
  });
}
