import { Stage } from "@/lib/planning";

export function Timeline({ stages, containerNo }: { stages: Stage[] | null; containerNo: string }) {
  return (
    <section className="panel-solid rounded-2xl p-5 ring-1 ring-black/5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="grid size-6 place-items-center rounded-md bg-brand/10 font-mono text-[11px] font-medium text-brand">3</span>
          <h2 className="text-sm font-semibold">Thời gian xử lý dự kiến</h2>
        </div>
        {stages && <span className="font-mono text-[11px] text-ink/45">{containerNo}</span>}
      </div>

      {!stages ? (
        <p className="mt-4 text-xs text-ink/45">Timeline được tính sau khi có kế hoạch: xe đến → kiểm tra cổng → dỡ hàng → kiểm đếm → sắp hàng → hoàn tất.</p>
      ) : (
        <ol className="mt-4 space-y-4">
          {stages.map((s, i) => (
            <li key={i} className="flex gap-3">
              <span className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full text-[10px] ${i === stages.length - 1 ? "bg-emerald-500 text-primary-foreground" : "bg-ink/15 text-ink/50"}`}>
                {i + 1}
              </span>
              <div className="flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-xs font-medium">{s.label}</p>
                  <p className="font-mono text-[11px] text-ink/45">
                    {s.minutes > 0 ? `+${s.minutes}p · ` : ""}{s.time}
                  </p>
                </div>
                {s.note && <p className="mt-0.5 text-[10px] italic text-accent">{s.note}</p>}
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
