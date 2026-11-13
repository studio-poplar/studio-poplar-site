import "server-only";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { isAdminEmail } from "@/lib/deshiiri/env";

// 管理画面と管理用 API の入口（指示書 5章）。proxy の確認だけに頼らず、
// 各ページ・Server Action・Route Handler の先頭で必ずこのどれかを呼ぶ。
// 許可リストは毎回読み直すので、ADMIN_EMAILS から外せば次の操作から入れなくなる。

export class NotAdminError extends Error {
  constructor() {
    super("編集部のログインが必要です");
    this.name = "NotAdminError";
  }
}

/** ログイン中で、許可リストに入っている編集部のメール。そうでなければ null。 */
export async function currentAdmin(): Promise<string | null> {
  const session = await auth();
  const email = session?.user?.email;
  return isAdminEmail(email) ? email!.toLowerCase() : null;
}

/** 管理画面のページ用。入れない人はログイン画面へ。 */
export async function requireAdminPage(): Promise<string> {
  const email = await currentAdmin();
  if (!email) redirect("/deshiiri/admin/login");
  return email;
}

/** Server Action 用。入れない人には例外を投げる。 */
export async function assertAdmin(): Promise<string> {
  const email = await currentAdmin();
  if (!email) throw new NotAdminError();
  return email;
}

/** Route Handler 用。入れない人には 401 を返す。 */
export async function adminOr401(): Promise<{ email: string } | { response: Response }> {
  const email = await currentAdmin();
  if (!email) return { response: Response.json({ error: "unauthorized" }, { status: 401 }) };
  return { email };
}
