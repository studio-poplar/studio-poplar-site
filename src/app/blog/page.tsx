import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import BlogCard from "@/components/BlogCard";
import CtaBand from "@/components/CtaBand";
import { blogPosts } from "@/data/blog";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "BLOG",
  description: "Studio Poplarのブログ。WEB制作・3Dモデリング活用WEB制作・アプリ制作に関する考え方や事例をお届けします。",
};

export default function BlogPage() {
  return (
    <>
      <PageHero
        index="BLOG"
        eyebrow="NOTES"
        title="BLOG"
        description="制作の考え方や事例、Studio Poplarの視点をお届けします。"
      />

      <section className="section" style={{ borderBottom: "none" }}>
        <div className="wrap">
          <div className={styles.grid}>
            {blogPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
