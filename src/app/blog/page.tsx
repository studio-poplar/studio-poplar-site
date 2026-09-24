import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import PageMasthead from "@/components/PageMasthead";
import BlogCard from "@/components/BlogCard";
import CtaBand from "@/components/CtaBand";
import { getAllBlogPosts } from "@/lib/content";

export const metadata: Metadata = pageMetadata({
  title: "ブログ｜デザインの定説を検証する",
  description:
    "Studio Poplarのブログ。配色・比率・心理学など、デザインの世界でよく語られる話を、実在する研究や一次資料にあたって検証しています。",
  path: "/blog",
});

export default function BlogPage() {
  const posts = getAllBlogPosts();

  return (
    <>
      <PageMasthead
        eyebrow="BLOG"
        title="デザインの定説を、検証する。"
        description="配色・比率・心理学など、デザインの世界でよく語られる話を、実在する研究や一次資料にあたって確かめています。お知らせはNEWSにまとめています。"
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
