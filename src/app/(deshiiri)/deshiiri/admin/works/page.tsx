import { desc, eq, inArray } from "drizzle-orm";
import Link from "next/link";
import SectionHead from "@/components/deshiiri/SectionHead";
import { requireAdminPage } from "@/lib/deshiiri/admin-auth";
import { db, schema } from "@/lib/deshiiri/db";
import styles from "../admin.module.css";

// M1 の確認用：LINE で届いた投稿の一覧。M2 で「確認待ち」（S-5）に育てる。

const STATUS: Record<string, string> = {
  received: "受け取り",
  drafting: "下書き中",
  editor_review: "編集部の確認待ち",
  owner_review: "本人の確認待ち",
  published: "公開中",
  returned: "差し戻し",
  withdrawn: "取り下げ",
};

const fmt = (d: Date) => d.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" });

export default async function WorksPage() {
  await requireAdminPage();
  const rows = await db()
    .select({ work: schema.works, person: schema.craftspeople })
    .from(schema.works)
    .innerJoin(schema.craftspeople, eq(schema.craftspeople.id, schema.works.craftspersonId))
    .orderBy(desc(schema.works.createdAt))
    .limit(50);
  const photos = rows.length
    ? await db()
        .select()
        .from(schema.workPhotos)
        .where(inArray(schema.workPhotos.workId, rows.map((r) => r.work.id)))
        .orderBy(schema.workPhotos.sort)
    : [];

  return (
    <div className={`d-wrap ${styles.page}`}>
      <p className={styles.crumb}>
        <Link href="/deshiiri/admin">編集部</Link> / 届いた投稿
      </p>
      <SectionHead as="h1" eyebrow="RECEIVED" title="届いた投稿" />
      <p className={styles.note}>LINE で届いた写真と一言です（新しい順に50件）。写真は保存に数秒かかります。</p>
      <div className={styles.cards}>
        {rows.length === 0 ? <p className={styles.note}>まだ届いていません。</p> : null}
        {rows.map(({ work, person }) => {
          const mine = photos.filter((p) => p.workId === work.id);
          return (
            <article key={work.id} className={styles.card}>
              <h3>
                {person.displayName} <small>{fmt(work.createdAt)}</small>
              </h3>
              <p className={styles.note}>
                {STATUS[work.status]}・写真 {mine.length}/{work.photoCount} 枚保存済み
                {mine.some((p) => !p.driveFileId) ? "・原本の保存に失敗したものがあります" : ""}
              </p>
              <p className={styles.words}>{work.ownerWords || "（一言はまだありません）"}</p>
              {mine.length ? (
                <div className={styles.thumbs}>
                  {mine.map((p) => (
                    // eslint-disable-next-line @next/next/no-img-element -- 非公開の写真なので next/image の最適化を通さない
                    <img key={p.id} src={`/deshiiri/img/${p.r2Key}`} alt="" width={p.width} height={p.height} loading="lazy" />
                  ))}
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}
