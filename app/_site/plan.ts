// Floor plan for the landing page scan demo. The symbol mix mirrors the real
// 98-point new residential job in tests/fixtures/new-residential-98pt.json.

export type SymbolKind =
  | "light"
  | "gpo"
  | "switch"
  | "fan"
  | "data"
  | "smoke"
  | "msb"
  | "solar"
  | "dedicated";

export interface PlanSymbol {
  kind: SymbolKind;
  x: number;
  y: number;
  label?: string;
}

export interface Room {
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
  lights: number;
  gpos: number;
  switches: number;
  fans?: number;
  data?: number;
  smoke?: number;
  dedicated?: string[];
  msb?: boolean;
}

export const PLAN_W = 1000;
export const PLAN_H = 640;

export const rooms: Room[] = [
  { name: "GARAGE", x: 20, y: 20, w: 260, h: 250, lights: 2, gpos: 4, switches: 2, msb: true, dedicated: ["EV"] },
  { name: "LIVING", x: 280, y: 20, w: 360, h: 250, lights: 4, gpos: 9, switches: 3, fans: 1, data: 2, dedicated: ["AC"] },
  { name: "KITCHEN / DINING", x: 640, y: 20, w: 340, h: 250, lights: 3, gpos: 7, switches: 2, fans: 1, dedicated: ["O", "C"] },
  { name: "BED 2", x: 20, y: 270, w: 220, h: 270, lights: 2, gpos: 3, switches: 2, fans: 1, data: 1, smoke: 1 },
  { name: "BED 3", x: 240, y: 270, w: 210, h: 270, lights: 2, gpos: 3, switches: 1, fans: 1, smoke: 1 },
  { name: "BATH", x: 450, y: 270, w: 150, h: 270, lights: 2, gpos: 1, switches: 1, fans: 1, dedicated: ["HW"] },
  { name: "MASTER", x: 600, y: 270, w: 380, h: 270, lights: 3, gpos: 6, switches: 2, data: 1, dedicated: ["AC"] },
];

const PAD = 22;

function lightGrid(r: Room, n: number): PlanSymbol[] {
  const cols = Math.max(1, Math.round(Math.sqrt((n * r.w) / r.h)));
  const rows = Math.ceil(n / cols);
  const out: PlanSymbol[] = [];
  for (let i = 0; i < n; i++) {
    const c = i % cols;
    const row = Math.floor(i / cols);
    out.push({
      kind: "light",
      x: r.x + (r.w * (c + 1)) / (cols + 1),
      y: r.y + (r.h * (row + 1)) / (rows + 1),
    });
  }
  return out;
}

// Spread points evenly around the inside of the walls, skipping the corners.
function perimeter(r: Room, n: number, kind: SymbolKind, offset: number): PlanSymbol[] {
  const w = r.w - PAD * 2;
  const h = r.h - PAD * 2;
  const total = 2 * (w + h);
  const out: PlanSymbol[] = [];
  for (let i = 0; i < n; i++) {
    let d = ((i + offset) / n) * total;
    let x: number;
    let y: number;
    if (d < w) {
      x = d;
      y = 0;
    } else if ((d -= w) < h) {
      x = w;
      y = d;
    } else if ((d -= h) < w) {
      x = w - d;
      y = h;
    } else {
      d -= w;
      x = 0;
      y = h - d;
    }
    out.push({ kind, x: r.x + PAD + x, y: r.y + PAD + y });
  }
  return out;
}

function buildSymbols(): PlanSymbol[] {
  const out: PlanSymbol[] = [];
  for (const r of rooms) {
    out.push(...lightGrid(r, r.lights));
    out.push(...perimeter(r, r.gpos, "gpo", 0.5));
    for (let i = 0; i < r.switches; i++) {
      out.push({ kind: "switch", x: r.x + PAD + 14 + i * 14, y: r.y + r.h - PAD - 14 });
    }
    for (let i = 0; i < (r.fans ?? 0); i++) {
      out.push({ kind: "fan", x: r.x + r.w / 2, y: r.y + r.h / 2 });
    }
    for (let i = 0; i < (r.data ?? 0); i++) {
      out.push({ kind: "data", x: r.x + r.w - PAD - 16 - i * 20, y: r.y + PAD + 30 });
    }
    for (let i = 0; i < (r.smoke ?? 0); i++) {
      out.push({ kind: "smoke", x: r.x + r.w / 2, y: r.y + PAD + 28 });
    }
    (r.dedicated ?? []).forEach((label, i) => {
      out.push({ kind: "dedicated", label, x: r.x + r.w - PAD - 22 - i * 34, y: r.y + r.h - PAD - 22 });
    });
    if (r.msb) out.push({ kind: "msb", x: r.x + PAD + 30, y: r.y + PAD + 30 });
  }
  // 16-panel PV array on the roof strip under the plan.
  for (let i = 0; i < 16; i++) {
    out.push({ kind: "solar", x: 60 + i * 56, y: 592 });
  }
  return out.sort((a, b) => a.x - b.x);
}

export const symbols = buildSymbols();

// Cable runs drawn after the scan: switchboard out to each room.
export const runs: string[] = rooms
  .filter((r) => !r.msb)
  .map((r) => {
    const tx = r.x + r.w / 2;
    const ty = r.y + r.h / 2;
    return `M72 72 H${tx} V${ty}`;
  });
