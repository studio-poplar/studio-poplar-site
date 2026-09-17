import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MarkdownBody from "@/components/MarkdownBody";
import { getAllNewsPosts, getNewsPostBySlug } from "@/lib/content";
import styles from "./page.module.css";

export function generateStaticParams() {
  return getAllNewsPosts().map((news) => ({ slug: news.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const news = getNewsPostBySlug(slug);
  if (!news) return {};
  return { title: news.title };
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const news = getNewsPostBySlug(slug);
  if (!news) notFound();

  return (
    <div className={`wrap ${styles.detail}`} style={{ maxWidth: 620 }}>
      <h1 className={styles.title}>{news.title}</h1>
      <time className={`en ${styles.date}`} dateTime={news.date}>
        {news.date.replaceAll("-", ".")}
      </time>
      <MarkdownBody content={news.content} />
    </div>
  );
}
