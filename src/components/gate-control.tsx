import { useState } from "react";
import { Plan, WAREHOUSES } from "@/lib/data";

interface Result {
  status: "allow" | "wrong-gate" | "not-found";
  plan?: Plan;
}

export function GateControl({ plans }: { plans: Plan[] }) {
  const [container, setContainer] = useState("SEGU 5038733");
  const [gate, setGate] = useState("12");
  const [result, setResult] = useState<Result | null>(null);

  const check = () => {
    const plan = plans.find(
      (p) => p.containerNo.replace(/\s/g, "").toUpperCase() === container.replace(/\s/g, "").toUpperCase(),
    );
    if (!plan) return setResult({ status: "not-found" });
    if (String(plan.gate) === gate.trim()) return setResult({ status: "allow", plan });
    setResult({ status: "wrong-gate", plan });
  };

  const whName = (id?: string) => WAREHOUSES.find((w) => w.id === id)?.name ?? "—";

  return (
    <section className="panel rounded-2xl p-5 ring-1 ring-black/5">
      <div className="flex items-center gap-2">
        <span className="grid size-6 place-items-center rounded-md bg-brand/10 font-mono text-[11px] font-medium text-brand">5</span>
        <h2 className="text-sm font-semibold">Màn hình bảo vệ — kiểm tra tại cổng</h2>
      </div>
      <p className="mt-1 text-[11px] text-ink/45">
        Bảo vệ chỉ cần nhập số container và cửa xe đang đứng — không cần biết packing list hay thuật toán.
      </p>

      <div className="mt-4 flex flex-wrap items-end gap-3">
        <label className="min-w-56 flex-1">
          <span className="text-[11px] font-medium text-ink/50">Số container</span>
          <input className="field mt-1 font-mono uppercase" value={container} onChange={(e) => setContainer(e.target.value)} placeholder="VD: SEGU 5038733" />
        </label>
        <label className="w-32">
          <span className="text-[11px] font-medium text-ink/50">Cửa xe đang đứng</span>
          <input className="field mt-1 font-mono" value={gate} onChange={(e) => setGate(e.target.value)} placeholder="12" />
        </label>
        <button onClick={check} className="rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-brand/90">
          Kiểm tra
        </button>
      </div>

      {result && (
        <div className={`mt-4 rounded-xl p-4 ring-1 ${
          result.status === "allow" ? "glow-green bg-white/70 ring-emerald-500/30"
          : result.status === "wrong-gate" ? "glow-red bg-white/70 ring-red-500/30"
          : "bg-white/70 ring-amber-500/30"
        }`}>
          {result.status === "allow" && result.plan && (
            <>
              <div className="flex items-center gap-3">
                <span className="size-3 rounded-full bg-emerald-500" />
                <span className="text-xl font-bold tracking-tight text-emerald-700">CHO PHÉP VÀO</span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-white/70 py-2">
                  <p className="text-[10px] uppercase tracking-wide text-ink/45">Cửa</p>
                  <p className="font-mono text-sm font-medium">{result.plan.gate}</p>
                </div>
                <div className="rounded-lg bg-white/70 py-2">
                  <p className="text-[10px] uppercase tracking-wide text-ink/45">Giờ</p>
                  <p className="font-mono text-sm font-medium">{result.plan.arrival}</p>
                </div>
                <div className="rounded-lg bg-white/70 py-2">
                  <p className="text-[10px] uppercase tracking-wide text-ink/45">Kho</p>
                  <p className="font-mono text-sm font-medium">{whName(result.plan.warehouseId).replace("Kho ngoại quan ", "")}</p>
                </div>
              </div>
              <p className="mt-3 text-[11px] text-emerald-700">Trùng kế hoạch đã xác nhận — cho phép xe vào.</p>
            </>
          )}
          {result.status === "wrong-gate" && result.plan && (
            <>
              <div className="flex items-center gap-3">
                <span className="size-3 rounded-full bg-red-500" />
                <span className="text-xl font-bold tracking-tight text-red-600">KHÔNG ĐÚNG CỬA</span>
              </div>
              <p className="mt-3 text-[11px] text-red-600">
                Xe được phân vào <b>Cửa {result.plan.gate}</b> ({whName(result.plan.warehouseId)}), khung giờ {result.plan.arrival}–{result.plan.windowEnd}. Từ chối và hướng dẫn xe di chuyển.
              </p>
            </>
          )}
          {result.status === "not-found" && (
            <>
              <div className="flex items-center gap-3">
                <span className="size-3 rounded-full bg-amber-500" />
                <span className="text-xl font-bold tracking-tight text-amber-700">KHÔNG CÓ KẾ HOẠCH</span>
              </div>
              <p className="mt-3 text-[11px] text-amber-700">Container này chưa có kế hoạch tiếp nhận. Liên hệ bộ phận kế hoạch trước khi cho xe vào.</p>
            </>
          )}
        </div>
      )}
    </section>
  );
}
