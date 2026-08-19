import { ImageResponse } from "next/og";

export const alt = "Studio Poplar — WEB / 3D MODEL WEB / APP DESIGN STUDIO";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
          background: "#0b0d10",
          padding: "72px",
          color: "#f2f1ed",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, letterSpacing: 4, color: "#9a9ca3" }}>
          <span>WEB / 3D MODEL WEB / APP</span>
          <span>DESIGN STUDIO</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 96, fontWeight: 700, letterSpacing: 2 }}>
            STUDIO <span style={{ color: "#e3a857" }}>POPLAR</span>
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, letterSpacing: 4, color: "#9a9ca3" }}>
          <span>YOKOHAMA, JAPAN</span>
          <span>STUDIOPOPLAR.COM</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
