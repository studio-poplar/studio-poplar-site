import SectionHead from "@/components/deshiiri/SectionHead";
import { requireAdminPage } from "@/lib/deshiiri/admin-auth";
import { envStatus } from "@/lib/deshiiri/env";
import { logout } from "./actions";
import Link from "next/link";
import Checks from "./Checks";
import RichMenu from "./RichMenu";
import Migrate from "./Migrate";
import styles from "./admin.module.css";

export default async function AdminHome() {
  const email = await requireAdminPage();
  const status = envStatus();

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

      <nav className={styles.nav} aria-label="編集部の画面">
        <Link href="/deshiiri/admin/craftspeople">職人と招待コード</Link>
        <Link href="/deshiiri/admin/works">届いた投稿</Link>
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
