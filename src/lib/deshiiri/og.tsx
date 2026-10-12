import fs from "fs/promises";
import path from "path";
import { ImageResponse } from "next/og";

// Share images for デシイリ (1200×630). Japanese needs a real font in next/og, so Shippori Mincho
// is fetched from Google Fonts, cut down to just the characters on the image.

export const OG_SIZE = { width: 1200, height: 630 };

const INK = "#1C1B19";
const BG = "#FAF8F4";
const KAKI = "#B0522A";
const MOEGI = "#3E5D3B";

async function loadMincho(text: string): Promise<ArrayBuffer | null> {
  try {
    const url = `https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@700&text=${encodeURIComponent(text)}`;
    // No browser user agent → Google Fonts answers with TrueType, which next/og can read.
    const css = await (await fetch(url)).text();
    const src = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
    if (!src) return null;
    return await (await fetch(src)).arrayBuffer();
  } catch {
    return null;
  }
}

async function photoDataUrl(src: string | null) {
  if (!src) return null;
  const file = path.join(process.cwd(), "public", src);
  try {
    const data = await fs.readFile(file);
    const type = /\.png$/i.test(src) ? "image/png" : "image/jpeg";
    return `data:${type};base64,${data.toString("base64")}`;
  } catch {
    return null;
  }
}

type Input = {
  title: string;
  // Small line above the title, e.g. 「第二十四帖 — 横浜市戸塚区」
  kicker?: string;
  // 千社札: vertical job name
  fuda?: string;
  photo?: string | null;
};

export async function deshiiriOgImage({ title, kicker = "", fuda, photo = null }: Input) {
  const image = await photoDataUrl(photo);
  const brand = "弟デシイリ職人と家業の読みもの";
  const font = await loadMincho(title + kicker + (fuda ?? "") + brand);
  const onPhoto = !!image;
  const fg = onPhoto ? "#FFFFFF" : INK;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: onPhoto ? INK : BG, fontFamily: "Mincho" }}>
        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="" width={1200} height={630} style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 630, objectFit: "cover" }} />
        )}
        {image && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 1200,
              height: 630,
              display: "flex",
              background: "linear-gradient(180deg, rgba(20,19,17,0.3) 0%, rgba(20,19,17,0.55) 45%, rgba(20,19,17,0.9) 100%)",
            }}
          />
        )}
        {/* 定式幕の細線 */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 8, display: "flex" }}>
          <div style={{ flex: 1, background: INK }} />
          <div style={{ flex: 1, background: KAKI }} />
          <div style={{ flex: 1, background: MOEGI }} />
        </div>
        {fuda && (
          <div
            style={{
              position: "absolute",
              top: 56,
              left: 64,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              background: KAKI,
              color: "#FFFFFF",
              border: `2px solid ${KAKI}`,
              boxShadow: `5px 5px 0 ${INK}`,
              padding: "16px 10px",
              fontSize: 34,
              lineHeight: 1.1,
            }}
          >
            {[...fuda].map((ch, i) => (
              <span key={i}>{ch === "・" ? "･" : ch}</span>
            ))}
          </div>
        )}
        <div
          style={{
            position: "absolute",
            left: 64,
            right: 64,
            bottom: 56,
            display: "flex",
            flexDirection: "column",
            color: fg,
          }}
        >
          {kicker && <div style={{ fontSize: 26, opacity: 0.85, marginBottom: 14, display: "flex" }}>{kicker}</div>}
          <div style={{ fontSize: title.length > 26 ? 48 : 58, lineHeight: 1.45, display: "flex" }}>{title}</div>
          <div style={{ display: "flex", alignItems: "center", marginTop: 30, fontSize: 26, gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                border: `2px solid ${fg}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
              }}
            >
              弟
            </div>
            <span>デシイリ</span>
            <span style={{ fontSize: 20, opacity: 0.75, marginLeft: 8 }}>職人と家業の読みもの</span>
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: font ? [{ name: "Mincho", data: font, weight: 700, style: "normal" }] : [],
    },
  );
}
