import LogoMark from "./LogoMark";
import styles from "./LeafField.module.css";

type Leaf = { x: number; y: number; size: number; rotate: number; opacity: number; brand?: boolean };

const LEAVES: Leaf[] = [
  { x: 8, y: 14, size: 120, rotate: -18, opacity: 0.05 },
  { x: 88, y: 10, size: 90, rotate: 24, opacity: 0.045 },
  { x: 18, y: 78, size: 70, rotate: 10, opacity: 0.045 },
  { x: 92, y: 70, size: 130, rotate: -12, opacity: 0.055 },
  { x: 50, y: 92, size: 60, rotate: 6, opacity: 0.04 },
  { x: 4, y: 45, size: 55, rotate: -30, opacity: 0.04 },
  { x: 70, y: 30, size: 46, rotate: 16, opacity: 0.5, brand: true },
  { x: 30, y: 55, size: 34, rotate: -22, opacity: 0.4, brand: true },
];

export default function LeafField() {
  return (
    <div className={styles.field} aria-hidden="true">
      {LEAVES.map((leaf, i) => (
        <LogoMark
          key={i}
          decorative
          className={leaf.brand ? styles.leafBrand : styles.leaf}
          style={{
            left: `${leaf.x}%`,
            top: `${leaf.y}%`,
            width: leaf.size,
            height: leaf.size * 1.05,
            opacity: leaf.opacity,
            transform: `translate(-50%, -50%) rotate(${leaf.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
}
