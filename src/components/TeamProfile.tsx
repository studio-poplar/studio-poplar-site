import styles from "./TeamProfile.module.css";

const STATS = [
  { num: "—", label: "準備中" },
  { num: "—", label: "準備中" },
  { num: "—", label: "準備中" },
];

const MEMBERS = [
  { role: "メンバー" },
  { role: "メンバー" },
];

export default function TeamProfile() {
  return (
    <div>
      <div className={styles.card}>
        <div className={styles.photo}>
          <svg className={styles.photoIcon} viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="14" r="7" stroke="currentColor" strokeWidth="1.4" />
            <path d="M6 34c1.5-8 7-12 14-12s12.5 4 14 12" stroke="currentColor" strokeWidth="1.4" />
          </svg>
          <span className={styles.photoLabel}>PHOTO coming soon</span>
        </div>

        <div>
          <span className={styles.role}>代表</span>
          <h3 className={styles.name}>プロフィール準備中</h3>
          <p className={styles.bio}>経歴・プロフィール文は現在ご用意中です。近日公開予定です。</p>

          <div className={styles.stats}>
            {STATS.map((stat, i) => (
              <div key={i}>
                <span className={styles.statNum}>{stat.num}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.miniGrid}>
        {MEMBERS.map((member, i) => (
          <div key={i} className={styles.miniCard}>
            <div className={styles.miniPhoto}>
              <svg className={styles.miniPhotoIcon} viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="14" r="7" stroke="currentColor" strokeWidth="1.4" />
                <path d="M6 34c1.5-8 7-12 14-12s12.5 4 14 12" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </div>
            <div>
              <span className={styles.miniRole}>{member.role}</span>
              <h4 className={styles.miniName}>プロフィール準備中</h4>
              <p className={styles.miniBio}>近日公開予定です。</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
