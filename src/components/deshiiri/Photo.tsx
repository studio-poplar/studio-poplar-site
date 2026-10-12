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
  // 千社札: vertical job name in the top-left corner. kaki = the 特集 colour.
  fuda?: string;
  fudaKaki?: boolean;
  priority?: boolean;
  className?: string;
};

// Until the real photo is in /public, show a plain placeholder with the alt text, so pages
// can be built and reviewed before the shoot.
function exists(src: string) {
  return fs.existsSync(path.join(process.cwd(), "public", src));
}

export default function Photo({ src, alt, ratio, sizes, fuda, fudaKaki, priority, className }: Props) {
  const hasImage = !!src && exists(src);
  return (
    <div className={`${styles.frame} ${className ?? ""}`} style={{ aspectRatio: ratio }}>
      {hasImage ? (
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={styles.img} />
      ) : (
        <div className={styles.placeholder} role="img" aria-label={`写真：${alt}`}>
          <span>写真：{alt}</span>
        </div>
      )}
      {fuda && <Fuda label={fuda} kaki={fudaKaki} />}
    </div>
  );
}

export function Fuda({ label, kaki }: { label: string; kaki?: boolean }) {
  return <span className={`${styles.fuda} ${kaki ? styles.fudaKaki : ""}`}>{label}</span>;
}
