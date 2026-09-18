import type { Metadata } from "next";
import PageMasthead from "@/components/PageMasthead";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "PRIVACY POLICY",
  description: "Studio Poplarのプライバシーポリシー。取得する個人情報の範囲と利用目的についてご案内します。",
};

export default function PrivacyPage() {
  return (
    <>
      <PageMasthead eyebrow="PRIVACY POLICY" title="プライバシーポリシー" />

      <section className="section" style={{ borderBottom: "none" }}>
        <div className="wrap">
          <div className={styles.body}>
            <p>
              Studio Poplar（以下「当スタジオ」）は、お問い合わせフォームおよびAIヒアリングチャットを通じてご提供いただく個人情報を、以下の方針に基づき適切に取り扱います。
            </p>

            <h2>1. 取得する情報</h2>
            <p>
              お問い合わせフォームでは、お名前・会社名（任意）・メールアドレス・お問い合わせ内容を取得します。AIヒアリングチャットでは、チャット内でご入力いただいた回答内容を取得します。
            </p>

            <h2>2. 利用目的</h2>
            <p>取得した情報は、お問い合わせへの回答、ご相談内容の把握、打ち合わせのご案内のためにのみ利用します。</p>

            <h2>3. 第三者提供</h2>
            <p>法令に基づく場合を除き、ご本人の同意なく取得した情報を第三者に提供することはありません。</p>

            <h2>4. 外部サービスの利用</h2>
            <p>
              お問い合わせフォームおよびAIヒアリングチャットの送信内容は、フォーム送信・通知サービスFormspree（Formspree, Inc.）を経由して当スタジオに届きます。AIヒアリングチャットの自由記述への応答生成には、Anthropic
              PBCが提供するAPIを利用しています。また、サイトの利用状況把握のためGoogle
              Analyticsを利用しており、これに伴いCookieが使用される場合があります。各サービスの取り扱いについては、それぞれの事業者のプライバシーポリシーもご参照ください。
            </p>

            <h2>5. 開示・訂正・削除等のご請求</h2>
            <p>
              ご本人から、取得した個人情報の開示・訂正・削除等のご請求があった場合、ご本人確認の上、合理的な範囲で速やかに対応します。ご希望の際は下記お問い合わせ窓口までご連絡ください。
            </p>

            <h2>6. お問い合わせ窓口</h2>
            <p>
              本ポリシーに関するお問い合わせは、
              <a href="mailto:info@studiopoplar.com">info@studiopoplar.com</a>
              または<a href="/contact">お問い合わせフォーム</a>よりご連絡ください。
            </p>

            <h2>7. 改定について</h2>
            <p>本ポリシーの内容は、必要に応じて予告なく変更する場合があります。変更後の内容は本ページに掲載した時点で効力を生じるものとします。</p>

            <p className={styles.updated}>最終更新日：2026年9月19日</p>
          </div>
        </div>
      </section>
    </>
  );
}
