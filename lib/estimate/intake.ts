import { TAGS } from "./config";
import type { JobType } from "./types";

export interface IntakeJob {
  contactId: string;
  fullName?: string;
  email?: string;
  phone?: string;
  company?: string;
  jobAddress?: string;
  jobType: JobType;
  jobTypeRaw?: string;
  blueprintUrl: string;
}

export type IntakeResult =
  | { status: "ready"; job: IntakeJob; warnings: string[]; tags: string[] }
  | { status: "hard_stop"; contactId?: string; missing: string[]; warnings: string[]; tags: string[] };

const UNRESOLVED = /\{\{[^}]*\}\}/;

/** First non-empty, resolved string among the given keys (GHL sends both snake_case and camelCase). */
function pick(body: Record<string, unknown>, keys: string[], warnings: string[]): string | undefined {
  const sources = [body, (body.customData ?? {}) as Record<string, unknown>, (body.contact ?? {}) as Record<string, unknown>];
  for (const src of sources) {
    for (const k of keys) {
      const v = src[k];
      if (typeof v !== "string" && typeof v !== "number") continue;
      const s = String(v).trim();
      if (!s || s.toUpperCase() === "MISSING" || s.toLowerCase() === "null") continue;
      if (UNRESOLVED.test(s)) {
        warnings.push(`Field "${k}" arrived as an unresolved GHL merge field (${s}). Fix the custom value in the GHL workflow webhook.`);
        continue;
      }
      return s;
    }
  }
  return undefined;
}

export function normaliseJobType(raw?: string): JobType {
  const s = (raw ?? "").toLowerCase();
  // Most specific first: "warehouse" contains "house".
  if (s.includes("industr") || s.includes("warehouse") || s.includes("factory")) return "industrial";
  if (s.includes("commerc") || s.includes("fitout") || s.includes("retail") || s.includes("office")) return "commercial";
  if (s.includes("resid") || /\bhouse\b/.test(s) || s.includes("dwelling")) return "residential";
  return "unknown";
}

const isHttpUrl = (s?: string) => {
  if (!s) return false;
  try {
    const u = new URL(s);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
};

/** Validates a GHL workflow webhook before any scan is attempted. */
export function validateIntake(body: unknown): IntakeResult {
  const warnings: string[] = [];
  if (!body || typeof body !== "object") {
    return { status: "hard_stop", missing: ["request body"], warnings, tags: [TAGS.hardStop] };
  }
  const b = body as Record<string, unknown>;

  const contactId = pick(b, ["contactId", "contact_id", "id"], warnings);
  const blueprintUrl = pick(b, ["blueprintUrl", "blueprint_url", "Blueprint URL", "blueprint"], warnings);
  const email = pick(b, ["email", "client_email"], warnings);
  const phone = pick(b, ["phone"], warnings);
  const jobTypeRaw = pick(b, ["jobType", "job_type", "Job Type"], warnings);
  const jobType = normaliseJobType(jobTypeRaw);

  const missing: string[] = [];
  if (!contactId) missing.push("contactId");
  if (!blueprintUrl) missing.push("blueprintUrl");
  else if (!isHttpUrl(blueprintUrl)) missing.push("blueprintUrl (not a valid link)");
  if (!email && !phone) missing.push("client email or phone");

  if (jobType === "unknown") {
    warnings.push(`Job type "${jobTypeRaw ?? ""}" isn't Residential/Commercial/Industrial — map it in the GHL form.`);
  }

  if (missing.length) {
    return { status: "hard_stop", contactId, missing, warnings, tags: [TAGS.hardStop] };
  }

  return {
    status: "ready",
    warnings,
    tags: [TAGS.ready],
    job: {
      contactId: contactId!,
      blueprintUrl: blueprintUrl!,
      email,
      phone,
      fullName: pick(b, ["full_name", "fullName", "name"], warnings),
      company: pick(b, ["company_name", "company", "companyName"], warnings),
      jobAddress: pick(b, ["jobAddress", "job_address", "address1", "address", "full_address"], warnings),
      jobType,
      jobTypeRaw,
    },
  };
}

/** True for PHAZED's own alert emails — Gmail triggers must skip these or they loop. */
export function isPhazedAlert(subject: string): boolean {
  return /\[ALERT\]/i.test(subject) || /HARD STOP|Manual Audit Required|Quick Review Needed|Sanity Clamp|Estimate Ready/i.test(subject);
}
