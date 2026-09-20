export type WorkCategory = "web" | "3dweb" | "app" | "photo-video";
export type WorkType = "mock" | "demo" | "client";

export const WORK_CATEGORY_LABELS: Record<WorkCategory, string> = {
  web: "WEB",
  "3dweb": "3D WEB",
  app: "APP",
  "photo-video": "PHOTO & VIDEO",
};

export const WORK_TYPE_LABELS: Record<WorkType, string> = {
  mock: "MOCK WORK",
  demo: "DEMO WORK",
  client: "CLIENT WORK",
};

// Categories with no published case yet: shown as a "coming soon" chip.
export const COMING_SOON: Partial<Record<WorkCategory, { title: string; body: string }>> = {
  "photo-video": {
    title: "写真・動画の事例は、準備中です。",
    body: "商品撮影・ビジュアル制作・ドローン撮影の事例を、順次追加していきます。撮影のご相談は、実績の公開を待たずにお受けしています。",
  },
};

export type WorkImage = {
  src: string;
  alt: string;
  device: "desktop" | "mobile";
  caption: string;
  // Mobile only: top-edge colour of the screenshot. When set, a status-bar strip
  // in this colour is added above it so the phone's island doesn't cover the header.
  statusBg?: string;
};

export type Work = {
  slug: string;
  category: WorkCategory;
  type: WorkType;
  title: string;
  client: string;
  year: string;
  summary: string;
  thumbLabel: string;
  overview: string;
  role: string[];
  stack: string[];
  sections: { heading: string; body: string }[];
  url?: string;
  // Real screenshots. `cover` (one or two images of the same device) replaces
  // the generated thumbnail; `images` fill the SCREENS gallery on the detail page.
  cover?: { device: "desktop" | "mobile"; srcs: string[]; bg?: string };
  images?: WorkImage[];
  imageNote?: string;
};

export const works: Work[] = [
  {
    slug: "the-gallery",
    category: "web",
    type: "client",
    title: "THE GALLERY — バーチャル美術館サイト",
    client: "バーチャル美術館プロジェクト",
    year: "2026",
    summary: "実在の江戸期日本美術22点を、スライドショーと、館内を歩ける一人称視点で巡るバーチャル美術館。運営者が自分で更新できる管理画面つき。",
    thumbLabel: "VIRTUAL MUSEUM",
    overview:
      "作家・時代・流派で絞り込める作品グリッドと、静止画に動きを与えるKen Burns演出のスライドショーを軸にした、実在の江戸期日本美術（浮世絵・琳派・狩野派など22点）を紹介するバーチャル美術館サイトです。ビルド不要の単一HTMLという制約の中で機能を積み上げ、運営者自身がノーコードで作品・作家情報を更新できる専用管理画面まで構築しました。さらに、来場者自身の目線で館内を歩き、作品に近づいて鑑賞できる3Dのバーチャル美術館（ウォークスルー）も追加しています。",
    role: ["情報設計", "UI/UXデザイン", "フロントエンド実装", "3D空間設計", "簡易CMS構築"],
    stack: ["静的サイト構築", "UIデザイン", "Three.js（WebGL）", "GitHub API連携"],
    sections: [
      {
        heading: "課題",
        body: "実在の美術作品を、単なる画像一覧ではなく“巡る体験”として見せつつ、開発者なしで運営者が作品を追加・更新できる仕組みも必要でした。",
      },
      {
        heading: "アプローチ",
        body: "作家・時代・流派のフィルタリングとKen Burnsスライドショーで鑑賞体験を設計。その後、専用の管理画面（admin.html）を構築し、GitHub APIを通じてブラウザから直接コンテンツを保存できるようにしました。加えて、館内を一人称視点で歩いて鑑賞できる3D空間を設計し、展示内容は作品データから読み込む作りにしました。",
      },
      {
        heading: "成果",
        body: "バックエンドを持たない静的サイトでありながら、運営者がコードに触れずに作品・作家情報を更新できる状態を実現。管理画面での更新は、3Dの館内展示にもそのまま反映されます。実際に公開・運用中のサイトです。",
      },
    ],
    url: "https://studio-poplar.github.io/THE-GALLERY/",
    cover: { device: "desktop", srcs: ["/works/the-gallery/01-slideshow.jpg"] },
    images: [
      {
        src: "/works/the-gallery/01-slideshow.jpg",
        alt: "THE GALLERY のスライドショー表示。葛飾北斎『神奈川沖浪裏』が全画面で表示されている",
        device: "desktop",
        caption: "スライドショー：作品を全画面で見せ、静かに動かす",
      },
      {
        src: "/works/the-gallery/02-filter.jpg",
        alt: "THE GALLERY の分類フィルターパネル。作者・年代・流派で作品を絞り込める",
        device: "desktop",
        caption: "分類から探す：作者・年代・流派で絞り込み",
      },
      {
        src: "/works/the-gallery/04-walkthrough-overview.jpg",
        alt: "THE GALLERY の館内ウォークスルー。展示室の入口に掛軸が飾られ、右側に操作パネルが並ぶ",
        device: "desktop",
        caption: "バーチャル美術館：館内を歩いて鑑賞できるウォークスルー",
      },
      {
        src: "/works/the-gallery/05-walkthrough-first-person.jpg",
        alt: "THE GALLERY の一人称視点。金地の檜図屏風に近づき、作品名が表示されている",
        device: "desktop",
        caption: "一人称視点：作品に近づくと、作品名と解説が現れる",
      },
      {
        src: "/works/the-gallery/03-mobile.jpg",
        alt: "THE GALLERY のスマートフォン表示",
        device: "mobile",
        statusBg: "#685b4b",
        caption: "スマートフォン：スライドショー",
      },
      {
        src: "/works/the-gallery/06-walkthrough-mobile.jpg",
        alt: "THE GALLERY のスマートフォン表示。館内ウォークスルーの入口",
        device: "mobile",
        statusBg: "#28231d",
        caption: "スマートフォン：館内ウォークスルー",
      },
    ],
  },
  {
    slug: "tabikoyomi-coffee",
    category: "web",
    type: "mock",
    title: "旅暦珈琲 ブランドサイト",
    client: "旅暦珈琲（架空の横浜焙煎所／自主制作）",
    year: "2026",
    summary: "毎月ちがう産地の豆が届く、横浜の焙煎所という設定のブランドサイト。“今月の産地”が日付で自動更新されます。",
    thumbLabel: "BRAND SITE",
    overview:
      "「毎月、違う国の朝が届く。」をコンセプトに、架空の横浜の焙煎所を題材としてブランドの世界観から設計した自主制作のサイトです。深い焦げ茶を基調にしたエディトリアルなヒーロー、実際の世界地図データを使った産地マップ、店舗マップまでを一貫したトーンでまとめています。架空のお店のため、掲載している店舗・商品情報はすべて制作用のものです。",
    role: ["ブランド言語化", "サイト設計・デザイン", "コーディング", "データ設計"],
    stack: ["Next.js", "地図データの可視化", "日付連動の表示ロジック"],
    sections: [
      {
        heading: "課題",
        body: "毎月産地が変わる焙煎所は、“今月何が届くのか”が最大の魅力です。コンセプトを一目で伝えつつ、月が変わっても情報が古くならない作りが求められました。",
      },
      {
        heading: "アプローチ",
        body: "文字組みと余白を主役にした暗色のエディトリアルなデザインで“旅”の空気をつくり、産地は世界地図上に表示。産地暦のデータを月ごとに持たせ、閲覧した日の月から今月の一杯を自動で算出する構成にしました。",
      },
      {
        heading: "成果",
        body: "更新作業なしで毎月“今月の産地”に切り替わるサイトになりました。架空案件のため運用上の成果はありませんが、ブランドの世界観を情報設計とデザインで一貫して表現する制作の一例です。",
      },
    ],
    url: "https://tabigoyomi-coffee.vercel.app/",
    cover: { device: "desktop", srcs: ["/works/tabigoyomi-coffee/01-hero.jpg"] },
    images: [
      {
        src: "/works/tabigoyomi-coffee/01-hero.jpg",
        alt: "旅暦珈琲のヒーロー。「毎月、違う国の朝が届く。」の見出しと世界地図",
        device: "desktop",
        caption: "ヒーロー：世界地図の上に、コンセプトを大きく置く",
      },
      {
        src: "/works/tabigoyomi-coffee/02-concept.jpg",
        alt: "旅暦珈琲のコンセプトセクション",
        device: "desktop",
        caption: "コンセプト：焙煎士が実際に訪れた産地だけを届ける",
      },
      {
        src: "/works/tabigoyomi-coffee/03-calendar.jpg",
        alt: "旅暦珈琲の産地暦。直近の産地がカードで並ぶ",
        device: "desktop",
        caption: "産地暦：日付から今月の産地を自動で表示",
      },
      {
        src: "/works/tabigoyomi-coffee/04-menu.jpg",
        alt: "旅暦珈琲のメニューセクション",
        device: "desktop",
        caption: "メニュー",
      },
      {
        src: "/works/tabigoyomi-coffee/05-mobile.jpg",
        alt: "旅暦珈琲のスマートフォン表示",
        device: "mobile",
        statusBg: "#120d0a",
        caption: "スマートフォン表示",
      },
    ],
  },
  {
    slug: "coco-yoga",
    category: "app",
    type: "client",
    title: "COCO YOGA ヨガ教室向け予約システム",
    client: "COCO YOGA（ヨガ教室）",
    year: "2026",
    summary: "レッスン予約から出欠管理まで。“生徒が辞める前に気づける”ことを軸にした、ヨガ教室向けの予約・会員管理アプリ。",
    thumbLabel: "RESERVATION APP",
    overview:
      "オーナー・講師・生徒の三者が使う、ヨガ教室向けの予約システムです。生徒はスマートフォンからレッスンを選んで予約でき、オーナーと講師は、スケジュール・出欠・生徒情報を一か所で管理できます。単なる予約管理ではなく、予約や出欠のデータを集めて“辞めそうな生徒”に早めに気づくことを目的に設計しました。",
    role: ["要件整理", "画面設計・UI/UXデザイン", "フロントエンド／バックエンド実装", "データベース設計"],
    stack: ["Next.js", "PostgreSQL", "LINEログイン（LIFF）", "Stripe決済（連携設計）"],
    sections: [
      {
        heading: "課題",
        body: "少人数のヨガ教室では、予約は手作業やSNSのメッセージで受け付けていることが多く、誰が最近来なくなったのかが見えにくいことが課題でした。オーナー・講師・生徒で、見るべき情報も異なります。",
      },
      {
        heading: "アプローチ",
        body: "生徒はLINEから開ける、アプリのような予約画面。ホーム・レッスン・履歴・プラン・アカウントの5つのタブで、次のレッスンの確認から予約・振替・キャンセルまでをスマートフォン1台で完結できます。スタッフ側は、レッスンの日程・出欠・生徒・プランを管理する画面を役割ごとに分け、講師別の週間カレンダーで空き状況を確認できるようにしました。",
      },
      {
        heading: "成果",
        body: "生徒向けのマイページ・レッスン一覧・予約と、スタッフ向けのダッシュボード・スケジュール・出欠管理・プラン管理までを実装。直近30日でキャンセルが重なった生徒をダッシュボードで知らせる、継続率を意識した機能も備えています。",
      },
    ],
    cover: {
      device: "mobile",
      srcs: ["/works/coco-yoga/01-student-home.jpg", "/works/coco-yoga/02-student-lessons.jpg"],
      bg: "/works/coco-yoga/hp-hero.jpg",
    },
    images: [
      {
        src: "/works/coco-yoga/hp-hero.jpg",
        alt: "COCO YOGA の公式サイト。「整える習慣が、明日の自分をつくる。」の見出し",
        device: "desktop",
        caption: "公式サイト：静かな余白で、教室の空気を伝える",
      },
      {
        src: "/works/coco-yoga/01-student-home.jpg",
        alt: "COCO YOGA の生徒向けホーム画面。次のレッスンと、この先の予定が並ぶ",
        device: "mobile",
        statusBg: "#f5f4f0",
        caption: "生徒：次のレッスンと予定を、ホームで一目で確認",
      },
      {
        src: "/works/coco-yoga/02-student-lessons.jpg",
        alt: "COCO YOGA の生徒向けレッスン予約画面。日付を選ぶと、講師ごとの列でレッスンが並ぶ",
        device: "mobile",
        statusBg: "#f5f4f0",
        caption: "生徒：日付を選ぶと、講師ごとの列でレッスンが並ぶ",
      },
      {
        src: "/works/coco-yoga/03-student-detail.jpg",
        alt: "COCO YOGA のレッスン詳細。時間・担当講師・空き状況と予約ボタン",
        device: "mobile",
        statusBg: "#f5f4f0",
        caption: "生徒：時間・講師・空き状況を確認して、ワンタップで予約",
      },
      {
        src: "/works/coco-yoga/04-staff-schedule.jpg",
        alt: "COCO YOGA のスタッフ向けレッスンスケジュール管理画面",
        device: "desktop",
        caption: "スタッフ：レッスンの日程と担当講師、予約数を一覧で管理",
      },
      {
        src: "/works/coco-yoga/05-staff-classes.jpg",
        alt: "COCO YOGA のスタッフ向けクラス種別管理画面",
        device: "desktop",
        caption: "スタッフ：クラス種別（内容・時間・定員）の管理",
      },
    ],
    imageNote: "掲載の画面は、確認用に作成したサンプルデータで表示したものです（実際の生徒情報は含みません）。",
  },
  {
    slug: "breeze-coffee",
    category: "app",
    type: "client",
    title: "Breeze Coffee スマート注文アプリ",
    client: "Breeze Coffee（カフェ）",
    year: "2026",
    summary: "スマホで注文、QRチケットでレジへ。レジ・厨房・お客さん向け表示・管理画面までを一つにまとめた、小規模カフェ向けの注文アプリ。",
    thumbLabel: "ORDER APP",
    overview:
      "個人経営・小規模カフェのレジ業務を軽くするための、スマート注文アプリです。お客さんはスマートフォンでメニューを選んで注文し、発行されたQRチケットをレジで見せるだけ。レジ担当は読み取り・会計・領収書の発行を、ドリンクを作る担当は専用の画面で注文を確認し、オーナーはメニュー・原価・スタッフの管理まで、それぞれ専用の画面から行えます。",
    role: ["要件整理", "画面設計・UI/UXデザイン", "フロントエンド／バックエンド実装", "データベース・認証設計"],
    stack: ["Next.js", "PostgreSQL", "LINEログイン（LIFF）", "QRコード"],
    sections: [
      {
        heading: "課題",
        body: "小規模なカフェでは、注文の聞き取りと会計を少人数で回すため、ピーク時にレジが詰まりやすくなります。専用の機械を入れずに、お客さん自身のスマートフォンで負担を減らしたいというご要望でした。",
      },
      {
        heading: "アプローチ",
        body: "お客さん用アプリ・レジ・ドリンクを作る担当の画面・管理画面を、一つのアプリとして構築。注文の確定でQRチケットを発行し、レジのカメラで読み取って会計・提供までをつなぎます。レジの操作はお客さん向けの表示画面にリアルタイムで映り、現金の預かり額やお釣りも確認できます。よく頼む一杯を登録できる「いつもの」機能も加えました。",
      },
      {
        heading: "成果",
        body: "注文から会計、提供の記録、領収書・請求書の発行までが一続きで動くところまで実装しました。お客さんの認証はLINEのアカウントで行い、管理画面ではメニュー・オプション・画像・店舗情報・スタッフを、コードに触れずに更新できます。商品ごとの原価を登録して利益も見られる売上レポートや、ログイン失敗時のロック、エラー監視と稼働確認の仕組みも備えています。",
      },
    ],
  },
];

export function getWorkBySlug(slug: string) {
  return works.find((work) => work.slug === slug);
}

// Value of the contact form's category select for each work category.
export const WORK_CONTACT_CATEGORY: Record<WorkCategory, string> = {
  web: "web",
  "3dweb": "web",
  app: "app",
  "photo-video": "photo-video",
};
