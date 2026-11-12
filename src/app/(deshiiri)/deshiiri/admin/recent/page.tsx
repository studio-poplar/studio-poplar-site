import { desc, eq, inArray } from "drizzle-orm";
import Link from "next/link";
import SectionHead from "@/components/deshiiri/SectionHead";
import { requireAdminPage } from "@/lib/deshiiri/admin-auth";
import { db, schema } from "@/lib/deshiiri/db";
import { TEMPLATE_GUIDE } from "@/lib/deshiiri/writing/templates";
import { firstSentence, repeatedPhrases } from "@/lib/deshiiri/writing/similar";
import styles from "../admin.module.css";

// 最近の投稿を並べて見る（M5）：文章が似てきていないかを見比べる。公開済みと本人の確認待ちを新しい順に 12 本。

const SHOW = 12;

export default async function RecentPage() {
  await requireAdminPage();
  const { works, craftspeople } = schema;
  const rows = await db()
    .select({
      id: works.id,
      title: works.publicTitle,
      body: works.publicBody,
      template: works.template,
      status: works.status,
      at: works.updatedAt,
      name: craftspeople.displayName,
    })
    .from(works)
    .innerJoin(craftspeople, eq(craftspeople.id, works.craftspersonId))
    .where(inArray(works.status, ["published", "owner_review"]))
    .orderBy(desc(works.updatedAt))
    .limit(SHOW);

  const bodies = rows.map((r) => r.body ?? "");
  const phrases = repeatedPhrases(bodies, { minDocs: Math.max(2, Math.ceil(rows.length / 4)) });
  const templates = Object.entries(
    rows.reduce<Record<string, number>>((acc, r) => {
      const k = r.template ? TEMPLATE_GUIDE[r.template].label : "（なし）";
      acc[k] = (acc[k] ?? 0) + 1;
      return acc;
    }, {}),
  );

  return (
    <div className={`d-wrap ${styles.page}`}>
      <p className={styles.crumb}>
        <Link href="/deshiiri/admin">編集部</Link> / 最近の投稿を並べて見る
      </p>
      <SectionHead as="h1" eyebrow="RECENT" title="最近の投稿を並べて見る" />
      <p className={styles.note}>
        公開済みと本人の確認待ちを、新しい順に {SHOW} 本まで並べます。書き出し・型・よく出る言い回しが偏っていないかを見てください。
      </p>

      <section className={styles.section}>
        <h2>型の内訳</h2>
        <p>{templates.map(([k, n]) => `${k} ${n}`).join("・") || "まだありません"}</p>
      </section>

      <section className={styles.section}>
        <h2>何本にも出てくる言い回し</h2>
        {phrases.length ? (
          <ul className={styles.phrases}>
            {phrases.map((p) => (
              <li key={p.phrase}>
                「{p.phrase}」<small>{p.docs} 本</small>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.note}>目立つものはありません。</p>
        )}
      </section>

      <section className={styles.section}>
        <h2>書き出し</h2>
        <ol className={styles.openers}>
          {rows.map((r) => (
            <li key={r.id}>
              {firstSentence(r.body ?? "")} <small>— {r.name}</small>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.section}>
        <h2>本文</h2>
        <div className={styles.compare}>
          {rows.map((r) => (
            <article key={r.id} className={styles.card}>
              <h3>
                <Link href={`/deshiiri/admin/review/${r.id}`}>{r.title}</Link>
                <small>
                  {r.name}・{r.template ? TEMPLATE_GUIDE[r.template].label : "型なし"}・{r.status === "published" ? "公開中" : "本人の確認待ち"}
                </small>
              </h3>
              <p>{r.body}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
