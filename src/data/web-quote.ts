// すべて仮の単価です。実際の金額が固まり次第、ここの数値・ラベルだけ差し替えてください。

export type WebTier = {
  id: string;
  label: string;
  basePrice: number | null; // null = 個別見積り（要相談）
  detail: string;
  delivery: string;
};

export const WEB_TIERS: WebTier[] = [
  { id: "light", label: "Light（〜5ページ）", basePrice: 50000, detail: "コーポレートサイト・LPなど小規模なサイトに", delivery: "最短1週間" },
  { id: "standard", label: "Standard（6〜10ページ）", basePrice: 80000, detail: "複数ページ構成のサイトに", delivery: "最短2週間" },
  { id: "large", label: "Large（11ページ以上）", basePrice: null, detail: "大規模サイト・オウンドメディアなど", delivery: "要相談" },
];

export type WebOption = {
  id: string;
  label: string;
  addPrice: number;
  detail?: string;
};

export const WEB_OPTIONS: WebOption[] = [
  { id: "domain", label: "ドメイン取得・初年度サーバー費用", addPrice: 10000 },
  { id: "booking", label: "予約システム", addPrice: 30000 },
  { id: "ec", label: "ECカート機能", addPrice: 50000 },
  { id: "cms", label: "自分で更新できるCMS導入", addPrice: 20000 },
];
