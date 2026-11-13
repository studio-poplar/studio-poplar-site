import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import SectionHead from "@/components/deshiiri/SectionHead";
import { requireAdminPage } from "@/lib/deshiiri/admin-auth";
import { db, schema } from "@/lib/deshiiri/db";
import EditForm from "./EditForm";
import styles from "../../admin.module.css";

const fmtDate = (d: Date) =>
  d.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo", year: "numeric", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" });

export default async function EditCraftspersonPage({ params }: PageProps<"/deshiiri/admin/craftspeople/[id]">) {
  await requireAdminPage();
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  const [p] = await db().select().from(schema.craftspeople).where(eq(schema.craftspeople.id, id)).limit(1);
  if (!p) notFound();
  return (
    <div className={`d-wrap ${styles.page}`}>
      <p className={styles.crumb}>
        <Link href="/deshiiri/admin">編集部</Link> / <Link href="/deshiiri/admin/craftspeople">職人</Link> / {p.displayName}
      </p>
      <SectionHead as="h1" eyebrow="CRAFTSPERSON" title={p.displayName} />
      <p className={styles.note}>
        短い名前（URL）：/p/{p.slug}（変えると職人ページの URL が変わるので、ここでは直せません）
      </p>
      <p className={styles.note}>
        <a href={`/deshiiri/p/${p.slug}`} target="_blank" rel="noopener">
          職人ページを開く
        </a>
        {" ／ "}
        <a href={`/deshiiri/admin/craftspeople/${p.id}/qr`} download>
          QR コード（PNG）を保存
        </a>
      </p>
      <EditForm
        id={p.id}
        displayName={p.displayName}
        shopName={p.shopName}
        trade={p.trade}
        area={p.area}
        intro={p.intro}
        proxyRegistrant={p.proxyRegistrant}
        featured={p.featured}
        foundingMember={p.foundingMember}
        consentAt={p.consentAt ? fmtDate(p.consentAt) : null}
        voiceNotes={p.voiceNotes}
        cardInfo={p.cardInfo}
      />
    </div>
  );
}
