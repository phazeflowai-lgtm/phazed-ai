// PHAZED pricing rules. Values match the live quotes PHAZED has been sending
// (e.g. the 98-point new residential build priced at $13,294.12 ex GST).
// Change a rate here, push, and every estimate after the deploy uses it.

export const RATES = {
  labourRatePerHour: 120,
  wasteFactor: 0.1,
  minimumCharge: 850,
  gstRate: 0.1,

  cablePerMetre: {
    power: 2.8, // 2.5mm TPS — GPOs and "other" dedicated circuits
    lighting: 1.8, // 1.5mm TPS
    oven: 5.5, // 6.0mm — oven / cooktop
    hotWater: 4.1, // 4.0mm — hot water service
    data: 1.2, // Cat6
  },

  // Home-run lengths used when the scan can't place a circuit in a room.
  defaultRunM: {
    dedicated: 15,
    data: 8,
  },

  hoursPerPoint: {
    gpoAndSwitch: 0.5,
    lights: 0.6,
    fansAndExhaust: 0.75,
    dataOutlets: 0.5,
    smokeAlarms: 0.75,
    dedicated: 1.5,
    switchboards: 4,
    solar: 1,
  },

  materials: {
    rcd: 85,
    switchboard: 450,
    smokeAlarm: 120,
    fittingPerPoint: 25,
  },
} as const;

export const GATES = {
  autoApproveMin: 85, // confidence % at or above → auto-approved
  quickReviewMin: 70, // 70–84 → quick review; below → manual audit
  minDpi: 200,
  maxCableMPerPoint: 25,
  maxCostPerPoint: 400,
} as const;

// Tags written to the GHL contact. GHL workflows trigger on these.
export const TAGS = {
  ready: "phazed-intake-ok",
  hardStop: "phazed-hard-stop",
  autoApproved: "phazed-auto-approved",
  quickReview: "phazed-quick-review",
  manualAudit: "phazed-manual-audit",
  sanityClamp: "phazed-sanity-clamp",
  lowQualityBlueprint: "low-quality-blueprint",
} as const;
