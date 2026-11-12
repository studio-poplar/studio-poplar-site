import Link from "next/link";
import { notFound } from "next/navigation";
import SectionHead from "@/components/deshiiri/SectionHead";
import { getPublicPerson } from "@/lib/deshiiri/public-queries";
import { deshiiriMetadata } from "@/lib/deshiiri/seo";
import { tradeLabel } from "@/lib/deshiiri/trades";
import VisitForm from "./VisitForm";
import styles from "../page.module.css";

// S-3 見学の申し込み。フォームのページは検索に出さない。
export const dynamicParams = true;
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: PageProps<"/deshiiri/p/[slug]/visit">) {
  const { slug } = await params;
  const data = await getPublicPerson(slug);
  if (!data) return { title: { absolute: "ページが見つかりません｜デシイリ" } };
  return deshiiriMetadata({
    title: `${data.person.displayName}さんの仕事場を見学する`,
    description: `${data.person.area}の${tradeLabel(data.person.trade)}、${data.person.displayName}さんへの見学の申し込み。`,
    path: `/deshiiri/p/${slug}/visit`,
    noindex: true,
  });
}

export default async function VisitPage({ params }: PageProps<"/deshiiri/p/[slug]/visit">) {
  const { slug } = await params;
  const data = await getPublicPerson(slug);
  if (!data) notFound();
  const { person } = data;

  return (
    <div className={`d-wrap ${styles.page}`}>
      <p className={styles.back}>
        <Link href={`/deshiiri/p/${person.slug}`}>← {person.displayName}さんのページへ</Link>
      </p>
      <SectionHead as="h1" eyebrow="VISIT" title={`${person.displayName}さんの仕事場を見学する`} />
      {person.visitOpen ? (
        <>
          <p className={styles.lead}>
            {person.area}の{tradeLabel(person.trade)}、{person.displayName}さんへの見学の申し込みです。
            {person.displayName}さんの LINE に届き、「受ける」と返事があれば、{person.displayName}さんからメールで日にちの相談が届きます。
          </p>
          <VisitForm slug={person.slug} name={person.displayName} />
        </>
      ) : (
        <p className={styles.note}>ただいま受付を休んでいます。</p>
      )}
    </div>
  );
}
