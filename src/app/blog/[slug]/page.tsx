import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { pageMetadata, siteUrl, SITE_NAME } from "@/lib/seo";
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
  return pageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    type: "article",
    publishedTime: post.date,
    tags: post.tags,
  });
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const metaItems = [post.date.replaceAll("-", "."), post.location, post.shootingNote].filter(Boolean);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    inLanguage: "ja",
    keywords: post.tags,
    mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
    author: { "@type": "Organization", name: SITE_NAME, url: siteUrl },
    publisher: { "@type": "Organization", name: SITE_NAME, url: siteUrl },
  };

  return (
    <>
      <JsonLd data={articleJsonLd} />
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
