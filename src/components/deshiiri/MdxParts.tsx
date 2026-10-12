import type { ComponentProps, ReactNode } from "react";
import PhotoFrame from "./Photo";
import styles from "./MdxParts.module.css";

// Components available inside 記事 MDX (content/deshiiri/articles/*.mdx).

type PhotoProps = { src: string; alt: string; caption?: string };

export function Photo({ src, alt, caption }: PhotoProps) {
  return (
    <figure className={styles.photo}>
      <PhotoFrame src={src} alt={alt} ratio="3 / 2" sizes="(max-width: 880px) 100vw, 680px" />
      {caption && <figcaption className={styles.cap}>{caption}</figcaption>}
    </figure>
  );
}

export function WidePhoto({ src, alt, caption }: PhotoProps) {
  return (
    <figure className={`${styles.wide} ${styles.widePhoto}`}>
      <PhotoFrame src={src} alt={alt} ratio="16 / 9" sizes="(max-width: 1064px) 100vw, 1000px" />
      {caption && <figcaption className={styles.cap}>{caption}</figcaption>}
    </figure>
  );
}

export function TwoPhotos({ left, right }: { left: PhotoProps; right: PhotoProps }) {
  return (
    <div className={`${styles.wide} ${styles.two}`}>
      {[left, right].map((p) => (
        <figure key={p.src}>
          <PhotoFrame src={p.src} alt={p.alt} ratio="4 / 5" sizes="(max-width: 880px) 50vw, 430px" />
          {p.caption && <figcaption className={styles.cap}>{p.caption}</figcaption>}
        </figure>
      ))}
    </div>
  );
}

export function Technique({ title, children }: { title: string; children: ReactNode }) {
  return (
    <aside className={styles.technique}>
      <span className={`d-eyebrow ${styles.techLabel}`}>TECHNIQUE</span>
      <b className={styles.techTitle}>{title}</b>
      <div className={styles.techBody}>{children}</div>
    </aside>
  );
}

export function Quote({ by, children }: { by?: string; children: ReactNode }) {
  return (
    <figure className={styles.quote}>
      <blockquote className={styles.quoteText}>{children}</blockquote>
      {by && <figcaption className={styles.quoteBy}>{by}</figcaption>}
    </figure>
  );
}

export function Day({ items }: { items: { time: string; text: string }[] }) {
  return (
    <ol className={styles.day}>
      {items.map((item) => (
        <li key={item.time + item.text}>
          <time>{item.time}</time>
          <span>{item.text}</span>
        </li>
      ))}
    </ol>
  );
}

export function Honest({ children }: { children: ReactNode }) {
  return <div className={styles.honest}>{children}</div>;
}

function H2(props: ComponentProps<"h2">) {
  return <h2 {...props} className={styles.h2} />;
}

export const mdxComponents = { Photo, WidePhoto, TwoPhotos, Technique, Quote, Day, Honest, h2: H2 };
