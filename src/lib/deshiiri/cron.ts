import "server-only";
import { timingSafeEqual } from "node:crypto";

// 定時の仕事の入口を外から叩かれないようにする（指示書 10章）。
// Vercel Cron は CRON_SECRET を Authorization: Bearer で送ってくる。

export function cronAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const got = request.headers.get("authorization") ?? "";
  const want = `Bearer ${secret}`;
  const a = Buffer.from(got);
  const b = Buffer.from(want);
  return a.length === b.length && timingSafeEqual(a, b);
}

export const unauthorized = () => Response.json({ error: "unauthorized" }, { status: 401 });
