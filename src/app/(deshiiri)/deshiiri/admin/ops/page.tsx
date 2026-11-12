import Link from "next/link";
import SectionHead from "@/components/deshiiri/SectionHead";
import { requireAdminPage } from "@/lib/deshiiri/admin-auth";
import { KEEP_BACKUPS } from "@/lib/deshiiri/backup";
import { ensureFolder, listFiles } from "@/lib/deshiiri/services/drive";
import { LIMITS, gb, mb, usageWarnings } from "@/lib/deshiiri/usage-rules";
import { measureUsage } from "@/lib/deshiiri/usage";
import { BackupButton, WarningButton } from "./OpsButtons";
import styles from "../admin.module.css";

// 運用：無料枠の使い具合・バックアップ。
export const maxDuration = 60;

async function safely<T>(f: () => Promise<T>): Promise<T | null> {
  try {
    return await f();
  } catch {
    return null;
  }
}

const fmt = (iso: string) =>
  new Date(iso).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" });

export default async function OpsPage() {
  await requireAdminPage();
  const [usage, backups] = await Promise.all([
    safely(measureUsage),
    safely(async () => (await listFiles(await ensureFolder("バックアップ"))).filter((f) => f.name.startsWith("deshiiri-backup_"))),
  ]);
  const warnings = usage ? usageWarnings(usage) : [];

  return (
    <div className={`d-wrap ${styles.page}`}>
      <p className={styles.crumb}>
        <Link href="/deshiiri/admin">編集部</Link> / 運用
      </p>
      <SectionHead as="h1" eyebrow="OPERATIONS" title="運用" />

      <section className={styles.section}>
        <h2>無料枠の使い具合</h2>
        {warnings.length ? (
          <div className={styles.error} role="alert">
            {warnings.map((w) => (
              <p key={w}>{w}</p>
            ))}
          </div>
        ) : null}
        {usage ? (
          <table className={styles.table}>
            <tbody>
              <tr>
                <th scope="row">LINE のプッシュ（今月）</th>
                <td>
                  {usage.pushes} 通 <span className={styles.note}>／ {LIMITS.pushWarn} 通を超えたら警告・無料は {LIMITS.pushFree} 通まで</span>
                </td>
              </tr>
              <tr>
                <th scope="row">写真の置き場（R2）</th>
                <td>
                  {mb(usage.r2Bytes)}（{usage.r2Objects} 個）<span className={styles.note}>／ {gb(LIMITS.r2WarnBytes)} で警告</span>
                </td>
              </tr>
              <tr>
                <th scope="row">データベース（Neon）</th>
                <td>
                  {mb(usage.neonBytes)} <span className={styles.note}>／ {gb(LIMITS.neonWarnBytes)} で警告</span>
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p className={styles.note}>数えられませんでした（接続の設定を確かめてください）。</p>
        )}
        <p className={styles.note}>毎日 9:00 に数え、決まりを超えていたら編集部（EDITOR_NOTIFY_EMAIL）にメールします。</p>
        <WarningButton />
      </section>

      <section className={styles.section}>
        <h2>バックアップ</h2>
        <p className={styles.note}>
          毎晩 3:00 に、データを共有ドライブ「デシイリ原本/バックアップ」に保存します（{KEEP_BACKUPS} 日分）。戻し方は <code>docs/deshiiri-restore.md</code>。
        </p>
        <BackupButton />
        {backups ? (
          backups.length ? (
            <table className={styles.table} style={{ marginTop: 16 }}>
              <tbody>
                {backups.slice(0, 7).map((b) => (
                  <tr key={b.id}>
                    <th scope="row">{b.name}</th>
                    <td>
                      {fmt(b.createdTime)}・{mb(b.size)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className={styles.note}>まだありません。</p>
          )
        ) : (
          <p className={styles.note}>ドライブを読めませんでした。</p>
        )}
      </section>
    </div>
  );
}
