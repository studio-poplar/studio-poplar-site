type SectionHeadProps = {
  index: string;
  label: string;
  title: string;
  description?: string;
};

export default function SectionHead({ index, label, title, description }: SectionHeadProps) {
  return (
    <div className="section-head">
      <div>
        <span className="mono">
          {index} — {label}
        </span>
        <h2>{title}</h2>
      </div>
      {description && <p>{description}</p>}
    </div>
  );
}
