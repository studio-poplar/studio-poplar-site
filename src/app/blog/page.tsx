import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import PageMasthead from "@/components/PageMasthead";
import BlogCard from "@/components/BlogCard";
import CtaBand from "@/components/CtaBand";
import { getAllBlogPosts } from "@/lib/content";

export const metadata: Metadata = pageMetadata({
  title: "ブログ｜制作の記録と設計メモ",
  description:
    "Studio Poplarのブログ。サイト・アプリ・写真や映像の制作で、実際に検証したことと、設計上の判断を記録しています。",
  path: "/blog",
});

export default function BlogPage() {
  const posts = getAllBlogPosts();

  return (
    <>
      <PageMasthead
        eyebrow="BLOG"
        title="制作の記録と、設計のメモ。"
        description="サイト・アプリ・写真や映像の制作で、実際に検証したことと、設計上の判断を記録しています。お知らせはNEWSにまとめています。"
      />

      <section className="section" style={{ borderBottom: "none" }}>
        <div className="wrap" style={{ maxWidth: 900 }}>
          {posts.length > 0 ? (
            posts.map((post) => <BlogCard key={post.slug} post={post} />)
          ) : (
            <p>まだ記事がありません。</p>
          )}
        </div>
      </section>

      <CtaBand />
    </>
  );
}
