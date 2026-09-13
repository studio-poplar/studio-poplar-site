// すべて仮の単価です。実際の金額が固まり次第、ここの数値・ラベルだけ差し替えてください。

export type AppTier = {
  id: string;
  label: string;
  basePrice: number | null; // null = 個別見積り（要相談）
  detail: string;
};

export const APP_TIERS: AppTier[] = [
  { id: "light", label: "Light（〜10画面）", basePrice: 100000, detail: "小規模なアプリに" },
  { id: "standard", label: "Standard（11〜20画面）", basePrice: 180000, detail: "機能が複数ある中規模アプリに" },
  { id: "large", label: "Large（21画面以上）", basePrice: null, detail: "大規模・複雑な機能を持つアプリに" },
];

export type AppOption = {
  id: string;
  label: string;
  addPrice: number;
  detail?: string;
};

export const APP_BACKEND_OPTIONS: AppOption[] = [
  { id: "none", label: "なし（フロントエンドのみ）", addPrice: 0 },
  { id: "yes", label: "あり（会員登録・DB連携など）", addPrice: 80000, detail: "会員登録・データベース連携など" },
];
