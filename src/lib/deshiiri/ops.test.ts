import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/deshiiri/db", () => ({ db: vi.fn(), schema: {} }));
vi.mock("@/lib/deshiiri/services/drive", () => ({}));

import { BACKUP_TABLES, backupName, backupsToTrash, KEEP_BACKUPS } from "./backup";
import { LIMITS, monthStartJst, usageWarnings } from "./usage-rules";
import { firstSentence, repeatedPhrases } from "./writing/similar";

describe("バックアップ", () => {
  it("30 個を残し、それより古いものを捨てる", () => {
    const files = Array.from({ length: 33 }, (_, i) => i); // 新しい順
    expect(backupsToTrash(files)).toEqual([30, 31, 32]);
    expect(backupsToTrash(files.slice(0, KEEP_BACKUPS))).toEqual([]);
  });
  it("ファイル名は日本時間", () => {
    expect(backupName(new Date("2026-11-12T18:00:00Z"))).toBe("deshiiri-backup_2026-11-13_0300.json.gz");
  });
  it("親の表を先に書き出す（戻すときの順番）", () => {
    expect(BACKUP_TABLES.indexOf("craftspeople")).toBeLessThan(BACKUP_TABLES.indexOf("works"));
    expect(BACKUP_TABLES.indexOf("works")).toBeLessThan(BACKUP_TABLES.indexOf("work_photos"));
    expect(BACKUP_TABLES).not.toContain("line_events");
  });
});

describe("無料枠の警告", () => {
  const ok = { pushes: 150, r2Bytes: 0, r2Objects: 0, neonBytes: 0 };
  it("150 通ちょうどでは出さず、151 通で出す", () => {
    expect(usageWarnings(ok)).toEqual([]);
    expect(usageWarnings({ ...ok, pushes: 151 })).toHaveLength(1);
  });
  it("R2 は 8GB、Neon は 0.8GB で出す", () => {
    expect(usageWarnings({ ...ok, r2Bytes: LIMITS.r2WarnBytes })).toHaveLength(1);
    expect(usageWarnings({ ...ok, neonBytes: LIMITS.neonWarnBytes })).toHaveLength(1);
  });
  it("月の数え始めは日本時間の1日 0:00", () => {
    // 日本時間 12/1 8:00 は、UTC ではまだ 11/30
    expect(monthStartJst(new Date("2026-11-30T23:00:00Z")).toISOString()).toBe("2026-11-30T15:00:00.000Z");
    expect(monthStartJst(new Date("2026-11-30T14:00:00Z")).toISOString()).toBe("2026-10-31T15:00:00.000Z");
  });
});

describe("似てきた言い回しを探す", () => {
  it("何本にも出る言い回しを、長いまま1つにまとめて返す", () => {
    const texts = ["朝いちばん、杉板を削る。手の感覚が頼りだ。", "朝いちばん、瓦を運ぶ。手の感覚が頼りだ。", "壁を塗る。手の感覚が頼りだ。"];
    const found = repeatedPhrases(texts, { minDocs: 3 });
    expect(found[0]).toEqual({ phrase: "手の感覚が頼りだ", docs: 3 });
    expect(found.some((f) => f.phrase === "感覚が頼り")).toBe(false);
  });
  it("書き出しは最初の一文", () => expect(firstSentence("朝。昼。")).toBe("朝。"));
});

describe("本番の準備", () => {
  it("本番とプレビューのバックアップは別のフォルダ", async () => {
    const { backupFolderName } = await import("./backup");
    expect(backupFolderName("production")).toBe("バックアップ");
    expect(backupFolderName("preview")).toBe("バックアップ（プレビュー）");
  });
});
