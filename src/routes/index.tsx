import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plan, SAMPLE_LINES, SEED_PLANS, WAREHOUSES } from "@/lib/data";
import { buildTimeline, computeSuggestions, Stage, Suggestion, totalCbm } from "@/lib/planning";
import { PlanForm } from "@/components/plan-form";
import { Suggestions } from "@/components/suggestions";
import { Timeline } from "@/components/timeline";
import { DispatchPlan } from "@/components/dispatch-plan";
import { GateControl } from "@/components/gate-control";

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
  arrival: "13:30",
  lines: SAMPLE_LINES,
};

function Index() {
  const [draft, setDraft] = useState<Plan>(EMPTY_PLAN);
  const [plans, setPlans] = useState<Plan[]>(SEED_PLANS);
  const [suggestions, setSuggestions] = useState<Suggestion[] | null>(null);
  const [confirmed, setConfirmed] = useState<number | null>(null);
  const [stages, setStages] = useState<Stage[] | null>(null);

  const generate = () => {
    setSuggestions(computeSuggestions(draft, plans, WAREHOUSES));
    setStages(buildTimeline(draft.arrival, totalCbm(draft.lines)));
    setConfirmed(null);
  };

  const confirm = (i: number) => {
    if (!suggestions) return;
    const s = suggestions[i];
    setConfirmed(i);
    setPlans((prev) => [
      ...prev,
      { ...draft, id: `p${Date.now()}`, warehouseId: s.warehouse.id, gate: s.gate, windowEnd: s.end },
    ]);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-mist font-sans text-ink antialiased">
      {/* ánh sáng nền */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-16 -top-24 size-[420px] rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute right-0 top-10 size-[380px] rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 size-[440px] rounded-full bg-brand/15 blur-3xl" />
      </div>

      <header className="sticky top-0 z-30 border-b border-white/40 bg-white/55 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1240px] items-center gap-8 px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-lg bg-brand text-primary-foreground ring-1 ring-black/5">
              <span className="font-mono text-sm font-medium">U&I</span>
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold tracking-tight">U&I Bonded Warehouse</p>
              <p className="text-[11px] text-ink/50">Hệ thống phân luồng xe ra/vào kho ngoại quan</p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-700 ring-1 ring-emerald-500/20 sm:inline-flex">
              Nam Tân Uyên · {plans.length} xe có kế hoạch
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1240px] px-6 py-8">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-accent">Bản demo báo cáo học thuật</p>
            <h1 className="mt-1 text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
              Lập kế hoạch & phân luồng xe tự động
            </h1>
            <p className="mt-1 max-w-[52ch] text-pretty text-sm text-ink/60">
              Input: Container + Packing List + lịch xe → Hệ thống đề xuất vị trí, thời gian, cửa → Nhân viên xác nhận → Bảo vệ kiểm soát tại cổng.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <PlanForm plan={draft} onChange={(p) => { setDraft(p); setSuggestions(null); setConfirmed(null); }} onGenerate={generate} />
          </div>
          <div className="flex flex-col gap-5 lg:col-span-5">
            <Suggestions suggestions={suggestions} confirmedIndex={confirmed} onConfirm={confirm} />
            <Timeline stages={stages} containerNo={draft.containerNo} />
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-5">
          <DispatchPlan plans={plans} />
          <GateControl plans={plans} />
        </div>

        <footer className="mt-8 flex items-center justify-between text-[11px] text-ink/40">
          <p>Hệ thống hỗ trợ lập kế hoạch và phân luồng xe — kho ngoại quan U&I · Dữ liệu mô phỏng</p>
          <p className="font-mono">KCN Nam Tân Uyên, Bình Dương</p>
        </footer>
      </main>
    </div>
  );
}
