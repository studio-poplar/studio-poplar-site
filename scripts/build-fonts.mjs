// Builds the self-hosted Japanese fonts in src/fonts/ (run: npm run fonts).
//
// Google Fonts splits Japanese fonts into 100+ files per weight, and the site was loading
// ~400 of them (4.5 MB) on every page. This cuts each weight down to one woff2 that holds
// JIS X 0208 level 1 kanji, kana and symbols, ASCII, and every character used in src/
// and content/. Characters outside the set fall back to the system font.
//
// Re-run after adding an article with unusual kanji; `npm run build` warns when content
// uses a character that is not in src/fonts/charset.txt.
import fs from "node:fs";
import path from "node:path";
import subsetFont from "subset-font";

const root = process.cwd();
const outDir = path.join(root, "src/fonts");

const FONTS = [
  { family: "Zen Kaku Gothic New", file: "zen-kaku-gothic-new", weights: [400, 500, 700, 900] },
  { family: "Shippori Mincho", file: "shippori-mincho", weights: [700] },
];

// ---------- character set ----------

function jisX0208() {
  const decoder = new TextDecoder("shift_jis", { fatal: true });
  let chars = "";
  // Rows 1–8: symbols, digits, Latin, kana, Greek, Cyrillic, box drawing. 16–47: level 1 kanji
  // (the common ~3,000). Level 2 (48–84) is left out to keep each file small; any of those that
  // the site actually uses are added from the repo text below.
  for (let row = 1; row <= 47; row++) {
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
const charset = [...new Set([...ascii, ...extra, ...jisX0208(), ...charsInRepo()])]
  .filter((ch) => ch.codePointAt(0) >= 0x20 && !/[\uD800-\uDFFF]/.test(ch))
  .sort()
  .join("");

// ---------- download + subset ----------

async function ttfUrl(family, weight) {
  // No browser user agent → Google Fonts answers with one full TrueType file per weight.
  const css = await (await fetch(`https://fonts.googleapis.com/css2?family=${family.replaceAll(" ", "+")}:wght@${weight}`)).text();
  const url = css.match(/src: url\((.+?)\) format\('truetype'\)/)?.[1];
  if (!url) throw new Error(`No TrueType URL for ${family} ${weight}`);
  return url;
}

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "charset.txt"), charset);
console.log(`charset: ${[...charset].length} characters`);

for (const font of FONTS) {
  for (const weight of font.weights) {
    const source = Buffer.from(await (await fetch(await ttfUrl(font.family, weight))).arrayBuffer());
    const woff2 = await subsetFont(source, charset, { targetFormat: "woff2" });
    const name = `${font.file}-${weight}.woff2`;
    fs.writeFileSync(path.join(outDir, name), woff2);
    console.log(`${name}: ${Math.round(source.length / 1024)} KB ttf → ${Math.round(woff2.length / 1024)} KB woff2`);
  }
}
