// Builds the self-hosted Japanese fonts in src/fonts/ (run: npm run fonts).
//
// Google Fonts splits Japanese fonts into 100+ files per weight, and the site was loading
// ~400 of them (4.5 MB) on every page. This cuts each weight down to one woff2.
//   Gothic (body text): JIS X 0208 level 1 kanji, kana, symbols, ASCII + every character in
//     src/ and content/, so new body text almost always renders in the font.
//   Mincho (headings and titles only): kana, symbols, ASCII + only the characters in src/ and
//     content/, which keeps the file small.
// Characters outside a set fall back to the system font.
//
// Re-run after adding or editing articles; `npm run build` warns when content uses a
// character that is not in src/fonts/charset-repo.txt.
import fs from "node:fs";
import path from "node:path";
import subsetFont from "subset-font";

const root = process.cwd();
const outDir = path.join(root, "src/fonts");

const FONTS = [
  { family: "Zen Kaku Gothic New", file: "zen-kaku-gothic-new", weights: [400, 500, 700, 900], charset: "full" },
  { family: "Shippori Mincho", file: "shippori-mincho", weights: [700], charset: "repo" },
];

// ---------- character sets ----------

// JIS X 0208 rows 1–8 (symbols, digits, Latin, kana, Greek, Cyrillic, box drawing) and, when
// lastRow ≥ 16, kanji rows 16..lastRow (16–47 = level 1, the common ~3,000).
function jisX0208(lastRow) {
  const decoder = new TextDecoder("shift_jis", { fatal: true });
  let chars = "";
  for (let row = 1; row <= lastRow; row++) {
    if (row > 8 && row < 16) continue;
    for (let col = 1; col <= 94; col++) {
      const s1 = ((row - 1) >> 1) + (row <= 62 ? 0x81 : 0xc1);
      const s2 = row % 2 === 1 ? col + (col <= 63 ? 0x3f : 0x40) : col + 0x9e;
      try {
        chars += decoder.decode(new Uint8Array([s1, s2]));
      } catch {
        // unassigned code point
      }
    }
  }
  return chars;
}

function charsInRepo() {
  const exts = /\.(tsx?|mdx?|ya?ml|json|css)$/;
  let text = "";
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (exts.test(entry.name)) text += fs.readFileSync(full, "utf8");
    }
  };
  walk(path.join(root, "src"));
  walk(path.join(root, "content"));
  return text;
}

const ascii = Array.from({ length: 0x7f - 0x20 }, (_, i) => String.fromCharCode(0x20 + i)).join("");
const extra = "　、。，．・：；？！ー〜～－‐―…‥「」『』（）［］【】〈〉《》〔〕“”‘’○●◎◇◆□■△▲▽▼※→←↑↓〒々〆ヶヵ゛゜×÷±＝≠≦≧∞";
const repo = charsInRepo();

const toSet = (...parts) =>
  [...new Set(parts.flatMap((part) => [...part]))]
    .filter((ch) => ch.codePointAt(0) >= 0x20 && !/[\uD800-\uDFFF]/.test(ch))
    .sort()
    .join("");

const CHARSETS = {
  full: toSet(ascii, extra, jisX0208(47), repo),
  repo: toSet(ascii, extra, jisX0208(8), repo),
};

// ---------- download + subset ----------

async function ttfUrl(family, weight) {
  // No browser user agent → Google Fonts answers with one full TrueType file per weight.
  const css = await (await fetch(`https://fonts.googleapis.com/css2?family=${family.replaceAll(" ", "+")}:wght@${weight}`)).text();
  const url = css.match(/src: url\((.+?)\) format\('truetype'\)/)?.[1];
  if (!url) throw new Error(`No TrueType URL for ${family} ${weight}`);
  return url;
}

fs.mkdirSync(outDir, { recursive: true });
for (const [name, chars] of Object.entries(CHARSETS)) {
  fs.writeFileSync(path.join(outDir, `charset-${name}.txt`), chars);
  console.log(`charset ${name}: ${[...chars].length} characters`);
}

for (const font of FONTS) {
  for (const weight of font.weights) {
    const source = Buffer.from(await (await fetch(await ttfUrl(font.family, weight))).arrayBuffer());
    const woff2 = await subsetFont(source, CHARSETS[font.charset], { targetFormat: "woff2" });
    const name = `${font.file}-${weight}.woff2`;
    fs.writeFileSync(path.join(outDir, name), woff2);
    console.log(`${name}: ${Math.round(source.length / 1024)} KB ttf → ${Math.round(woff2.length / 1024)} KB woff2`);
  }
}
