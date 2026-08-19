export type WorkCategory = "web" | "3dweb" | "app";

export const WORK_CATEGORY_LABELS: Record<WorkCategory, string> = {
  web: "WEB",
  "3dweb": "3D WEB",
  app: "APP",
};

export type Work = {
  slug: string;
  category: WorkCategory;
  title: string;
  client: string;
  year: string;
  summary: string;
  thumbLabel: string;
  overview: string;
  role: string[];
  stack: string[];
  sections: { heading: string; body: string }[];
};

export const works: Work[] = [
  {
    slug: "tabikoyomi-coffee",
    category: "web",
    title: "旅暦珈琲 コーポレートサイト",
    client: "旅暦珈琲（個人焙煎所）",
    year: "2026",
    summary: "個人焙煎所の開業に合わせたブランドサイト制作。",
    thumbLabel: "WEB SITE MOCKUP",
    overview:
      "個人で焙煎所の開業を控えるオーナーの“らしさ”を、コーポレートサイトという一枚の構造物に落とし込んだ制作事例（ダミーコンテンツ）です。屋号のトーン、豆の産地情報、店主の言葉を軸に、開業前から信頼を積み上げられる設計を意識しました。",
    role: ["ブランド言語化", "サイト設計・デザイン", "コーディング"],
    stack: ["Webサイト設計", "UIデザイン", "コーディング"],
    sections: [
      {
        heading: "課題",
        body: "実店舗を持たない開業直後の焙煎所にとって、Webサイトが唯一の“顔”になる。信頼と個性を同時に伝える必要がありました。",
      },
      {
        heading: "アプローチ",
        body: "店主の焙煎哲学をヒアリングし、コピーとビジュアルのトーンを先に固めてから構造設計へ。問い合わせと販売ページへの動線を軸にワイヤーフレームを作成しました。",
      },
      {
        heading: "成果",
        body: "開業告知と同時にサイトを公開し、SNS経由の流入を問い合わせにつなげる受け皿として機能する構成になりました（本事例は差し替え予定のダミーコンテンツです）。",
      },
    ],
  },
  {
    slug: "nagi-subscription-inn",
    category: "3dweb",
    title: "凪 NAGI サブスクリプション民宿サイト",
    client: "凪 NAGI（コンセプト企画）",
    year: "2026",
    summary: "全国の漁村に建つ宿を月額会費で泊まり歩る、会員制住まいのコンセプトサイト。",
    thumbLabel: "3D MODEL PREVIEW",
    overview:
      "内房・能登・淡路・五島、四つの拠点を月額会費で泊まり歩る会員制の“第二の住まい”というコンセプトを、空間の質感を伝える3Dビジュアル表現とともに設計したデモ企画です。宿泊体験の“間”を伝えることを軸にサイト構造を組みました。",
    role: ["コンセプト設計", "3Dビジュアル活用UI設計", "コーディング"],
    stack: ["3Dモデリング活用WEB設計", "UIデザイン", "コーディング"],
    sections: [
      {
        heading: "課題",
        body: "複数拠点にまたがる宿泊体験を、写真だけでは伝わりにくい“空間の質感”ごと伝える必要がありました。",
      },
      {
        heading: "アプローチ",
        body: "拠点ごとの空間を3Dビジュアルで見せる構成とし、会員登録・拠点紹介・申込導線を一つの体験として設計しました。",
      },
      {
        heading: "成果",
        body: "空間体験を軸にした情報設計により、宿泊予約サイトにありがちな“検索・比較”ではなく“暮らしを想像する”導線を実現しました（本事例はコンセプト企画のデモです）。",
      },
    ],
  },
  {
    slug: "shindan-app",
    category: "app",
    title: "診断型アプリケーション",
    client: "診断型アプリ（コンセプト企画）",
    year: "2026",
    summary: "悩みの入力から提案までを導く、診断型アプリケーションのUI設計事例。",
    thumbLabel: "APPLICATION UI",
    overview:
      "ユーザーの悩みや状態を入力すると、段階的な質問を経て最適な提案にたどり着く診断型アプリのUI/UXを設計したデモ企画です。離脱を防ぐための質問設計と進捗表示を重視しました。",
    role: ["UI/UX設計", "画面遷移設計", "プロトタイプ開発"],
    stack: ["アプリ設計", "UIデザイン", "プロトタイピング"],
    sections: [
      {
        heading: "課題",
        body: "診断系アプリは質問数が多くなるほど離脱しやすく、進捗の見せ方と質問設計の両立が課題でした。",
      },
      {
        heading: "アプローチ",
        body: "1画面1質問の構成とし、進捗バーとマイクロインタラクションで“あと少し”を可視化。結果画面は提案理由を添えて納得感を高めました。",
      },
      {
        heading: "成果",
        body: "診断完了率を意識した画面設計により、提案から問い合わせ・購買への自然な導線を実現しました（本事例はコンセプト企画のデモです）。",
      },
    ],
  },
];

export function getWorkBySlug(slug: string) {
  return works.find((work) => work.slug === slug);
}
