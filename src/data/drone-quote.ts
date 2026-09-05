// すべて仮の単価です。実際の金額が固まり次第、ここの数値・ラベルだけ差し替えてください。

export type DroneMenu = { id: string; label: string; basePrice: number };
export type DroneOption = { id: string; label: string; addPrice: number };

export const DRONE_MENUS: DroneMenu[] = [
  { id: "fudousan-photo", label: "不動産空撮（写真）", basePrice: 30000 },
  { id: "fudousan-video", label: "不動産空撮（動画）", basePrice: 50000 },
  { id: "wedding-event", label: "結婚式・イベント撮影", basePrice: 80000 },
  { id: "pv-promotion", label: "PV・プロモーション映像", basePrice: 120000 },
  { id: "commercial-ad", label: "商業施設・広告用空撮", basePrice: 150000 },
];

export const DRONE_TIME_OPTIONS: DroneOption[] = [
  { id: "1h", label: "1時間パック", addPrice: 0 },
  { id: "half-day", label: "半日（〜4時間）", addPrice: 20000 },
  { id: "full-day", label: "1日（〜8時間）", addPrice: 40000 },
];

export const DRONE_ZONE_OPTIONS: DroneOption[] = [
  { id: "local", label: "横浜市内", addPrice: 0 },
  { id: "kanto", label: "関東近郊", addPrice: 10000 },
  { id: "other", label: "関東以外", addPrice: 30000 },
];

export const DRONE_DELIVERY_OPTIONS: DroneOption[] = [
  { id: "data", label: "データ納品（ギガファイル便等）", addPrice: 0 },
  { id: "dvd", label: "DVD納品", addPrice: 3000 },
  { id: "photos-30", label: "写真30枚パック", addPrice: 5000 },
  { id: "photos-100", label: "写真100枚パック", addPrice: 15000 },
];
