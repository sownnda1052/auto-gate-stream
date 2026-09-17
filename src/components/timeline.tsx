import { Stage } from "@/lib/planning";

interface Props {
  stages: Stage[] | null;
  containerNo: string;
  departed: boolean;
  completed: boolean;
  onDepart: () => void;
  onComplete: () => void;
}

export function Timeline({ stages, containerNo, departed, completed, onDepart, onComplete }: Props) {
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
          {stages.map((s, i) => {
            const isDepartStep = i === 5;
            const isFinalStep = i === stages.length - 1;
            const done = (isDepartStep && departed) || (isFinalStep && completed);
            return (
              <li key={i} className="flex gap-3">
                <span className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full text-[10px] ${done || (isFinalStep && completed) ? "bg-emerald-500 text-primary-foreground" : isFinalStep ? "bg-ink/25 text-white" : "bg-ink/15 text-ink/50"}`}>
                  {done ? "✓" : i + 1}
                </span>
                <div className="flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-xs font-medium">{s.label}</p>
                    <p className="font-mono text-[11px] text-ink/45">
                      {s.minutes > 0 ? `+${s.minutes}p · ` : ""}{s.time}
                    </p>
                  </div>
                  {s.note && <p className="mt-0.5 text-[10px] italic text-accent">{s.note}</p>}

                  {isDepartStep && (
                    <div className="mt-2">
                      {departed ? (
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/15 px-2.5 py-1 text-[11px] font-medium text-emerald-700">
                          <span className="size-1.5 rounded-full bg-emerald-500" />Đã cho xe rời đi
                        </span>
                      ) : (
                        <button
                          onClick={onDepart}
                          className="w-full rounded-lg bg-white px-3 py-2 text-xs font-medium text-brand ring-1 ring-black/10 transition hover:bg-brand hover:text-primary-foreground sm:w-auto"
                        >
                          Đồng ý cho xe rời đi
                        </button>
                      )}
                    </div>
                  )}

                  {isFinalStep && (
                    <div className="mt-2">
                      {completed ? (
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/15 px-2.5 py-1 text-[11px] font-medium text-emerald-700">
                          <span className="size-1.5 rounded-full bg-emerald-500" />Lô hàng đã hoàn tất
                        </span>
                      ) : (
                        <button
                          onClick={onComplete}
                          disabled={!departed}
                          className="w-full rounded-lg bg-emerald-600 px-3 py-2 text-xs font-medium text-primary-foreground transition hover:bg-emerald-700 disabled:opacity-40 sm:w-auto"
                        >
                          Hoàn tất lô hàng (thủ công)
                        </button>
                      )}
                      {!departed && !completed && (
                        <p className="mt-1 text-[10px] text-ink/45">Cần xác nhận cho xe rời đi ở bước 6 trước.</p>
                      )}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
