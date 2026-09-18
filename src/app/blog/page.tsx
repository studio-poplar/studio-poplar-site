import type { Metadata } from "next";
import PageMasthead from "@/components/PageMasthead";
import BlogCard from "@/components/BlogCard";
import CtaBand from "@/components/CtaBand";
import { getAllBlogPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "BLOG",
  description: "Studio Poplarのブログ。地域訪問での気づきや、制作の考え方をお届けします。",
};

export default function BlogPage() {
  const posts = getAllBlogPosts();

  return (
    <>
      <PageMasthead
        eyebrow="BLOG"
        title="活動と、考えていること。"
        description="訪れた地域で見つけたこと、制作の裏側で考えていること。お知らせはNEWSにまとめています。"
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
