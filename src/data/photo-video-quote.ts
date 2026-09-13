// すべて仮の単価です。実際の金額が固まり次第、ここの数値・ラベルだけ差し替えてください。

export type PhotoVideoTier = {
  id: string;
  label: string;
  content: string;
  time: string;
  price: number;
};

export const PHOTO_VIDEO_TIERS: PhotoVideoTier[] = [
  { id: "light", label: "Light", content: "プロフィール・スナップ撮影", time: "2時間", price: 40000 },
  { id: "standard", label: "Standard", content: "商品・店舗・イベント撮影", time: "半日（4時間）", price: 80000 },
  { id: "premium", label: "Premium", content: "撮影＋SNS/PR用ショート動画編集込み", time: "1日（8時間）", price: 160000 },
];

export const SET_DISCOUNT_RATE = 0.5;
