import site from "../../../../content/deshiiri/banned-words.json";

// 下書きと Instagram 用文章で使わない言葉（指示書 7章）。
// 公開中のデシイリの使わない言葉（content/deshiiri/banned-words.json）に、下書き用の言葉を足したもの。
// プロンプトで伝え、出てきた文章も機械で確かめる（どちらか一方には頼らない）。

const DRAFT_ONLY = [
  "こだわり",
  "職人技が光る",
  "魅力",
  "匠の技",
  "いかがでしたか",
  "シームレス",
  "ワンストップ",
  "お気軽に",
  "してみませんか",
  "本当に伝えたかったこと",
  "ポイントは",
  "珠玉",
  "至高",
  "感動",
];

export const BANNED_WORDS: readonly string[] = [...new Set([...site.words, ...DRAFT_ONLY])];

/** 文章に含まれている使わない言葉を返す。 */
export function findBannedWords(text: string): string[] {
  const normalized = text.normalize("NFKC");
  return BANNED_WORDS.filter((w) => normalized.includes(w.normalize("NFKC")));
}
