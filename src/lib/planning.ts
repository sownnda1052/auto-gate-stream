import { Plan, Warehouse } from "./data";

export interface Stage {
  label: string;
  minutes: number;
  time: string;
  note?: string | undefined;
}

export interface Suggestion {
  warehouse: Warehouse;
  gate: number;
  start: string;
  end: string;
  checks: { label: string; ok: boolean }[];
  score: number;
  recommended: boolean;
}

export function toMin(hhmm: string): number {
  const [h = 0, m = 0] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function toHHMM(min: number): string {
  const h = Math.floor(min / 60) % 24;
  const m = min % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function totalCbm(lines: { cbm: number }[]): number {
  return lines.reduce((s, l) => s + l.cbm, 0);
}

export function totalQty(lines: { qty: number }[]): number {
  return lines.reduce((s, l) => s + l.qty, 0);
}

export function totalGw(lines: { gw: number }[]): number {
  return lines.reduce((s, l) => s + l.gw, 0);
}

// Công đoạn xử lý: xe đến → kiểm tra cổng → dỡ hàng → kiểm đếm → hoàn tất
export function buildTimeline(arrival: string, cbm: number): Stage[] {
  const unload = Math.max(30, Math.round(cbm * 2.2));
  const steps: [string, number, string?][] = [
    ["Xe đến cổng", 0],
    ["Kiểm tra cổng", 5],
    ["Chờ cửa", 5],
    ["Đưa container vào", 10],
    ["Dỡ hàng", unload],
    ["Kiểm đếm", 15, "Sau bước này xe cont có thể rời đi"],
    ["Di chuyển vào vị trí xếp hàng", 20],
    ["Sắp xếp", 20],
    ["Hoàn tất", 0],
  ];
  let t = toMin(arrival);
  return steps.map(([label, minutes, note]) => {
    t += minutes;
    return { label, minutes, time: toHHMM(t), note };
  });
}

// Thuật toán đề xuất: sức chứa → khách hàng → loại hàng → cửa → xung đột lịch

export function computeSuggestions(
  plan: Plan,
  plans: Plan[],
  warehouses: Warehouse[],
): Suggestion[] {
  const cbm = Math.max(totalCbm(plan.lines), 1);
  const start = toMin(plan.arrival);
  const tl = buildTimeline(plan.arrival, cbm);
  const end = toMin(tl.at(-1)?.time ?? plan.arrival);

  const suggestions: Suggestion[] = warehouses.map((w) => {
    const freeCbm = w.capacity - w.used;
    const checks = [
      { label: `Đủ sức chứa (còn ${freeCbm.toLocaleString("vi-VN")} m³)`, ok: freeCbm >= cbm },
      { label: "Phù hợp khách hàng", ok: w.customers.includes(plan.customer) },
      { label: "Phù hợp loại hàng", ok: w.cargoTypes.includes(plan.cargoType) },
      { label: "Gần cửa xử lý", ok: w.gates.length > 0 },
    ];

    // tìm cửa không xung đột lịch trong khung giờ xử lý
    let gate: number | undefined;
    for (const g of w.gates) {
      const conflict = plans.some(
        (p) =>
          p.gate === g &&
          Math.abs(toMin(p.arrival) - start) < 120,
      );
      if (!conflict) {
        gate = g;
        break;
      }
    }
    checks.push({ label: "Không xung đột lịch cửa", ok: gate !== undefined });

    const score = checks.filter((c) => c.ok).length;
    return {
      warehouse: w,
      gate: gate ?? w.gates[0] ?? 0,
      start: plan.arrival,
      end: toHHMM(end),
      checks,
      score,
      recommended: false,
    };
  });

  suggestions.sort((a, b) => b.score - a.score);
  const top = suggestions.slice(0, 3);
  if (top[0]) top[0].recommended = true;
  return top;
}
