import { ImageResponse } from "next/og";

export const alt = "Studio Poplar — WEB / APP / PHOTO & VIDEO DESIGN STUDIO";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Same diamond mosaic as the site logo (see LogoMark.tsx); accent squares are pre-blended onto the dark background.
const MOSAIC: [number, number, boolean?][] = [
  [2, 0],
  [1, 1], [2, 1], [3, 1],
  [0, 2], [1, 2], [2, 2], [3, 2], [4, 2],
  [0, 3], [1, 3], [2, 3, true], [3, 3], [4, 3],
  [0, 4], [1, 4, true], [2, 4], [3, 4], [4, 4],
  [1, 5], [2, 5], [3, 5],
  [2, 6],
];
const MARK_H = 112;
const MARK_W = Math.round((MARK_H * 48) / 68);

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#141414",
          padding: "72px",
          color: "#f2f1ed",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, letterSpacing: 4, color: "#9a9a95" }}>
          <span>WEB / APP / PHOTO &amp; VIDEO</span>
          <span>DESIGN STUDIO</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
          <svg width={MARK_W} height={MARK_H} viewBox="0 0 48 68">
            {MOSAIC.map(([col, row, accent]) => (
              <rect key={`${col}-${row}`} x={col * 10} y={row * 10} width={8} height={8} rx={2} fill={accent ? "#717170" : "#f2f1ed"} />
            ))}
          </svg>
          <span style={{ fontSize: 96, fontWeight: 700, letterSpacing: 2 }}>
            STUDIO POPLAR
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, letterSpacing: 4, color: "#9a9a95" }}>
          <span>YOKOHAMA, JAPAN</span>
          <span>STUDIOPOPLAR.COM</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
