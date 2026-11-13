import { notFound } from "next/navigation";
import SectionHead from "@/components/deshiiri/SectionHead";
import { RULES_PAGES, rulesVisible } from "@/lib/deshiiri/rules-pages";
import { deshiiriMetadata } from "@/lib/deshiiri/seo";
import styles from "../../p/[slug]/page.module.css";

// 利用規約・プライバシーポリシー・見学の同意事項（M5）。本文が届くまでは仮の文で、本番では出さない。
export const dynamicParams = false;
export function generateStaticParams() {
  return RULES_PAGES.map((p) => ({ page: p.slug }));
}

const find = (slug: string) => RULES_PAGES.find((p) => p.slug === slug);

export async function generateMetadata({ params }: PageProps<"/deshiiri/rules/[page]">) {
  const page = find((await params).page);
  if (!page || !rulesVisible()) return { title: { absolute: "ページが見つかりません｜デシイリ" } };
  return deshiiriMetadata({ title: page.title, description: page.lead, path: `/deshiiri/rules/${page.slug}`, noindex: page.draft || !rulesVisible() });
}

export default async function RulesPage({ params }: PageProps<"/deshiiri/rules/[page]">) {
  const page = find((await params).page);
  if (!page || !rulesVisible()) notFound();
  return (
    <div className={`d-wrap ${styles.page}`}>
      <SectionHead as="h1" eyebrow="RULES" title={page.title} />
      {page.draft ? (
        <p className={styles.draft} role="note">
          これは仮の文です。本文が届くまで、本番では表示しません。
        </p>
      ) : null}
      <p className={styles.lead}>{page.lead}</p>
      {page.sections.map((s) => (
        <section key={s.heading} className={styles.rule}>
          <h2>{s.heading}</h2>
          {s.body.map((b) => (
            <p key={b}>{b}</p>
          ))}
        </section>
      ))}
      <p className={styles.note}>更新日：{page.updated}</p>
    </div>
  );
}
