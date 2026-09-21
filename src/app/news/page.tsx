import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import PageMasthead from "@/components/PageMasthead";
import NewsRow from "@/components/NewsRow";
import CtaBand from "@/components/CtaBand";
import { getAllNewsPosts } from "@/lib/content";

export const metadata: Metadata = pageMetadata({
  title: "お知らせ",
  description: "Studio Poplarからのお知らせ。サービス変更・営業案内などをまとめています。",
  path: "/news",
});

export default function NewsPage() {
  const newsList = getAllNewsPosts();

  return (
    <>
      <PageMasthead eyebrow="NEWS" title="お知らせ" description="サービスや営業に関するお知らせをまとめています。" />

      <section className="section" style={{ borderBottom: "none" }}>
        <div className="wrap" style={{ maxWidth: 760 }}>
          {newsList.length > 0 ? (
            newsList.map((news) => <NewsRow key={news.slug} news={news} />)
          ) : (
            <p>現在お知らせはありません。</p>
          )}
        </div>
      </section>

      <CtaBand />
    </>
  );
}
