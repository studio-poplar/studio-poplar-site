import { desc, eq, inArray } from "drizzle-orm";
import Link from "next/link";
import SectionHead from "@/components/deshiiri/SectionHead";
import { requireAdminPage } from "@/lib/deshiiri/admin-auth";
import { db, schema } from "@/lib/deshiiri/db";
import styles from "../admin.module.css";

const fmt = (d: Date) => d.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" });

const GROUPS = [
  { status: "editor_review", label: "編集部の確認待ち" },
  { status: "received", label: "受け取り（夜 22 時に下書きを作ります）" },
  { status: "drafting", label: "下書き中" },
  { status: "owner_review", label: "本人の確認待ち" },
] as const;

export default async function ReviewListPage() {
  await requireAdminPage();
  const rows = await db()
    .select({ work: schema.works, person: schema.craftspeople })
    .from(schema.works)
    .innerJoin(schema.craftspeople, eq(schema.craftspeople.id, schema.works.craftspersonId))
    .where(inArray(schema.works.status, GROUPS.map((g) => g.status)))
    .orderBy(desc(schema.works.updatedAt))
    .limit(200);

  return (
    <div className={`d-wrap ${styles.page}`}>
      <p className={styles.crumb}>
        <Link href="/deshiiri/admin">編集部</Link> / 確認待ち
      </p>
      <SectionHead as="h1" eyebrow="REVIEW" title="確認待ち" />
      {GROUPS.map((g) => {
        const items = rows.filter((r) => r.work.status === g.status);
        return (
          <section key={g.status} className={styles.section}>
            <h2>
              {g.label}（{items.length}）
            </h2>
            {items.length === 0 ? <p className={styles.note}>ありません。</p> : null}
            <div className={styles.cards}>
              {items.map(({ work, person }) => (
                <Link key={work.id} href={`/deshiiri/admin/review/${work.id}`} className={`${styles.card} ${styles.cardLink}`}>
                  <h3>
                    {person.displayName} <small>{fmt(work.createdAt)}・写真 {work.photoCount} 枚</small>
                  </h3>
                  <p>{work.publicTitle ?? work.ownerWords.slice(0, 60) ?? "（一言なし）"}</p>
                  {work.editorQuestions ? <p className={styles.ng}>確認したいことがあります</p> : null}
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
