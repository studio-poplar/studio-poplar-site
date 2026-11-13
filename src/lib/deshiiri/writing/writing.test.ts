import { describe, expect, it } from "vitest";
import { findBannedWords } from "./banned-words";
import { checkDraft, hasErrors, type DraftOutput } from "./draft";
import { nextTemplate, templateOrder } from "./templates";

const good: DraftOutput = {
  template: "tool",
  title: "梁を鉋で削る日",
  body:
    "「今日は畳の修復。梁を鉋で削る。」と親方は言う。写真には、刃を研いだばかりの鉋と、削り屑が積もった作業台が写っている。梁の表面を少しずつ整え、手で触って平らかどうかを確かめる。削った面には木目がはっきり出ていて、光の当たり方で凹凸がわかる。作業場の壁には大小の鉋が並び、用途ごとに使い分けているようだ。",
  alts: ["鉋で梁を削る手元", "鉋が並ぶ作業場"],
  editor_questions: ["梁の材木の種類を確認したい"],
  instagram: [
    { kind: "short", text: "梁を鉋で削る。 #デシイリ #大工 #鉋" },
    { kind: "normal", text: "今日は畳の修復と梁の削り。 #デシイリ #大工 #鉋 #横浜" },
  ],
};

describe("使わない言葉", () => {
  it("見つけた言葉を返す（全角半角の違いは無視）", () => {
    expect(findBannedWords("職人のこだわりと魅力")).toEqual(expect.arrayContaining(["こだわり", "魅力"]));
    expect(findBannedWords("梁を鉋で削る")).toEqual([]);
  });
  it("公開中のデシイリの言葉（求人・募集など）も含む", () => {
    expect(findBannedWords("弟子を募集")).toContain("募集");
  });
});

describe("型の順番", () => {
  it("前回の次の型を使い、最後の次は最初に戻る", () => {
    expect(nextTemplate(null)).toBe("tool");
    expect(nextTemplate("tool")).toBe("material");
    expect(nextTemplate("season")).toBe("tool");
  });
  it("指定した型から一周ぶん並べる", () => {
    expect(templateOrder("failure")).toEqual(["failure", "mentor", "numbers", "season", "tool", "material"]);
  });
});

describe("下書きの検査", () => {
  it("決まりどおりの下書きは問題なし", () => {
    expect(checkDraft(good, "今日は畳の修復。梁を鉋で削る。", 2)).toEqual([]);
  });

  it("使わない言葉は error（作り直しの対象）", () => {
    const p = checkDraft({ ...good, title: "鉋へのこだわり" }, "今日は畳の修復。", 2);
    expect(hasErrors(p)).toBe(true);
    expect(p[0].message).toContain("こだわり");
  });

  it("Instagram 用文章の使わない言葉も見つける", () => {
    const p = checkDraft({ ...good, instagram: [...good.instagram, { kind: "question", text: "魅力は？ #デシイリ #大工 #鉋" }] }, "今日は畳の修復。", 2);
    expect(hasErrors(p)).toBe(true);
  });

  it("長さ・一言・代替テキスト・ハッシュタグは warn", () => {
    const p = checkDraft(
      { ...good, title: "あ".repeat(25), body: "短い", alts: ["一枚だけ"], instagram: [{ kind: "short", text: "#大工" }] },
      "今日は畳の修復。",
      2,
    );
    expect(hasErrors(p)).toBe(false);
    const msgs = p.map((x) => x.message).join("\n");
    expect(msgs).toContain("見出し");
    expect(msgs).toContain("本文");
    expect(msgs).toContain("一言");
    expect(msgs).toContain("代替テキスト");
    expect(msgs).toContain("#デシイリ");
    expect(msgs).toContain("2〜3案");
  });
});
