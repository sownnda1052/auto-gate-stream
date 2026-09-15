// Tài khoản demo — dữ liệu mô phỏng cho báo cáo học thuật, không phải hệ thống thật.
export type Role = "kho" | "baove";

export interface Account {
  email: string;
  password: string;
  role: Role;
  name: string;
  dept: string;
}

export const ACCOUNTS: Account[] = [
  { email: "nhanvienkho1@gmail.com", password: "demo@123", role: "kho", name: "Nhân viên kho 1", dept: "Bộ phận kho / kế hoạch" },
  { email: "baove1@gmail.com", password: "demo@123", role: "baove", name: "Bảo vệ cổng 1", dept: "Bộ phận bảo vệ tại cổng" },
];

const KEY = "uni-wms-session";

export function login(email: string, password: string): Account | null {
  const acc = ACCOUNTS.find(
    (a) => a.email.toLowerCase() === email.trim().toLowerCase() && a.password === password,
  );
  if (!acc) return null;
  try {
    localStorage.setItem(KEY, acc.email);
  } catch {
    /* bỏ qua */
  }
  return acc;
}

export function logout() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* bỏ qua */
  }
}

export function restoreSession(): Account | null {
  try {
    const email = localStorage.getItem(KEY);
    return ACCOUNTS.find((a) => a.email === email) ?? null;
  } catch {
    return null;
  }
}
