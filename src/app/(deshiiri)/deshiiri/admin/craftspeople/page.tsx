import Link from "next/link";
import SectionHead from "@/components/deshiiri/SectionHead";
import { requireAdminPage } from "@/lib/deshiiri/admin-auth";
import { tradeLabel } from "@/lib/deshiiri/trades";
import { issueInvite, listCraftspeople } from "./actions";
import NewCraftspersonForm from "./NewCraftspersonForm";
import styles from "../admin.module.css";

const fmt = (d: Date) => d.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" });

export default async function CraftspeoplePage() {
  await requireAdminPage();
  const people = await listCraftspeople();

  return (
    <div className={`d-wrap ${styles.page}`}>
      <p className={styles.crumb}>
        <Link href="/deshiiri/admin">編集部</Link> / 職人
      </p>
      <SectionHead as="h1" eyebrow="CRAFTSPEOPLE" title="職人" />

      <section className={styles.section}>
        <h2>職人を登録する</h2>
        <p className={styles.note}>登録したら招待コードを出し、職人に渡してください。職人は LINE でそのコードを送ると登録が終わります。</p>
        <NewCraftspersonForm />
      </section>

      <section className={styles.section}>
        <h2>登録済み（{people.length}人）</h2>
        {people.length === 0 ? <p className={styles.note}>まだいません。</p> : null}
        <div className={styles.cards}>
          {people.map((p) => {
            const invite = p.latestInvite;
            const inviteLive = p.inviteLive && invite;
            return (
              <article key={p.id} className={styles.card}>
                <h3>
                  {p.displayName}
                  {p.shopName ? <small>（{p.shopName}）</small> : null}
                </h3>
                <p className={styles.note}>
                  {tradeLabel(p.trade)}・{p.area}・/p/{p.slug}
                </p>
                <p>
                  LINE：{p.lineUserId ? <span className={styles.ok}>つながっています</span> : <span className={styles.ng}>まだです</span>}
                  {"　"}見学：{p.visitOpen ? "受付中" : "休止中"}
                </p>
                {!p.lineUserId ? (
                  <div className={styles.meta}>
                    {inviteLive ? (
                      <span>
                        招待コード <strong className={styles.code}>{invite.code}</strong>（{fmt(invite.expiresAt)} まで）
                      </span>
                    ) : null}
                    <form action={issueInvite.bind(null, p.id)}>
                      <button type="submit" className={`${styles.button} ${styles.ghost}`}>
                        {inviteLive ? "コードを出し直す" : "招待コードを出す"}
                      </button>
                    </form>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
