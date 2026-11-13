// 無料枠の見張り（指示書 6章・M5）。DB や外部サービスに触らない決まりごとだけ（テストしやすいように）。

export const LIMITS = {
  /** LINE のプッシュは月200通まで無料。150通を超えたら知らせる。 */
  pushWarn: 150,
  pushFree: 200,
  /** R2 は 10GB まで無料。8GB で知らせる。 */
  r2WarnBytes: 8 * 1024 ** 3,
  /** Neon 無料プランは 0.5GB/プロジェクト〜（プランで変わる）。指示書どおり 0.8GB で知らせる。 */
  neonWarnBytes: 0.8 * 1024 **3,
} as const;

export type Usage = { pushes: number; r2Bytes: number; r2Objects: number; neonBytes: number };

export function usageWarnings(u: Usage): string[] {
  const w: string[] = [];
  if (u.pushes > LIMITS.pushWarn)
    w.push(`LINE のプッシュが今月 ${u.pushes} 通です（無料は ${LIMITS.pushFree} 通まで）。超えると、それ以上は送れません。`);
  if (u.r2Bytes >= LIMITS.r2WarnBytes) w.push(`写真の置き場（R2）が ${gb(u.r2Bytes)} です（無料は 10GB まで）。`);
  if (u.neonBytes >= LIMITS.neonWarnBytes) w.push(`データベース（Neon）が ${gb(u.neonBytes)} です（${gb(LIMITS.neonWarnBytes)} で知らせる決まり）。`);
  return w;
}

export const gb = (bytes: number) => `${(bytes / 1024 ** 3).toFixed(2)}GB`;
export const mb = (bytes: number) => `${(bytes / 1024 ** 2).toFixed(1)}MB`;

/** 日本時間の今月1日 0:00。 */
export function monthStartJst(now = new Date()): Date {
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return new Date(Date.UTC(jst.getUTCFullYear(), jst.getUTCMonth(), 1) - 9 * 60 * 60 * 1000);
}

/** 若者の連絡先を消すまでの期間（見学の実施、または不成立から1年）。 */
export const ERASE_AFTER_MS = 365 * 24 * 60 * 60 * 1000;
