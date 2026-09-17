import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plan, SAMPLE_LINES, SEED_PLANS, TODAY, WAREHOUSES } from "@/lib/data";
import { buildTimeline, computeSuggestions, Stage, Suggestion, totalCbm } from "@/lib/planning";
import { PlanForm } from "@/components/plan-form";
import { Suggestions } from "@/components/suggestions";
import { Timeline } from "@/components/timeline";
import { DispatchPlan } from "@/components/dispatch-plan";
import { GateControl } from "@/components/gate-control";
import { LoginScreen } from "@/components/login-screen";
import { Account, logout, restoreSession } from "@/lib/auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Phân luồng xe kho ngoại quan U&I" },
      { name: "description", content: "Hệ thống hỗ trợ lập kế hoạch và phân luồng xe, hàng hóa ra vào kho ngoại quan U&I — đề xuất vị trí, lập lịch xử lý, phân cửa và kiểm soát cổng." },
      { property: "og:title", content: "Phân luồng xe kho ngoại quan U&I" },
      { property: "og:description", content: "Hệ thống hỗ trợ lập kế hoạch và phân luồng xe ra vào kho ngoại quan U&I." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const EMPTY_PLAN: Plan = {
  id: "draft",
  containerNo: "CSNU 6348358",
  customer: "Customer A",
  cargoType: "Nội thất",
  direction: "nhap",
  date: TODAY,
  arrival: "13:30",
  lines: SAMPLE_LINES,
};

function Index() {
  const [account, setAccount] = useState<Account | null>(null);
  const [ready, setReady] = useState(false);
  const [draft, setDraft] = useState<Plan>(EMPTY_PLAN);
  const [plans, setPlans] = useState<Plan[]>(SEED_PLANS);
  const [suggestions, setSuggestions] = useState<Suggestion[] | null>(null);
  const [confirmed, setConfirmed] = useState<number | null>(null);
  const [stages, setStages] = useState<Stage[] | null>(null);
  const [departed, setDeparted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [confirmedPlanId, setConfirmedPlanId] = useState<string | null>(null);

  useEffect(() => {
    setAccount(restoreSession());
    setReady(true);
  }, []);

  const generate = () => {
    setSuggestions(computeSuggestions(draft, plans, WAREHOUSES));
    setStages(buildTimeline(draft.arrival, totalCbm(draft.lines)));
    setConfirmed(null);
    setDeparted(false);
    setCompleted(false);
    setConfirmedPlanId(null);
  };

  const confirm = (i: number) => {
    const s = suggestions?.[i];
    if (!s) return;
    const id = `p${Date.now()}`;
    setConfirmed(i);
    setConfirmedPlanId(id);
    setPlans((prev) => [
      ...prev,
      { ...draft, id, warehouseId: s.warehouse.id, gate: s.gate, windowEnd: s.end, status: "Đang xử lý tại cửa" },
    ]);
  };

  const setLotStatus = (status: string) =>
    setPlans((prev) => prev.map((p) => (p.id === confirmedPlanId ? { ...p, status } : p)));

  const onDepart = () => {
    setDeparted(true);
    setLotStatus("Xe đã rời đi · đang sắp hàng");
  };

  const onComplete = () => {
    setCompleted(true);
    setLotStatus("Đã hoàn tất lô hàng");
  };

  const reset = () => {
    logout();
    setAccount(null);
  };

  if (!ready) return null;
  if (!account) return <LoginScreen onLogin={setAccount} />;

  const isKho = account.role === "kho";

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-mist font-sans text-ink antialiased">
      {/* ánh sáng nền */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-16 -top-24 size-[420px] rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute right-0 top-10 size-[380px] rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 size-[440px] rounded-full bg-brand/15 blur-3xl" />
      </div>

      <header className="sticky top-0 z-30 border-b border-white/40 bg-white/55 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1240px] items-center gap-3 px-4 py-3 sm:gap-8 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-lg bg-brand text-primary-foreground ring-1 ring-black/5">
              <span className="font-mono text-sm font-medium">U&I</span>
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold tracking-tight">U&I Bonded Warehouse</p>
              <p className="text-[11px] text-ink/50">{account.dept}</p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            {isKho && (
              <span className="hidden rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-700 ring-1 ring-emerald-500/20 sm:inline-flex">
                Nam Tân Uyên · {plans.length} xe có kế hoạch
              </span>
            )}
            <span className="hidden text-[11px] text-ink/50 sm:inline">{account.name}</span>
            <button onClick={reset} className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-brand ring-1 ring-black/10 transition hover:bg-brand hover:text-primary-foreground">
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1240px] px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-accent">Bản demo báo cáo học thuật</p>
            <h1 className="mt-1 text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
              {isKho ? "Lập kế hoạch & phân luồng xe tự động" : "Kiểm soát xe tại cổng"}
            </h1>
            <p className="mt-1 max-w-[52ch] text-pretty text-sm text-ink/60">
              {isKho
                ? "Input: Container + Packing List + lịch xe → Hệ thống đề xuất vị trí, thời gian, cửa → Nhân viên xác nhận → Bảo vệ kiểm soát tại cổng."
                : "Nhập số container và cửa xe đang đứng để biết cho phép vào hay từ chối. Không hiển thị packing list và dữ liệu kế hoạch nội bộ."}
            </p>
          </div>
        </div>

        {isKho ? (
          <>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <PlanForm plan={draft} onChange={(p) => { setDraft(p); setSuggestions(null); setConfirmed(null); setDeparted(false); setCompleted(false); }} onGenerate={generate} />
              </div>
              <div className="flex flex-col gap-5 lg:col-span-5">
                <Suggestions suggestions={suggestions} confirmedIndex={confirmed} onConfirm={confirm} departed={departed} completed={completed} />
                <Timeline
                  stages={stages}
                  containerNo={draft.containerNo}
                  departed={departed}
                  completed={completed}
                  onDepart={onDepart}
                  onComplete={onComplete}
                />
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-5">
              <DispatchPlan plans={plans} />
            </div>
          </>
        ) : (
          <GateControl plans={plans} />
        )}

        <footer className="mt-8 flex flex-col gap-1 text-[11px] text-ink/40 sm:flex-row sm:items-center sm:justify-between">
          <p>Hệ thống hỗ trợ lập kế hoạch và phân luồng xe — kho ngoại quan U&I · Dữ liệu mô phỏng</p>
          <p className="font-mono">KCN Nam Tân Uyên, Bình Dương</p>
        </footer>
      </main>
    </div>
  );
}
