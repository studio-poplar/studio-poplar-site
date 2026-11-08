import { JOBS } from "@/lib/deshiiri/codes";

// SaaS の職人の職種（指示書 4章 trade）。表示名は公開中のデシイリの仕事コードとそろえる。
export const TRADES = ["daiku", "sakan", "kawara", "tatami", "tategu", "other"] as const;
export type Trade = (typeof TRADES)[number];

export function tradeLabel(trade: Trade): string {
  return trade === "other" ? "その他" : JOBS[trade];
}
