export default function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 42" fill="none" className={className} aria-hidden="true">
      <path
        d="M20 2C24.5 8 26 15 25 23C24.6 28.5 22.8 34.5 20 38C17.2 34.5 15.4 28.5 15 23C14 15 15.5 8 20 2Z"
        fill="currentColor"
      />
      <path d="M20 15C20 22 20 30 20 38" stroke="var(--bg, #fff)" strokeWidth="1" />
      <line x1="20" y1="38" x2="20" y2="41.5" stroke="var(--brand, currentColor)" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
