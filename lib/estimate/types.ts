export type JobType = "residential" | "commercial" | "industrial" | "unknown";

export type DedicatedKind = "oven" | "hot_water" | "other";

/** What the vision scan (Gumloop / AI) found on the blueprint. */
export interface ScanResult {
  contactId: string;
  jobAddress?: string;
  jobType?: string;
  /** 0–100 */
  confidence: number;
  dpi?: number;
  totalPoints: number;
  /** Raw metres before waste, summed across rooms, including drops and terminations. */
  cable: {
    powerRunM: number;
    lightingRunM: number;
  };
  /** One entry per dedicated circuit. runM omitted = circuit not placed in a room. */
  dedicated: { kind: DedicatedKind; runM?: number }[];
  counts: {
    gpoAndSwitch: number;
    lights: number;
    fansAndExhaust: number;
    dataOutlets: number;
    smokeAlarms: number;
    switchboards: number;
    solar: number;
    rcd: number;
  };
}

export interface Line {
  label: string;
  qty: number;
  unit: string;
  rate: number;
  amount: number;
}

export interface Estimate {
  cableLines: Line[];
  labourLines: Line[];
  materialLines: Line[];
  cableTotalM: number;
  cableCost: number;
  labourHours: number;
  labourCost: number;
  materialsCost: number;
  subtotal: number;
  minimumApplied: boolean;
  totalExGst: number;
  gst: number;
  totalIncGst: number;
  costPerPoint: number;
  cableMPerPoint: number;
}

export type Outcome = "hard_stop" | "manual_audit" | "quick_review" | "auto_approved";

export interface GateResult {
  outcome: Outcome;
  reasons: string[];
  tags: string[];
}
