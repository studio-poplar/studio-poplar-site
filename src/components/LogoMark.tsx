import type { CSSProperties } from "react";

// Diamond mosaic: rounded squares on a 5 x 7 grid, two of them toned down as accents.
// Colour comes from currentColor, so the same mark works on light and dark backgrounds.
const CELL = 8;
const PITCH = 10;
const RADIUS = 2;
const ACCENT_OPACITY = 0.42;
// [column, row, accent]
const MOSAIC: [number, number, boolean?][] = [
  [2, 0],
  [1, 1], [2, 1], [3, 1],
  [0, 2], [1, 2], [2, 2], [3, 2], [4, 2],
  [0, 3], [1, 3], [2, 3, true], [3, 3], [4, 3],
  [0, 4], [1, 4, true], [2, 4], [3, 4], [4, 4],
  [1, 5], [2, 5], [3, 5],
  [2, 6],
];
const MOSAIC_W = 5 * PITCH - (PITCH - CELL);
const MOSAIC_H = 7 * PITCH - (PITCH - CELL);

type LogoMarkProps = {
  className?: string;
  style?: CSSProperties;
  decorative?: boolean;
};

export default function LogoMark({ className, style, decorative = false }: LogoMarkProps) {
  if (decorative) {
    return (
      <svg viewBox="0 0 40 42" fill="none" className={className} style={style} aria-hidden="true">
        <path
          d="M20 2C24.5 8 26 15 25 23C24.6 28.5 22.8 34.5 20 38C17.2 34.5 15.4 28.5 15 23C14 15 15.5 8 20 2Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  return (
    <svg viewBox={`0 0 ${MOSAIC_W} ${MOSAIC_H}`} fill="currentColor" className={className} style={style} aria-hidden="true">
      {MOSAIC.map(([col, row, accent]) => (
        <rect
          key={`${col}-${row}`}
          x={col * PITCH}
          y={row * PITCH}
          width={CELL}
          height={CELL}
          rx={RADIUS}
          fillOpacity={accent ? ACCENT_OPACITY : 1}
        />
      ))}
    </svg>
  );
}
