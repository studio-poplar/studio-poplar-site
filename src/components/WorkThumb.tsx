import Image from "next/image";
import { Work, WORK_TYPE_LABELS } from "@/data/works";
import styles from "./WorkThumb.module.css";

export default function WorkThumb({ work, showBadge = true }: { work: Work; showBadge?: boolean }) {
  const host = work.url?.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const cover = work.cover;

  return (
    <div className={styles.thumb} data-category={work.category} data-cover={cover?.device}>
      {cover?.device === "desktop" && (
        <Image
          src={cover.srcs[0]}
          alt=""
          fill
          sizes="(min-width: 900px) 640px, 100vw"
          className={styles.shot}
          aria-hidden="true"
        />
      )}
      {cover?.device === "mobile" && (
        <>
          <span className={`en ${styles.ghost}`} aria-hidden="true">
            {work.thumbLabel.split(" ")[0]}
          </span>
          <div className={styles.phones} aria-hidden="true">
            {cover.srcs.map((src) => (
              <div key={src} className={styles.phone}>
                <Image src={src} alt="" fill sizes="200px" />
              </div>
            ))}
          </div>
        </>
      )}
      {!cover && work.url && (
        <div className={styles.chrome} aria-hidden="true">
          <i />
          <i />
          <i />
          <span>{host}</span>
          <b />
        </div>
      )}
      {!cover && !work.url && (
        <span className={`en ${styles.ghost}`} aria-hidden="true">
          {work.thumbLabel.split(" ")[0]}
        </span>
      )}
      {work.url && <span className={`en ${styles.live}`}>LIVE</span>}
      {showBadge && (
        <span className={`en ${styles.badge}`} data-type={work.type}>
          {WORK_TYPE_LABELS[work.type]}
        </span>
      )}
      <span className={`en ${styles.label}`}>{work.thumbLabel}</span>
    </div>
  );
}
