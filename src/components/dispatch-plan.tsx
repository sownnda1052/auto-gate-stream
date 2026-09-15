import { Plan, WAREHOUSES } from "@/lib/data";
import { toMin } from "@/lib/planning";

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
                      <span className="size-1.5 rounded-full bg-emerald-500" />Đúng kế hoạch
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
