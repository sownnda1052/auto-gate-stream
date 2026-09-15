import { Suggestion } from "@/lib/planning";

interface Props {
  suggestions: Suggestion[] | null;
  confirmedIndex: number | null;
  onConfirm: (i: number) => void;
}

export function Suggestions({ suggestions, confirmedIndex, onConfirm }: Props) {
  return (
    <section className="panel rounded-2xl p-5 ring-1 ring-black/5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="grid size-6 place-items-center rounded-md bg-accent/15 font-mono text-[11px] font-medium text-accent">2</span>
          <h2 className="text-sm font-semibold">Đề xuất vị trí</h2>
        </div>
        <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-[11px] font-medium text-accent">Output</span>
      </div>

      {!suggestions ? (
        <p className="mt-4 text-xs text-ink/45">
          Nhập kế hoạch ở mục 1 và bấm <b>“Tạo đề xuất vị trí”</b>. Hệ thống chỉ đề xuất — nhân viên kho xác nhận hoặc chọn phương án khác.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {suggestions.map((s, i) => {
            const confirmed = confirmedIndex === i;
            return (
              <li key={i} className={`rounded-xl p-3 ring-1 ${confirmed ? "glow-green bg-white/70 ring-emerald-500/30" : "bg-white/55 ring-black/5"}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold leading-snug">
                      {s.warehouse.name} · Cửa {s.gate}
                      {s.recommended && !confirmed && (
                        <span className="ml-2 inline-block rounded-md bg-accent/15 px-1.5 py-0.5 align-middle text-[10px] font-medium text-accent">Đề xuất</span>
                      )}
                    </p>
                    <p className="mt-0.5 text-[11px] text-ink/50">
                      {s.warehouse.address} · {s.start}–{s.end}
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-md px-2 py-0.5 text-[11px] font-medium ${s.score === s.checks.length ? "bg-emerald-500/15 text-emerald-700" : "bg-amber-500/15 text-amber-700"}`}>
                    {s.score}/{s.checks.length} tiêu chí
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {s.checks.map((c, j) => (
                    <span key={j} className={`rounded-md px-2 py-0.5 text-[11px] ring-1 ${c.ok ? "bg-white/80 text-ink/60 ring-black/5" : "bg-red-500/10 text-red-600 ring-red-500/20"}`}>
                      {c.ok ? "✓" : "✕"} {c.label}
                    </span>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${confirmed ? "bg-emerald-500/15 text-emerald-700" : "bg-white/70 text-ink/50"}`}>
                    <span className={`size-1.5 rounded-full ${confirmed ? "bg-emerald-500" : "bg-ink/30"}`} />
                    {confirmed ? "Đã xác nhận" : "Chờ xác nhận"}
                  </span>
                  {confirmed ? (
                    <span className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-primary-foreground">Đã gán</span>
                  ) : (
                    <button onClick={() => onConfirm(i)} disabled={confirmedIndex !== null}
                      className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-brand ring-1 ring-black/10 transition hover:bg-brand hover:text-primary-foreground disabled:opacity-40">
                      Xác nhận
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
