import type { Metadata } from "next";
import SectionHead from "@/components/deshiiri/SectionHead";
import { isTokenShape } from "@/lib/deshiiri/visits/rules";
import { findByConsentToken } from "@/lib/deshiiri/visits/service";
import { tradeLabel } from "@/lib/deshiiri/trades";
import ConsentForm from "./ConsentForm";
import styles from "../../../p/[slug]/page.module.css";

// 保護者の同意（18歳未満の見学）。メールのリンクから開く。GET では何も変えない（メールの安全確認が先に開くことがあるため）。
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: { absolute: "見学への参加の同意｜デシイリ" },
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default async function ConsentPage({ params }: PageProps<"/deshiiri/visit/consent/[token]">) {
  const { token } = await params;
  const row = isTokenShape(token) ? await findByConsentToken(token) : null;

  return (
    <div className={`d-wrap ${styles.page}`}>
      <SectionHead as="h1" eyebrow="CONSENT" title="見学への参加の同意" />
      {!row ? (
        <p className={styles.note}>このリンクは使えません。申し込みが取り消されたか、リンクが正しくありません。</p>
      ) : (
        <>
          <p className={styles.lead}>
            {row.visit.name}さんから、デシイリを通じて職人の仕事場の見学の申し込みがありました。
            18歳未満のため、保護者の方の同意をいただいてから職人さんにお届けします。
          </p>
          <dl className={styles.facts}>
            <div>
              <dt>職人</dt>
              <dd>
                {row.person.displayName}さん（{row.person.area}の{tradeLabel(row.person.trade)}）
              </dd>
            </div>
            <div>
              <dt>申し込んだ人</dt>
              <dd>
                {row.visit.name}
                {row.visit.schoolOrJob ? `（${row.visit.schoolOrJob}）` : ""}
              </dd>
            </div>
            <div>
              <dt>希望の時期</dt>
              <dd>{row.visit.wishes.join("／")}</dd>
            </div>
            {row.visit.message ? (
              <div>
                <dt>ひとこと</dt>
                <dd>{row.visit.message}</dd>
              </div>
            ) : null}
          </dl>
          <ul className={styles.terms}>
            <li>同意すると、申し込みが職人さんの LINE に届きます。</li>
            <li>職人さんが「受ける」と返事をしたときだけ、本人と保護者の方のメールアドレスを職人さんに伝えます。</li>
            <li>日にちは、職人さんと本人・保護者の方とでメールで決めます。見学のときは、職人さんの指示に従ってください。</li>
          </ul>
          {row.visit.status === "waiting_guardian" ? (
            <ConsentForm token={token} name={row.visit.name} craftsperson={row.person.displayName} />
          ) : (
            <p className={styles.note}>この申し込みは、すでにお返事済みか、受付が終わっています。</p>
          )}
        </>
      )}
    </div>
  );
}
