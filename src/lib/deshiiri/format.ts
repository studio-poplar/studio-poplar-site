const DIGITS = ["〇", "一", "二", "三", "四", "五", "六", "七", "八", "九"];

// 24 → 二十四, 105 → 百五. Covers 1–9999, enough for 帖 numbers.
export function toKanjiNumber(n: number): string {
  if (!Number.isInteger(n) || n <= 0) return String(n);
  const units: [number, string][] = [
    [1000, "千"],
    [100, "百"],
    [10, "十"],
  ];
  let rest = n;
  let out = "";
  for (const [value, mark] of units) {
    const d = Math.floor(rest / value);
    if (d > 0) out += (d === 1 ? "" : DIGITS[d]) + mark;
    rest %= value;
  }
  if (rest > 0) out += DIGITS[rest];
  return out;
}

export function choLabel(no: number) {
  return `第${toKanjiNumber(no)}帖`;
}

// "2026-11" → "2026年11月", "2026-11-20" → "2026年11月20日"
export function jaDate(value: string) {
  const [y, m, d] = value.split("-").map(Number);
  if (!y) return value;
  return d ? `${y}年${m}月${d}日` : `${y}年${m}月`;
}

// Rough reading time for Japanese text: about 500 characters a minute.
export function readingMinutes(body: string) {
  const text = body
    .replace(/^---[\s\S]*?---/, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\{[^}]*\}/g, "")
    .replace(/[#>*_`\s]/g, "");
  return Math.max(1, Math.round(text.length / 500));
}
