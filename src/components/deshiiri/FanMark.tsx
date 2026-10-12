// 扇（能・日本舞踊・落語で使う舞扇）の印。デシイリのロゴと共有画像で使う。
// color / accent are props so next/og (no CSS variables) can draw it too.
export function FanMark({
  className,
  color = "currentColor",
  accent = "var(--kaki, #B0522A)",
  size,
}: {
  className?: string;
  color?: string;
  accent?: string;
  size?: number;
}) {
  // Pivot (要) at (20, 35). Paper between r=8 and r=23, from 140° to 40° above the pivot.
  const pivot = { x: 20, y: 35 };
  const at = (deg: number, r: number) => {
    const rad = (deg * Math.PI) / 180;
    return { x: +(pivot.x + r * Math.cos(rad)).toFixed(2), y: +(pivot.y - r * Math.sin(rad)).toFixed(2) };
  };
  const [a1, a2, rIn, rOut] = [140, 40, 8, 23];
  const o1 = at(a1, rOut);
  const o2 = at(a2, rOut);
  const i1 = at(a1, rIn);
  const i2 = at(a2, rIn);
  const folds = [125, 110, 95, 80, 65, 50];
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} className={className} aria-hidden="true" focusable="false">
      <path
        d={`M${i1.x} ${i1.y} L${o1.x} ${o1.y} A${rOut} ${rOut} 0 0 1 ${o2.x} ${o2.y} L${i2.x} ${i2.y} A${rIn} ${rIn} 0 0 0 ${i1.x} ${i1.y} Z`}
        fill="none"
        stroke={color}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      {folds.map((deg) => {
        const a = at(deg, rIn);
        const b = at(deg, rOut);
        return <line key={deg} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={color} strokeWidth="0.9" />;
      })}
      {/* 親骨: the two outer sticks run down to the pivot */}
      <line x1={i1.x} y1={i1.y} x2={pivot.x} y2={pivot.y} stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      <line x1={i2.x} y1={i2.y} x2={pivot.x} y2={pivot.y} stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      <circle cx={pivot.x} cy={pivot.y} r="1.8" fill={accent} />
    </svg>
  );
}
