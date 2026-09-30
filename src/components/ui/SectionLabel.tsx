export function SectionLabel({ index, title }: { index: string; title: string }) {
  return (
    <p className="label flex items-center gap-3 text-muted">
      <span className="text-fg">{index}</span>
      <span className="h-px w-8 bg-line-strong" />
      {title}
    </p>
  );
}
