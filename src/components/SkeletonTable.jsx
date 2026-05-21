export default function SkeletonTable({ rows = 5, cols = 6 }) {
  return (
    <div className="animate-pulse overflow-hidden rounded border border-border bg-white">
      <div className="flex gap-4 border-b border-border bg-surface px-4 py-3">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-4 flex-1 rounded bg-border/60" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, row) => (
        <div key={row} className="flex gap-4 border-b border-border px-4 py-4 last:border-0">
          {Array.from({ length: cols }).map((_, col) => (
            <div key={col} className="h-3 flex-1 rounded bg-border/40" />
          ))}
        </div>
      ))}
    </div>
  );
}
