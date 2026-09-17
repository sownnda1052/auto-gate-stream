import { Plan, WAREHOUSES } from "@/lib/data";
import { toMin } from "@/lib/planning";

const fmtDate = (iso?: string) => {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};

function exportPdf(plans: Plan[]) {
  const rows = plans
    .map(
      (p, i) => `<tr>
        <td>${i + 1}</td>
        <td>${p.arrival}–${p.windowEnd ?? ""}</td>
        <td><b>${p.containerNo}</b></td>
        <td>${p.direction === "nhap" ? "VÀO" : "RA"}</td>
        <td>${WAREHOUSES.find((w) => w.id === p.warehouseId)?.name ?? "—"}</td>
        <td style="text-align:center"><b>${p.gate ?? "—"}</b></td>
        <td>${p.deviation ? "⚠ " + p.deviation : p.status ?? "Đúng kế hoạch"}</td>
      </tr>`
    )
    .join("");

  const today = new Date();
  const dateStr = `ngày ${today.getDate()} tháng ${today.getMonth() + 1} năm ${today.getFullYear()}`;

  const html = `<!DOCTYPE html><html lang="vi"><head><meta charset="utf-8">
<title>Kế hoạch phân luồng xe - ${today.toLocaleDateString("vi-VN")}</title>
<style>
  body { font-family: "Times New Roman", serif; color: #111; margin: 32px; }
  .head { text-align: center; margin-bottom: 20px; }
  .head h1 { font-size: 18px; margin: 4px 0; text-transform: uppercase; }
  .head p { margin: 2px 0; font-size: 13px; }
  table { width: 100%; border-collapse: collapse; font-size: 12.5px; }
  th, td { border: 1px solid #444; padding: 6px 8px; text-align: left; }
  th { background: #eee; text-transform: uppercase; font-size: 11px; }
  .foot { margin-top: 28px; display: flex; justify-content: space-between; font-size: 13px; }
  .foot div { text-align: center; }
  @media print { body { margin: 12mm; } }
</style></head><body>
  <div class="head">
    <p><b>CÔNG TY U&amp;I — KHO NGOẠI QUAN NAM TÂN UYÊN</b></p>
    <h1>Kế hoạch phân luồng xe ra vào kho</h1>
    <p><i>Nam Tân Uyên, ${dateStr}</i></p>
  </div>
  <table>
    <thead><tr>
      <th>STT</th><th>Khung giờ</th><th>Container</th><th>Luồng</th><th>Kho</th><th>Cửa</th><th>Trạng thái</th>
    </tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <div class="foot">
    <div><b>Người lập kế hoạch</b><br><br><br>(Ký, họ tên)</div>
    <div><b>Xác nhận của bảo vệ cổng</b><br><br><br>(Ký, họ tên)</div>
    <div><b>Quản lý kho</b><br><br><br>(Ký, họ tên)</div>
  </div>
  <script>window.onload = () => window.print();</script>
</body></html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
}

export function DispatchPlan({ plans }: { plans: Plan[] }) {
  const sorted = [...plans].filter((p) => p.gate !== undefined).sort((a, b) => toMin(a.arrival) - toMin(b.arrival));
  const whName = (id?: string) => WAREHOUSES.find((w) => w.id === id)?.name ?? "—";

  return (
    <section className="panel rounded-2xl p-5 ring-1 ring-black/5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="grid size-6 place-items-center rounded-md bg-brand/10 font-mono text-[11px] font-medium text-brand">4</span>
          <h2 className="text-sm font-semibold">Kế hoạch phân luồng ngày hôm nay</h2>
        </div>
        <span className="rounded-full bg-ink/5 px-2.5 py-0.5 text-[11px] font-medium text-ink/60">{sorted.length} xe</span>
      </div>
      <p className="mt-1 text-[11px] text-ink/45">
        “Tờ giấy 41 cửa” cũ trở thành kết quả phân luồng tự động của hệ thống.
      </p>

      <div className="mt-4 overflow-x-auto rounded-xl ring-1 ring-black/10">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="bg-white/50 text-[11px] uppercase tracking-wide text-ink/45">
            <tr>
              <th className="px-3 py-2 font-medium">Giờ</th>
              <th className="px-3 py-2 font-medium">Container</th>
              <th className="px-3 py-2 font-medium">Luồng</th>
              <th className="px-3 py-2 font-medium">Kho</th>
              <th className="px-3 py-2 text-right font-medium">Cửa</th>
              <th className="px-3 py-2 font-medium">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {sorted.map((p) => (
              <tr key={p.id} className="bg-white/40">
                <td className="px-3 py-2 font-mono text-xs">{p.arrival}–{p.windowEnd}</td>
                <td className="px-3 py-2 font-mono text-xs font-medium">{p.containerNo}</td>
                <td className="px-3 py-2">
                  <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium ${p.direction === "nhap" ? "bg-accent/10 text-accent" : "bg-brand/10 text-brand"}`}>
                    {p.direction === "nhap" ? "VÀO" : "RA"}
                  </span>
                </td>
                <td className="px-3 py-2 text-xs text-ink/70">{whName(p.warehouseId)}</td>
                <td className="px-3 py-2 text-right font-mono text-sm font-semibold">{p.gate}</td>
                <td className="px-3 py-2">
                  {p.deviation ? (
                    <span className="inline-flex items-center gap-1 rounded-md bg-red-500/10 px-2 py-0.5 text-[11px] font-medium text-red-600">
                      ⚠ {p.deviation}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-700">
                      <span className="size-1.5 rounded-full bg-emerald-500" />{p.status ?? "Đúng kế hoạch"}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
