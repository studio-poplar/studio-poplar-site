import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import PageMasthead from "@/components/PageMasthead";
import BlogCard from "@/components/BlogCard";
import CtaBand from "@/components/CtaBand";
import { getAllBlogPosts } from "@/lib/content";

export const metadata: Metadata = pageMetadata({
  title: "ブログ｜つくりながら、学んだこと",
  description:
    "Studio Poplarのブログ。サイト・アプリ・写真や映像をつくる中で、実際に試して分かったことや、設計の考え方をまとめています。",
  path: "/blog",
});

export default function BlogPage() {
  const posts = getAllBlogPosts();

  return (
    <>
      <PageMasthead
        eyebrow="BLOG"
        title="つくりながら、学んだこと。"
        description="サイト・アプリ・写真や映像をつくる中で、実際に試して分かったことを書き留めています。お知らせはNEWSにまとめています。"
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
