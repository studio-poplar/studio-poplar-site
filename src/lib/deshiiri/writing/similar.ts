// 「最近の投稿を並べて見る」で使う：何本もの文章に同じ言い回しが出ていないかを探す（文章が似てくるのを防ぐ）。

const SKIP = /[\s、。，．「」『』（）()！？!?・…\-—―:：]/;

/**
 * minDocs 本以上の文章に出てくる、長さ minLen〜maxLen の言い回しを、出てくる本数の多い順に返す。
 * 長いものを先に取り、その一部になっている短いものは出さない。
 */
export function repeatedPhrases(texts: string[], { minLen = 5, maxLen = 12, minDocs = 3, limit = 15 } = {}) {
  const chosen: { phrase: string; docs: number }[] = [];
  for (let n = maxLen; n >= minLen; n--) {
    const seen = new Map<string, Set<number>>();
    texts.forEach((t, i) => {
      for (let k = 0; k + n <= t.length; k++) {
        const g = t.slice(k, k + n);
        if (SKIP.test(g)) continue;
        let s = seen.get(g);
        if (!s) seen.set(g, (s = new Set()));
        s.add(i);
      }
    });
    for (const [g, s] of seen) {
      if (s.size >= minDocs && !chosen.some((c) => c.phrase.includes(g))) chosen.push({ phrase: g, docs: s.size });
    }
  }
  return chosen.sort((a, b) => b.docs - a.docs || b.phrase.length - a.phrase.length).slice(0, limit);
}

/** 書き出し（最初の一文）。書き出しが似てくるのがいちばん目立つので、並べて見せる。 */
export const firstSentence = (body: string) => body.split(/(?<=。)/)[0]?.trim() ?? "";
