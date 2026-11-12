import { asc, eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import SectionHead from "@/components/deshiiri/SectionHead";
import { requireAdminPage } from "@/lib/deshiiri/admin-auth";
import { db, schema } from "@/lib/deshiiri/db";
import { tradeLabel } from "@/lib/deshiiri/trades";
import { checkDraft, DraftOutput } from "@/lib/deshiiri/writing/draft";
import { TEMPLATE_GUIDE } from "@/lib/deshiiri/writing/templates";
import ReviewForm from "./ReviewForm";
import styles from "../../admin.module.css";

// 「今すぐ下書きを作る」は Claude の応答を待つので長めに。
export const maxDuration = 120;

const STATUS: Record<string, string> = {
  received: "受け取り",
  drafting: "下書き中",
  editor_review: "編集部の確認待ち",
  owner_review: "本人の確認待ち",
  published: "公開中",
  returned: "差し戻し",
  withdrawn: "取り下げ",
};

export default async function ReviewPage({ params }: PageProps<"/deshiiri/admin/review/[id]">) {
  await requireAdminPage();
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  const [row] = await db()
    .select({ work: schema.works, person: schema.craftspeople })
    .from(schema.works)
    .innerJoin(schema.craftspeople, eq(schema.craftspeople.id, schema.works.craftspersonId))
    .where(eq(schema.works.id, id))
    .limit(1);
  if (!row) notFound();
  const { work, person } = row;
  const photos = await db().select().from(schema.workPhotos).where(eq(schema.workPhotos.workId, id)).orderBy(asc(schema.workPhotos.sort));

  const draft = work.draft
    ? DraftOutput.safeParse({
        template: work.template ?? "none",
        title: work.publicTitle ?? work.draft.title,
        body: work.publicBody ?? work.draft.body,
        alts: photos.map((p) => p.alt),
        editor_questions: [],
        instagram: work.instagramTexts ?? [],
      })
    : null;
  const problems = draft?.success ? checkDraft(draft.data, work.ownerWords, photos.length) : [];

  return (
    <div className={`d-wrap ${styles.page}`}>
      <p className={styles.crumb}>
        <Link href="/deshiiri/admin">編集部</Link> / <Link href="/deshiiri/admin/review">確認待ち</Link> / {person.displayName}
      </p>
      <SectionHead as="h1" eyebrow="REVIEW" title={person.displayName} />
      <p className={styles.note}>
        {tradeLabel(person.trade)}・{person.area}・{STATUS[work.status]}
        {work.template ? `・型：${TEMPLATE_GUIDE[work.template].label}` : ""}
        {work.returnReason ? `・差し戻し理由：${work.returnReason}` : ""}
      </p>

      <section className={styles.section}>
        <h2>本人の一言</h2>
        <p className={styles.words}>{work.ownerWords || "（一言はありません）"}</p>
      </section>

      {problems.length ? (
        <section className={styles.section}>
          <h2>機械で見つけた注意</h2>
          <ul className={styles.problems}>
            {problems.map((p, i) => (
              <li key={i} className={p.level === "error" ? styles.ng : undefined}>
                {p.message}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className={styles.section}>
        <h2>下書き</h2>
        {!work.draft && work.status !== "editor_review" ? <p className={styles.note}>まだ下書きはありません。</p> : null}
        <ReviewForm
          workId={work.id}
          status={work.status}
          title={work.publicTitle ?? ""}
          body={work.publicBody ?? ""}
          editorQuestions={work.editorQuestions ?? ""}
          photos={photos.map((p) => ({ id: p.id, src: `/deshiiri/img/${p.r2Key}`, alt: p.alt, width: p.width, height: p.height }))}
          instagram={work.instagramTexts ?? []}
        />
      </section>
    </div>
  );
}
