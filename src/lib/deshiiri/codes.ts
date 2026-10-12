// 仕事と町のコード → 表示名。コードは URL（/deshiiri/shigoto/<job>, /deshiiri/machi/<city>）にもなる。
// 新しい仕事・町はここに足す。並び順は索引のピルの順番。

export const JOBS = {
  daiku: "大工",
  sakan: "左官",
  kawara: "瓦",
  tatami: "畳",
  tategu: "建具",
  niwashi: "庭師",
  miso: "味噌・醤油",
  sakagura: "酒蔵",
  kaji: "鍛冶",
  kaju: "梨・果樹",
  yasai: "野菜",
} as const;

export const CITIES = {
  yokohama: "横浜市",
  kawasaki: "川崎市",
  sagamihara: "相模原市",
  fujisawa: "藤沢市",
  odawara: "小田原市",
  kamakura: "鎌倉市",
  miura: "三浦市",
  yokosuka: "横須賀市",
  chigasaki: "茅ヶ崎市",
  hiratsuka: "平塚市",
  atsugi: "厚木市",
} as const;

export const SERIES = {
  dougu: "道具の話",
  shigotogi: "仕事着",
  hirumeshi: "現場の昼めし",
} as const;

// 連載ページとトップの連載欄に出す一文
export const SERIES_ABOUT: Record<string, string> = {
  dougu: "職人が手放さない道具を一つずつ。誰から譲られたか、どう手入れしているか。",
  shigotogi: "現場で着ているもの、履いているもの。なぜそれを選んだのか。",
  hirumeshi: "作業の合間に何を食べているか。どこで、何分で。",
};

export type JobCode = keyof typeof JOBS;
export type CityCode = keyof typeof CITIES;
export type SeriesCode = keyof typeof SERIES;

export const CONTACT_PURPOSES = {
  hanashi: "話を聞いてみたい",
  irai: "仕事を頼みたい",
  kengaku: "見学してみたい",
  deshiiri: "弟子入りの相談",
} as const;

export type ContactPurpose = keyof typeof CONTACT_PURPOSES;

// 見学・弟子入りの相談のときだけ聞く年代
export const AGE_GROUPS = ["10代", "20代", "30代以上"] as const;

export function jobLabel(code: string) {
  return (JOBS as Record<string, string>)[code] ?? code;
}

export function cityLabel(code: string) {
  return (CITIES as Record<string, string>)[code] ?? code;
}

export function seriesLabel(code: string) {
  return (SERIES as Record<string, string>)[code] ?? code;
}

