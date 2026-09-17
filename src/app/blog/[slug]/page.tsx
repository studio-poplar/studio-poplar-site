import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogDetailHero from "@/components/BlogDetailHero";
import MarkdownBody from "@/components/MarkdownBody";
import ContactCTA from "@/components/ContactCTA";
import { getAllBlogPosts, getBlogPostBySlug } from "@/lib/content";
import styles from "./page.module.css";

export function generateStaticParams() {
  return getAllBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const metaItems = [post.date.replaceAll("-", "."), post.location, post.shootingNote].filter(Boolean);

  return (
    <>
      <BlogDetailHero post={post} />

      <div className={`wrap ${styles.meta}`} style={{ maxWidth: 700 }}>
        {metaItems.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>

      <div className={`wrap ${styles.body}`} style={{ maxWidth: 660 }}>
        <MarkdownBody content={post.content} series={post.series} />
      </div>

      <div className={`wrap ${styles.footer}`} style={{ maxWidth: 660 }}>
        <ContactCTA text={post.ctaText} />
      </div>
    </>
  );
}
