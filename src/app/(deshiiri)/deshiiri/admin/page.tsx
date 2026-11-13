import SectionHead from "@/components/deshiiri/SectionHead";
import { requireAdminPage } from "@/lib/deshiiri/admin-auth";
import { count, gte } from "drizzle-orm";
import { db, schema } from "@/lib/deshiiri/db";
import { envStatus } from "@/lib/deshiiri/env";
import { LIMITS, monthStartJst } from "@/lib/deshiiri/usage-rules";
import { logout } from "./actions";
import Link from "next/link";
import Checks from "./Checks";
import RichMenu from "./RichMenu";
import Migrate from "./Migrate";
import styles from "./admin.module.css";

export default async function AdminHome() {
  const email = await requireAdminPage();
  const status = envStatus();
  // 月150通を超えたら、ここに警告を出す（指示書 6章）。DB がまだないときは数えない。
  const pushes = await db()
    .select({ n: count() })
    .from(schema.pushLog)
    .where(gte(schema.pushLog.sentAt, monthStartJst()))
    .then((r) => r[0]?.n ?? 0)
    .catch(() => 0);

  return (
    <div className={`d-wrap ${styles.page}`}>
      <SectionHead as="h1" eyebrow="EDITORS" title="編集部" />
      <div className={styles.meta}>
        <span>{email} でログイン中</span>
        <form action={logout}>
          <button type="submit" className={`${styles.button} ${styles.ghost}`}>
            ログアウト
          </button>
        </form>
      </div>

      {pushes > LIMITS.pushWarn ? (
        <p className={styles.alert} role="alert">
          LINE のプッシュが今月 {pushes} 通です（無料は {LIMITS.pushFree} 通まで）。<Link href="/deshiiri/admin/ops">運用</Link>
        </p>
      ) : null}

      <nav className={styles.nav} aria-label="編集部の画面">
        <Link href="/deshiiri/admin/review">確認待ち</Link>
        <Link href="/deshiiri/admin/craftspeople">職人と招待コード</Link>
        <Link href="/deshiiri/admin/works">届いた投稿</Link>
        <Link href="/deshiiri/admin/visits">見学の進行</Link>
        <Link href="/deshiiri/admin/recent">最近の投稿を並べて見る</Link>
        <Link href="/deshiiri/admin/ops">運用（容量・バックアップ）</Link>
      </nav>

      <section className={styles.section}>
        <h2>LINE</h2>
        <p className={styles.note}>
          LINE の受付窓口の URL は <code>/deshiiri/api/line/webhook</code> です。リッチメニューは、つなぎ先の LINE ごとに1回設定します。
        </p>
        <RichMenu />
      </section>

      <section className={styles.section}>
        <h2>接続の状態</h2>
        <p className={styles.note}>環境変数が入っているかだけを表示します（値は表示しません）。</p>
        <table className={styles.table}>
          <tbody>
            {status.map((s) => (
              <tr key={s.service}>
                <th scope="row">{s.service}</th>
                <td>
                  <div className={styles.vars}>
                    {s.vars.map((v) => (
                      <span key={v.name} className={v.set ? styles.ok : styles.ng}>
                        {v.set ? "✓" : "×"} {v.name}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className={styles.section}>
        <h2>データベースの表</h2>
        <p className={styles.note}>
          コードに入っている表の形（drizzle/ のマイグレーション）を Neon に当てます。何度押しても、当て済みのものは飛ばします。
        </p>
        <Migrate />
      </section>

      <section className={styles.section}>
        <h2>つないで確かめる</h2>
        <p className={styles.note}>
          Neon・R2・ドライブ・Resend・Sentry に実際につなぎます。R2 とドライブには確認用のファイルを置いてすぐ消し、Resend はログイン中のアドレスに確認メールを1通、Sentry にはテストの知らせを1件送ります。
        </p>
        <Checks />
      </section>
    </div>
  );
}
