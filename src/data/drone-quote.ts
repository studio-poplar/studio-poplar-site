// すべて仮の単価です（同業他社の料金表を参考に設計）。実際の金額が固まり次第、ここの数値・ラベルだけ差し替えてください。

export type DronePlan = {
  id: string;
  label: string;
  basePrice: number | null; // null = 個別見積り（要相談・金額は出さない）
  detail: string;
};

export const DRONE_PLANS: DronePlan[] = [
  { id: "light", label: "ライトプラン", basePrice: 35000, detail: "写真撮影中心・飛行時間約15分・撮影1ヶ所" },
  { id: "standard", label: "スタンダードプラン", basePrice: 85000, detail: "写真＋動画・全データ納品・飛行時間約45分" },
  { id: "custom", label: "個別見積プラン", basePrice: null, detail: "撮影内容・編集有無・納品形式等により都度お見積り" },
];

export type DroneZone = {
  id: string;
  label: string;
  addPrice: number | null; // null = 別途お見積り
};

export const DRONE_ZONES: DroneZone[] = [
  { id: "local", label: "横浜市内", addPrice: 0 },
  { id: "kanto", label: "関東近郊", addPrice: 15000 },
  { id: "other", label: "関東以外", addPrice: null },
];

export type DroneAddon = {
  id: string;
  label: string;
  addPrice: number;
  detail?: string;
};

export const DRONE_ADDONS: DroneAddon[] = [
  { id: "location-scouting", label: "事前訪問打ち合わせ・ロケハン", addPrice: 35000 },
  { id: "video-edit", label: "動画簡易編集", addPrice: 50000, detail: "カット編集・BGM挿入、修正1回まで" },
  { id: "photo-retouch", label: "写真補正・画像加工", addPrice: 5000, detail: "不要物の除去・明るさ調整など" },
  { id: "permit-application", label: "飛行許可申請の代行", addPrice: 35000, detail: "人口集中地区・空港周辺など" },
  { id: "safety-staff", label: "警備員・補助員の手配", addPrice: 30000, detail: "私有地以外での撮影時など" },
];
