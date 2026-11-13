import { TEMPLATES } from "@/lib/deshiiri/db/schema";

// 型を順番に使う（指示書 7章）。道具 → 材料 → 失敗談 → 先代・師匠の言葉 → 数字 → 季節 → 道具…
export type Template = (typeof TEMPLATES)[number];

export const TEMPLATE_GUIDE: Record<Template, { label: string; hint: string }> = {
  tool: { label: "道具の話", hint: "写真に写っている道具か、本人が触れた道具を軸にする。" },
  material: { label: "材料の話", hint: "木・土・い草・瓦など、扱っている材料の性質を軸にする。" },
  failure: { label: "失敗談", hint: "本人が言ったやり直し・うまくいかなかったことを軸にする。本人が言っていなければ使わない。" },
  mentor: { label: "先代・師匠の言葉", hint: "本人が言った先代や師匠の言葉を軸にする。本人が言っていなければ使わない。" },
  numbers: { label: "数字（寸法・時間）", hint: "本人が言った寸法・時間・回数を軸にする。数字を足さない。" },
  season: { label: "季節", hint: "季節や天気が仕事にどう効くかを軸にする。写真と一言からわかる範囲だけ。" },
};

/** 前回の次の型。初めてなら最初の型。 */
export function nextTemplate(last: Template | null | undefined): Template {
  if (!last) return TEMPLATES[0];
  const i = TEMPLATES.indexOf(last);
  return TEMPLATES[(i + 1) % TEMPLATES.length];
}

/** 指定の型から順に並べた候補（合わなければ次を使ってよい）。 */
export function templateOrder(start: Template): Template[] {
  const i = TEMPLATES.indexOf(start);
  return [...TEMPLATES.slice(i), ...TEMPLATES.slice(0, i)];
}
