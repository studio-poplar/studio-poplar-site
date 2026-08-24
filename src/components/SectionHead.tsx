type SectionHeadProps = {
  index: string;
  label: string;
  title: string;
};

export default function SectionHead({ index, label, title }: SectionHeadProps) {
  return (
    <div className="section-head">
      <span className="eyebrow en">
        {index} — {label}
      </span>
      <h2>{title}</h2>
    </div>
  );
}
