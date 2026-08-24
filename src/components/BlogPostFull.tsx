import { BlogPost } from "@/data/blog";
import styles from "./BlogPostFull.module.css";

export default function BlogPostFull({ post }: { post: BlogPost }) {
  return (
    <article id={post.slug} className={styles.post}>
      <div className={styles.meta}>
        <span className={`en ${styles.cat}`}>{post.category}</span>
        <time className="en" dateTime={post.date}>
          {post.date}
        </time>
      </div>
      <h2 className={styles.title}>{post.title}</h2>
      {post.body.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </article>
  );
}
