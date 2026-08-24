import { Work, WORK_CATEGORY_LABELS } from "@/data/works";
import WorkTypeBadge from "./WorkTypeBadge";
import styles from "./WorkPostFull.module.css";

export default function WorkPostFull({ work }: { work: Work }) {
  return (
    <article id={work.slug} className={styles.post}>
      <div className={styles.thumb} data-category={work.category}>
        <WorkTypeBadge type={work.type} />
        <span className="en">{work.thumbLabel}</span>
      </div>
      <div className={styles.meta}>
        <span className={`en ${styles.cat}`}>{WORK_CATEGORY_LABELS[work.category]}</span>
        <span>
          {work.client} / {work.year}
        </span>
      </div>
      <h2 className={styles.title}>{work.title}</h2>
      <p className={styles.overview}>{work.overview}</p>
      <div className={styles.story}>
        {work.sections.map((section) => (
          <div key={section.heading}>
            <h3>{section.heading}</h3>
            <p>{section.body}</p>
          </div>
        ))}
      </div>
    </article>
  );
}
