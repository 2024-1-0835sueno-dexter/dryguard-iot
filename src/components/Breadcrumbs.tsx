interface BreadcrumbsProps {
  items: string[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <div className="text-sm text-slate-700">
      {items.map((item, index) => (
        <span key={`${item}-${index}`}>
          {item}
          {index < items.length - 1 ? " > " : ""}
        </span>
      ))}
    </div>
  );
}
