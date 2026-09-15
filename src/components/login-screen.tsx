import { useState } from "react";
import { Account, login } from "@/lib/auth";

export function LoginScreen({ onLogin }: { onLogin: (acc: Account) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const acc = login(email, password);
    if (!acc) return setError("Email hoặc mật khẩu không đúng.");
    setError(null);
    onLogin(acc);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-x-hidden bg-mist px-4 py-10 font-sans text-ink antialiased">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-16 -top-24 size-[420px] rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 size-[420px] rounded-full bg-brand/15 blur-3xl" />
      </div>

      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-lg bg-brand text-primary-foreground ring-1 ring-black/5">
            <span className="font-mono text-sm font-medium">U&I</span>
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-tight">U&I Bonded Warehouse</p>
            <p className="text-[11px] text-ink/50">Hệ thống phân luồng xe ra/vào kho ngoại quan</p>
          </div>
        </div>

        <form onSubmit={submit} className="panel-solid mt-5 rounded-2xl p-5 ring-1 ring-black/5">
          <h1 className="text-base font-semibold tracking-tight">Đăng nhập theo bộ phận</h1>
          <p className="mt-1 text-[11px] text-ink/50">
            Mỗi bộ phận chỉ thấy phần dữ liệu thuộc phạm vi công việc của mình.
          </p>

          <label className="mt-4 block">
            <span className="text-[11px] font-medium text-ink/50">Email</span>
            <input
              className="field mt-1"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nhanvienkho1@gmail.com"
            />
          </label>
          <label className="mt-3 block">
            <span className="text-[11px] font-medium text-ink/50">Mật khẩu</span>
            <input
              className="field mt-1"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </label>

          {error && <p className="mt-3 text-[11px] font-medium text-red-600">{error}</p>}

          <button type="submit" className="mt-4 w-full rounded-lg bg-brand px-5 py-3 text-sm font-medium text-primary-foreground transition hover:bg-brand/90">
            Đăng nhập
          </button>

          <div className="mt-4 rounded-xl bg-ink/[0.04] p-3 text-[11px] leading-relaxed text-ink/60">
            <p className="font-medium text-ink/70">Tài khoản demo</p>
            <p className="mt-1 font-mono">nhanvienkho1@gmail.com · demo@123 — nhân viên kho</p>
            <p className="font-mono">baove1@gmail.com · demo@123 — bảo vệ tại cổng</p>
          </div>
        </form>
      </div>
    </div>
  );
}
