// 料金は「実際の飛行時間」を30分単位（切り上げ）で計算します。単価は暫定値です。
// 金額が確定したら、ここの数値だけ差し替えてください。

export const DRONE_UNIT_MINUTES = 30;
export const DRONE_UNIT_PRICE = 15000; // 30分あたり（最低料金 = 1単位分）

export type DroneFlight = {
  id: string;
  units: number | null; // null = 個別見積り（金額は出さない）
  label: string;
};

function minutesLabel(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return `${rest}分`;
  return rest === 0 ? `${hours}時間` : `${hours}時間${rest}分`;
}

// 30分〜3時間。それを超える場合は個別に見積ります。
const MAX_UNITS = 6;

export const DRONE_FLIGHTS: DroneFlight[] = [
  ...Array.from({ length: MAX_UNITS }, (_, i) => {
    const units = i + 1;
    return { id: `u${units}`, units, label: minutesLabel(units * DRONE_UNIT_MINUTES) };
  }),
  { id: "custom", units: null, label: `${minutesLabel(MAX_UNITS * DRONE_UNIT_MINUTES)}を超える` },
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
