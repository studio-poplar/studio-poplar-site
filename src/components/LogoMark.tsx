import type { CSSProperties } from "react";

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
    <svg viewBox="0 0 30 40" fill="none" className={className} style={style} aria-hidden="true">
      <line x1="15" y1="4" x2="15" y2="36" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="15" y1="11" x2="8" y2="16" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="15" y1="11" x2="22" y2="16" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="15" y1="19" x2="9" y2="23" stroke="var(--brand, currentColor)" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="15" y1="19" x2="21" y2="23" stroke="var(--brand, currentColor)" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="15" y1="27" x2="10" y2="31" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="15" y1="27" x2="20" y2="31" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}
