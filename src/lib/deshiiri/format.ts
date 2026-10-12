// "No.24"
export function noLabel(no: number) {
  return `No.${no}`;
}

// "2026-11-20" → "2026.11.20"
export function dotDate(value: string) {
  return value.replaceAll("-", ".");
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
