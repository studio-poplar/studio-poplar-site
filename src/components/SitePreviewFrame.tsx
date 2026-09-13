import styles from "./SitePreviewFrame.module.css";

type SitePreviewFrameProps = {
  url: string;
  label: string;
};

export default function SitePreviewFrame({ url, label }: SitePreviewFrameProps) {
  return (
    <div className={styles.frame}>
      <div className={styles.bar}>
        <span className={styles.dots}>
          <span />
          <span />
          <span />
        </span>
        <span className={styles.urlLabel}>{label}</span>
      </div>
      <div className={styles.viewport}>
        <iframe src={url} title={label} loading="lazy" tabIndex={-1} aria-hidden="true" />
      </div>
    </div>
  );
}
