# Switching it on (about 20 minutes)

## 1. Vercel: add two secrets
Vercel → phazed-ai → Settings → Environment Variables:

| Name | Value |
| --- | --- |
| `PHAZED_API_KEY` | any long random string, e.g. from https://www.random.org/strings/ or `openssl rand -hex 32` |
| `GHL_PRIVATE_TOKEN` | GHL → Settings → Private Integrations → Create → scopes **contacts.write** + **contacts.readonly** |

Then **Deployments → ⋯ → Redeploy**. Check https://phazed-ai.vercel.app/api/health shows `"apiKey": true, "ghl": true`.

## 2. GHL: intake webhook
Automation → Workflows → your blueprint-form workflow → add action **Webhook**:
- Method: POST
- URL: `https://phazed-ai.vercel.app/api/intake`
- Header: `x-phazed-key` = your `PHAZED_API_KEY`
- Custom data: `blueprint_url` = the form's file-upload field, `job_type` = the job type field, `job_address` = the address field

## 3. GHL: workflows that react to tags
Create one workflow per trigger **Contact Tag Added**:

| Tag | Do this |
| --- | --- |
| `phazed-hard-stop` | SMS + email the client asking for a CAD-exported PDF (200+ DPI); move to *Pending Review* |
| `phazed-intake-ok` | Webhook to your Gumloop agent (pass contact id + blueprint url) |
| `phazed-auto-approved` | Send the quote email to the client; move to *Quote Sent* |
| `phazed-quick-review` | Internal notification + task: "Quick review estimate" |
| `phazed-manual-audit` | Internal notification + task: "Manual audit" |
| `low-quality-blueprint` | (optional) ask the client for a better file |

## 4. Gumloop: send the scan to PHAZED instead of doing the maths
At the end of the agent, replace the pricing / email steps with one HTTP request:
- POST `https://phazed-ai.vercel.app/api/estimate`
- Header `x-phazed-key`
- Body: the scan JSON in `docs/architecture.md`

Turn off the Gmail trigger that watches `[PHAZED-BLUEPRINT]` emails. The webhook flow replaces it, and that trigger is what caused the alert loops.

## 5. Test it
Submit the form once with a real plan. You should see: intake note → Gumloop run → estimate note + one outcome tag on the contact.
