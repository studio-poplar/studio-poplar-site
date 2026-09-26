// 最低料金30,000円（飛行1時間まで）、以降は30分ごとに加算します。単価は暫定値です。
// 金額が確定したら、ここの数値だけ差し替えてください。

export const DRONE_UNIT_MINUTES = 30; // 最低料金を超えた分の、延長の単位
export const DRONE_UNIT_PRICE = 15000; // 延長30分あたり
export const DRONE_MINIMUM_MINUTES = 60; // 最低料金でカバーする時間
export const DRONE_MINIMUM_CHARGE = 30000; // 最低料金（1時間まで）

export type DroneFlight = {
  id: string;
  price: number | null; // null = 個別見積り（金額は出さない）
  label: string;
};

function minutesLabel(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return `${rest}分`;
  return rest === 0 ? `${hours}時間` : `${hours}時間${rest}分`;
}

// 最低料金(1時間まで)から、延長30分刻みで3時間まで。それを超える場合は個別に見積ります。
const MAX_MINUTES = 180;
const extensionSteps = Math.round((MAX_MINUTES - DRONE_MINIMUM_MINUTES) / DRONE_UNIT_MINUTES);

export const DRONE_FLIGHTS: DroneFlight[] = [
  { id: "min", price: DRONE_MINIMUM_CHARGE, label: `${minutesLabel(DRONE_MINIMUM_MINUTES)}まで` },
  ...Array.from({ length: extensionSteps }, (_, i) => {
    const step = i + 1;
    const minutes = DRONE_MINIMUM_MINUTES + step * DRONE_UNIT_MINUTES;
    return { id: `ext${step}`, price: DRONE_MINIMUM_CHARGE + step * DRONE_UNIT_PRICE, label: minutesLabel(minutes) };
  }),
  { id: "custom", price: null, label: `${minutesLabel(MAX_MINUTES)}を超える` },
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
