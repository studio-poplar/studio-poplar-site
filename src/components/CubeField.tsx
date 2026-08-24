import styles from "./CubeField.module.css";

type CubeSpec = {
  size: number;
  x: number;
  y: number;
  z: number;
  duration: number;
  delay: number;
  hideOnMobile?: boolean;
};

const CUBE_SPECS: CubeSpec[] = [
  { size: 190, x: 16, y: 32, z: -100, duration: 46, delay: -6 },
  { size: 110, x: 80, y: 20, z: -50, duration: 32, delay: -18 },
  { size: 250, x: 88, y: 70, z: -170, duration: 60, delay: -30, hideOnMobile: true },
  { size: 95, x: 10, y: 74, z: -30, duration: 26, delay: -10 },
  { size: 150, x: 50, y: 88, z: -120, duration: 40, delay: -22, hideOnMobile: true },
];

function Cube({ spec }: { spec: CubeSpec }) {
  const half = spec.size / 2;
  const faces = [
    { transform: `translateZ(${half}px)`, alt: false },
    { transform: `rotateY(180deg) translateZ(${half}px)`, alt: true },
    { transform: `rotateY(90deg) translateZ(${half}px)`, alt: true },
    { transform: `rotateY(-90deg) translateZ(${half}px)`, alt: false },
    { transform: `rotateX(90deg) translateZ(${half}px)`, alt: false },
    { transform: `rotateX(-90deg) translateZ(${half}px)`, alt: true },
  ];

  return (
    <div
      className={styles.cubeWrap}
      data-mobile={spec.hideOnMobile ? "hide" : undefined}
      style={{
        width: spec.size,
        height: spec.size,
        left: `${spec.x}%`,
        top: `${spec.y}%`,
        transform: `translate(-50%, -50%) translateZ(${spec.z}px)`,
      }}
    >
      <div className={styles.cube} style={{ animationDuration: `${spec.duration}s`, animationDelay: `${spec.delay}s` }}>
        {faces.map((face, i) => (
          <div key={i} className={face.alt ? `${styles.face} ${styles.faceAlt}` : styles.face} style={{ transform: face.transform }} />
        ))}
      </div>
    </div>
  );
}

export default function CubeField() {
  return (
    <div className={styles.heroBg} aria-hidden="true">
      <div className={styles.gridLines} />
      <div className={styles.cubeField}>
        {CUBE_SPECS.map((spec, i) => (
          <Cube key={i} spec={spec} />
        ))}
      </div>
    </div>
  );
}
