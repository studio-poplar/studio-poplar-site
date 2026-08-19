import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import RegMarks from "@/components/RegMarks";
import CtaBand from "@/components/CtaBand";
import { blogPosts, getBlogPostBySlug } from "@/data/blog";
import styles from "./page.module.css";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(props: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return { title: "BLOG" };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: `${post.title}｜Studio Poplar`,
      description: post.excerpt,
    },
  };
}

export default async function BlogDetailPage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <section className={styles.hero}>
        <RegMarks />
        <div className="wrap">
          <Link href="/blog" className={styles.back}>
            ← BLOG一覧へ戻る
          </Link>
          <div className={`${styles.meta} mono`}>
            <span className={styles.category}>{post.category}</span>
            <time className={styles.date} dateTime={post.date}>
              {post.date}
            </time>
          </div>
          <h1 className={styles.title}>{post.title}</h1>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className={styles.body}>
            {post.body.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <div className={styles.footNav}>
            <Link href="/blog" className="btn-ghost">
              ← BLOG一覧へ戻る
            </Link>
            <Link href="/contact" className="btn-primary">
              お問い合わせ →
            </Link>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
