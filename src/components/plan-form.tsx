import { PackingLine, Plan } from "@/lib/data";
import { totalCbm, totalQty } from "@/lib/planning";

interface Props {
  plan: Plan;
  onChange: (p: Plan) => void;
  onGenerate: () => void;
}

export function PlanForm({ plan, onChange, onGenerate }: Props) {
  const set = (patch: Partial<Plan>) => onChange({ ...plan, ...patch });
  const setLine = (i: number, patch: Partial<PackingLine>) => {
    const lines = plan.lines.map((l, j) => (j === i ? { ...l, ...patch } : l));
    set({ lines });
  };

  return (
    <section className="panel rounded-2xl p-5 ring-1 ring-black/5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="grid size-6 place-items-center rounded-md bg-brand/10 font-mono text-[11px] font-medium text-brand">1</span>
          <h2 className="text-sm font-semibold">Kế hoạch tiếp nhận</h2>
        </div>
        <span className="rounded-full bg-ink/5 px-2.5 py-0.5 text-[11px] font-medium text-ink/60">Input</span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:grid-cols-3">
        <label>
          <span className="text-[11px] font-medium text-ink/50">Mã container</span>
          <input className="field mt-1 font-mono" value={plan.containerNo}
            onChange={(e) => set({ containerNo: e.target.value.toUpperCase() })} />
        </label>
        <label>
          <span className="text-[11px] font-medium text-ink/50">Khách hàng</span>
          <select className="field mt-1" value={plan.customer} onChange={(e) => set({ customer: e.target.value })}>
            {["Customer A", "Ashley Furniture", "Vinamilk", "Samsung"].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label>
          <span className="text-[11px] font-medium text-ink/50">Ngày tiếp nhận</span>
          <input type="date" className="field mt-1 font-mono" value={plan.date}
            onChange={(e) => set({ date: e.target.value })} />
        </label>
        <label>
          <span className="text-[11px] font-medium text-ink/50">Giờ xe đến</span>
          <input type="time" className="field mt-1 font-mono" value={plan.arrival}
            onChange={(e) => set({ arrival: e.target.value })} />
        </label>
        <label>
          <span className="text-[11px] font-medium text-ink/50">Loại hàng</span>
          <select className="field mt-1" value={plan.cargoType} onChange={(e) => set({ cargoType: e.target.value })}>
            {["Nội thất", "Điện tử", "Thực phẩm khô", "May mặc"].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label>
          <span className="text-[11px] font-medium text-ink/50">Luồng</span>
          <select className="field mt-1" value={plan.direction}
            onChange={(e) => set({ direction: e.target.value as Plan["direction"] })}>
            <option value="nhap">Hàng vào (nhập kho)</option>
            <option value="xuat">Hàng ra (xuất kho)</option>
          </select>
        </label>
      </div>

      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-semibold text-ink/70">Packing list</p>
          <span className="text-[11px] text-ink/40">
            {plan.lines.length} dòng · {totalQty(plan.lines)} PCS · {totalCbm(plan.lines).toFixed(1)} CBM
          </span>
        </div>
        <div className="overflow-x-auto rounded-xl ring-1 ring-black/10">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead className="bg-white/50 text-[11px] uppercase tracking-wide text-ink/45">
              <tr>
                <th className="px-3 py-2 font-medium">ItemID</th>
                <th className="px-3 py-2 font-medium">PO#</th>
                <th className="px-3 py-2 font-medium">Mô tả</th>
                <th className="px-3 py-2 text-right font-medium">PCS</th>
                <th className="px-3 py-2 text-right font-medium">CBM</th>
                <th className="px-3 py-2 text-right font-medium">GW (kg)</th>
                <th className="w-8" />
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {plan.lines.map((l, i) => (
                <tr key={i} className="bg-white/40">
                  <td className="px-2 py-1"><input className="w-full bg-transparent px-1 py-1 font-mono text-xs outline-none" value={l.itemId} onChange={(e) => setLine(i, { itemId: e.target.value })} /></td>
                  <td className="px-2 py-1"><input className="w-full bg-transparent px-1 py-1 font-mono text-xs outline-none" value={l.po} onChange={(e) => setLine(i, { po: e.target.value })} /></td>
                  <td className="px-2 py-1"><input className="w-full bg-transparent px-1 py-1 text-xs outline-none" value={l.description} onChange={(e) => setLine(i, { description: e.target.value })} /></td>
                  <td className="px-2 py-1"><input type="number" className="w-full bg-transparent px-1 py-1 text-right font-mono text-xs outline-none" value={l.qty} onChange={(e) => setLine(i, { qty: +e.target.value })} /></td>
                  <td className="px-2 py-1"><input type="number" step="0.01" className="w-full bg-transparent px-1 py-1 text-right font-mono text-xs outline-none" value={l.cbm} onChange={(e) => setLine(i, { cbm: +e.target.value })} /></td>
                  <td className="px-2 py-1"><input type="number" className="w-full bg-transparent px-1 py-1 text-right font-mono text-xs outline-none" value={l.gw} onChange={(e) => setLine(i, { gw: +e.target.value })} /></td>
                  <td className="px-1 py-1 text-center">
                    <button className="text-xs text-ink/30 hover:text-destructive" onClick={() => set({ lines: plan.lines.filter((_, j) => j !== i) })} aria-label="Xóa dòng">×</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="mt-2 text-xs font-medium text-accent hover:underline"
          onClick={() => set({ lines: [...plan.lines, { itemId: "", po: "", description: "", qty: 1, cbm: 0, gw: 0 }] })}>
          + Thêm dòng hàng
        </button>
      </div>

      <button onClick={onGenerate}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-primary-foreground ring-1 ring-brand/30 transition hover:bg-brand/90 sm:w-auto">
        <span>Tạo đề xuất vị trí</span>
        <span aria-hidden className="text-primary-foreground/70">→</span>
      </button>
    </section>
  );
}
