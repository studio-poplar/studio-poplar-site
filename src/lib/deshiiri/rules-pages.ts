// 利用規約・プライバシーポリシー・見学の同意事項（M5）。
// 本文は代表から届く。届くまでは「仮の文」で、本番では出さない（プレビューでだけ見られる）。
// 本文が届いたら sections を差し替え、draft を false にし、Vercel で DESHIIRI_RULES_PUBLIC=1 にする。

export type RulesPage = {
  slug: "terms" | "privacy" | "visit";
  title: string;
  draft: boolean;
  updated: string;
  lead: string;
  sections: { heading: string; body: string[] }[];
};

const TODO = "（仮の文です。代表から本文が届いたら差し替えます）";

export const RULES_PAGES: RulesPage[] = [
  {
    slug: "terms",
    title: "デシイリ 利用規約（職人の方へ）",
    draft: true,
    updated: "2026-11-12",
    lead: "LINE で写真と一言を送り、職人ページに載せるサービスの決まりです。",
    sections: [
      { heading: "このサービスでできること", body: [TODO, "写真と一言から編集部が文章を整え、本人の「OK」で職人ページに載せます。見学の申し込みが LINE に届きます。"] },
      { heading: "写真と文章の扱い", body: [TODO, "載せた写真と文章の権利、取り下げたときの扱い、Instagram への転載について。"] },
      { heading: "見学を受けるとき", body: [TODO, "見学中のけがや事故への備え、18歳未満の方を受けるときの決まり。"] },
      { heading: "料金", body: [TODO, "無料版の範囲と、有料版について。"] },
      { heading: "やめるとき・止めるとき", body: [TODO, "退会、ページの取り下げ、見学の受付の休止。"] },
    ],
  },
  {
    slug: "privacy",
    title: "デシイリ プライバシーポリシー（職人ページ・見学の申し込み）",
    draft: true,
    updated: "2026-11-12",
    lead: "職人ページと見学の申し込みで預かる情報の扱いです。",
    sections: [
      { heading: "預かる情報", body: [TODO, "職人：LINE の利用者 ID・名前・屋号・写真・一言。見学を申し込む方：名前・メールアドレス・18歳未満かどうか・保護者の名前とメールアドレス・学校や仕事・希望の時期・ひとこと。"] },
      { heading: "使いみち", body: [TODO, "職人ページを作るため。見学の申し込みを職人に届け、日にちの相談をつなぐため。"] },
      { heading: "職人に伝える情報", body: [TODO, "見学を申し込んだ方のメールアドレスは、職人が「受ける」と返事をしたときだけ職人に伝えます。"] },
      { heading: "外部のサービス", body: [TODO, "文章の下書きに Anthropic の Claude API を使います。渡すのは職人の写真・一言・職種・紹介文・話し方のメモだけで、見学を申し込んだ方の情報は渡しません。そのほか、LINE、Neon、Cloudflare R2、Google ドライブ、Resend、Sentry、Vercel を使います。"] },
      { heading: "消すまでの期間", body: [TODO, "見学を申し込んだ方の連絡先は、見学の実施（または不成立）から1年で消します。バックアップには最大30日残ります。"] },
      { heading: "問い合わせ", body: [TODO, "デシイリ編集部（Studio Poplar）。"] },
    ],
  },
  {
    slug: "visit",
    title: "見学の同意事項",
    draft: true,
    updated: "2026-11-12",
    lead: "職人の仕事場を見学するときに、申し込む方（18歳未満の方は保護者の方）に同意していただくことです。",
    sections: [
      { heading: "見学の中身", body: [TODO, "見学は仕事場を見せてもらうもので、働くことや雇われることではありません。"] },
      { heading: "安全のために", body: [TODO, "職人の指示に従うこと、服装、刃物や機械に近づかないこと。"] },
      { heading: "けがや事故のとき", body: [TODO, "保険の有無と範囲。"] },
      { heading: "18歳未満の方", body: [TODO, "保護者の方の同意をいただいてから職人に届けます。"] },
      { heading: "取りやめ", body: [TODO, "都合が悪くなったときの連絡のしかた。"] },
    ],
  },
];

/** 本番では、本文がそろって DESHIIRI_RULES_PUBLIC=1 にするまで出さない。プレビューでは見られる。 */
export const rulesVisible = () => process.env.VERCEL_ENV !== "production" || process.env.DESHIIRI_RULES_PUBLIC === "1";
