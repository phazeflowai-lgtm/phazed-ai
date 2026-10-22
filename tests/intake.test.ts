import { describe, expect, it } from "vitest";
import { isPhazedAlert, normaliseJobType, validateIntake } from "@/lib/estimate/intake";

const good = {
  contact_id: "abc123",
  full_name: "Sam Builder",
  email: "sam@example.com",
  job_type: "Residential (New Residential Build)",
  customData: { blueprint_url: "https://example.com/plan.pdf", job_address: "1 Example St, Gold Coast QLD" },
};

describe("validateIntake", () => {
  it("accepts a complete GHL submission (fields in body + customData)", () => {
    const r = validateIntake(good);
    expect(r.status).toBe("ready");
    if (r.status === "ready") {
      expect(r.job.blueprintUrl).toBe("https://example.com/plan.pdf");
      expect(r.job.jobType).toBe("residential");
      expect(r.job.jobAddress).toBe("1 Example St, Gold Coast QLD");
    }
  });

  it("hard-stops when the blueprint link is missing", () => {
    const r = validateIntake({ ...good, customData: {} });
    expect(r.status).toBe("hard_stop");
    if (r.status === "hard_stop") expect(r.missing).toContain("blueprintUrl");
  });

  it("treats unresolved {{merge fields}} as missing and says why", () => {
    const r = validateIntake({ contact_id: "abc123", full_name: "{{contact.full_name}}", email: "{{contact.email}}", blueprint_url: "MISSING" });
    expect(r.status).toBe("hard_stop");
    if (r.status === "hard_stop") {
      expect(r.missing).toEqual(["blueprintUrl", "client email or phone"]);
      expect(r.warnings.some((w) => w.includes("unresolved GHL merge field"))).toBe(true);
    }
  });

  it("rejects non-http blueprint links", () => {
    const r = validateIntake({ ...good, customData: { blueprint_url: "javascript:alert(1)" } });
    expect(r.status).toBe("hard_stop");
  });

  it("warns (but doesn't stop) on unmapped job types", () => {
    const r = validateIntake({ ...good, job_type: "estimate floor plan" });
    expect(r.status).toBe("ready");
    expect(r.warnings[0]).toContain("isn't Residential/Commercial/Industrial");
  });
});

describe("normaliseJobType", () => {
  it.each([
    ["New Residential Build", "residential"],
    ["Commercial fitout", "commercial"],
    ["Industrial warehouse", "industrial"],
    ["", "unknown"],
  ])("%s → %s", (input, out) => expect(normaliseJobType(input)).toBe(out));
});

describe("isPhazedAlert — stops the Gmail trigger re-ingesting its own alerts", () => {
  it.each([
    "[ALERT] Blueprint missing",
    "[PHAZED-BLUEPRINT] 🚨 HARD STOP — Missing Blueprint URL — ",
    "[PHAZED-BLUEPRINT]🔍 Manual Audit Required — ",
    "[PHAZED-BLUEPRINT]⚠️ Sanity Clamp Tripped — ",
    "[PHAZED-BLUEPRINT]⚡ Electrical Estimate Ready — ",
  ])("%s", (s) => expect(isPhazedAlert(s)).toBe(true));

  it("does not flag a real client submission", () => {
    expect(isPhazedAlert("New blueprint submission — 14 Example Ct")).toBe(false);
  });
});
