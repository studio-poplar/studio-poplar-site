import type { Metadata } from "next";
import PageMasthead from "@/components/PageMasthead";
import BlogPostFull from "@/components/BlogPostFull";
import CtaBand from "@/components/CtaBand";
import { blogPosts } from "@/data/blog";

export const metadata: Metadata = {
  title: "BLOG",
  description: "Studio Poplarのブログ。WEB制作・3Dモデリング活用WEB制作・アプリ制作に関する考え方や事例をお届けします。",
};

export default function BlogPage() {
  return (
    <>
      <PageMasthead eyebrow="NOTES" title="BLOG" description="制作の考え方や事例、Studio Poplarの視点をお届けします。" />

      <section className="section" style={{ borderBottom: "none" }}>
        <div className="wrap" style={{ maxWidth: 720 }}>
          {blogPosts.map((post) => (
            <BlogPostFull key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <CtaBand />
    </>
  );
}
