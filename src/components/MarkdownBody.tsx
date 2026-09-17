import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { BlogSeries } from "@/lib/blog-types";
import PullQuote from "./PullQuote";
import styles from "./MarkdownBody.module.css";

type MarkdownBodyProps = {
  content: string;
  series?: BlogSeries;
};

export default function MarkdownBody({ content, series }: MarkdownBodyProps) {
  return (
    <div className={styles.body}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          blockquote: ({ children }) => <PullQuote series={series}>{children}</PullQuote>,
          img: ({ src, alt }) =>
            typeof src === "string" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={src} alt={alt || ""} loading="lazy" className={styles.img} />
            ) : null,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
