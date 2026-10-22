# PHAZED Business Architecture

GoHighLevel stays the front of house. GitHub is the engine room. Each tool does one job.

```
 CLIENT                    GHL (front of house)                 GITHUB → VERCEL (engine room)
 ──────                    ────────────────────                 ─────────────────────────────
 Fills blueprint form ──►  Contact created
                           Workflow: "Blueprint submitted"
                             └─ Webhook ───────────────────────►  POST /api/intake
                                                                    • checks blueprint link, email/phone
                                                                    • catches {{unresolved}} merge fields
                           ◄─ tag: phazed-intake-ok / hard-stop ─   • writes note + tag to contact
                           Workflow on "phazed-hard-stop":
                             └─ SMS/email client for a 200+ DPI PDF

                           Workflow on "phazed-intake-ok":
                             └─ Webhook ──► GUMLOOP (vision scan)
                                            reads AS/NZS 1102 legend,
                                            counts points, measures runs
                                              └─ POST ─────────────►  POST /api/estimate
                                                                    • prices with lib/estimate/config.ts
                                                                    • ONE outcome: auto / quick review / audit
                           ◄─ tag + breakdown note ─────────────    • writes note + tag to contact
                           Workflow on "phazed-auto-approved":
                             └─ send quote to client, move pipeline stage
                           Workflow on "phazed-quick-review" / "phazed-manual-audit":
                             └─ internal notification to Kade, task created

 GITHUB (always on)
   • CI: every change re-runs the real 98-point job; wrong maths can't deploy
   • Uptime check: daily ping, opens an Issue if the API is down
   • Dependabot: keeps dependencies patched
   • Issues: "Estimate looked wrong" / "Pricing change" templates = audit trail
```

## Why the maths lives in GitHub, not in the AI

The audit log showed the AI agent reporting figures it couldn't verify ("claimed relay figures not verified: 98 pts / $13,402.62"). Now the AI only does what AI is good at (reading the plan). The pricing is plain code with tests, so the same scan always gives the same quote, and every rate change is versioned in git history.

## Bugs this fixes

| Problem seen in Gmail / audit log | Fix |
| --- | --- |
| "Confidence 88% (below 70%)", and one job firing both Quick Review and Manual Audit | `gateEstimate` returns exactly one outcome; boundaries are tested |
| A 72% scan emailed as "Auto-Approved" | 70–84% is now always Quick Review |
| `{{contact.full_name}}` arriving unresolved, blank emails | `/api/intake` detects unresolved merge fields and names the field to fix |
| Alerts re-triggering the agent ~6× on the same job | Flow is webhook + tags, not Gmail triggers. `isPhazedAlert()` is there if you keep a Gmail trigger |
| Low-DPI scans auto-approved | Under 200 DPI can never be auto-approved; tagged `low-quality-blueprint` |

## API reference

All POST endpoints need the header `x-phazed-key: <PHAZED_API_KEY>`.

### `GET /api/health`
Public. `{ ok, commit, configured: { apiKey, ghl } }`

### `POST /api/intake`
Body: the standard GHL workflow webhook payload. Reads `contact_id`, `email`, `phone`, `full_name`, `job_type`, and `blueprint_url` (top level or under `customData`).
Returns `200 { status: "ready", job }` or `422 { status: "hard_stop", missing, warnings }`.

### `POST /api/estimate`
Body (sent by Gumloop after the scan):
```json
{
  "contactId": "GHL contact id",
  "jobAddress": "…", "jobType": "New Residential Build",
  "confidence": 88, "dpi": 300, "totalPoints": 98,
  "cable": { "powerRunM": 400.0, "lightingRunM": 257.8 },
  "dedicated": [{ "kind": "oven", "runM": 14.0 }, { "kind": "hot_water", "runM": 13.6 }, { "kind": "other" }],
  "counts": { "gpoAndSwitch": 46, "lights": 18, "fansAndExhaust": 5, "dataOutlets": 4,
              "smokeAlarms": 2, "switchboards": 1, "solar": 16, "rcd": 1 }
}
```
Returns `{ outcome, reasons, tags, totalExGst, estimate, breakdown }`.

`powerRunM` / `lightingRunM` are raw metres summed across rooms (distance + drop + termination per point), before waste. The API adds the 10% waste.
