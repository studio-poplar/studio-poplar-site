import Image from "next/image";
import styles from "./TeamProfile.module.css";

type Person = {
  name: string;
  role: string;
  photo?: string;
};

const REPRESENTATIVE: Person & { nameEn: string; bio: string } = {
  name: "伊藤大起",
  nameEn: "Ito Daiki",
  role: "代表 / Web Creator",
  bio: "2021年、東証一部上場(当時)の人材会社にてキャリアをスタート。Web求人広告の運用や人材紹介を担当し、大手製造メーカーの採用を支援。その後、創業100年を超える電気機器メーカーの営業職を経験したのち、Studio Poplarを設立。個人事業主やスタートアップの課題解決を支援している。",
};

const MEMBERS: Person[] = [
  { name: "Asakura.J", role: "Photographer / Graphic Designer" },
  { name: "Tsubakihara.K", role: "Video Creator / Drone Pilot" },
];

function PhotoIcon({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <circle cx="20" cy="14" r="7" stroke="currentColor" strokeWidth="1.4" />
      <path d="M6 34c1.5-8 7-12 14-12s12.5 4 14 12" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export default function TeamProfile() {
  return (
    <div>
      <div className={styles.card}>
        <div className={`${styles.photo} ${REPRESENTATIVE.photo ? styles.hasPhoto : ""}`}>
          {REPRESENTATIVE.photo ? (
            <Image src={REPRESENTATIVE.photo} alt={REPRESENTATIVE.name} fill sizes="220px" className={styles.photoImg} />
          ) : (
            <PhotoIcon className={styles.photoIcon} />
          )}
        </div>

        <div>
          <span className={styles.role}>{REPRESENTATIVE.role}</span>
          <h3 className={styles.name}>
            {REPRESENTATIVE.name}
            <span className={`en ${styles.nameEn}`}>{REPRESENTATIVE.nameEn}</span>
          </h3>
          <p className={styles.bio}>{REPRESENTATIVE.bio}</p>
        </div>
      </div>

      <div className={styles.miniGrid}>
        {MEMBERS.map((member) => (
          <div key={member.name} className={styles.miniCard}>
            <div className={`${styles.miniPhoto} ${member.photo ? styles.hasPhoto : ""}`}>
              {member.photo ? (
                <Image src={member.photo} alt={member.name} fill sizes="72px" className={styles.photoImg} />
              ) : (
                <PhotoIcon className={styles.miniPhotoIcon} />
              )}
            </div>
            <div>
              <span className={styles.miniRole}>{member.role}</span>
              <h4 className={`en ${styles.miniName}`}>{member.name}</h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
