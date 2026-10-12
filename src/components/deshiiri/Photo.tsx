import fs from "fs";
import path from "path";
import Image from "next/image";
import styles from "./Photo.module.css";

type Props = {
  src: string | null | undefined;
  alt: string;
  // CSS aspect-ratio, e.g. "4 / 3"
  ratio: string;
  sizes: string;
  priority?: boolean;
  className?: string;
};

// Until the real photo is in /public, show a plain placeholder with the alt text, so pages
// can be built and reviewed before the shoot.
// Photos of イメージ案 content (paths under /deshiiri/…/sample-*) are AI-generated stand-ins;
// they carry a small label so nobody takes them for real photographs.
const isSampleImage = (src: string) => /\/deshiiri\/[^/]+\/sample-/.test(src);

function exists(src: string) {
  return fs.existsSync(path.join(process.cwd(), "public", src));
}

export default function Photo({ src, alt, ratio, sizes, priority, className }: Props) {
  const hasImage = !!src && exists(src);
  return (
    <div className={`${styles.frame} ${className ?? ""}`} style={{ aspectRatio: ratio }}>
      {hasImage ? (
        <>
          <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={styles.img} />
          {isSampleImage(src) && <span className={styles.aiLabel}>AI生成のイメージ</span>}
        </>
      ) : (
        <div className={styles.placeholder} role="img" aria-label={`写真：${alt}`}>
          <span>写真：{alt}</span>
        </div>
      )}
    </div>
  );
}
