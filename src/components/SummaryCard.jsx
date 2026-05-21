export default function SummaryCard({ label, value, accent = 'primary' }) {
  const accentMap = {
    primary: 'text-primary',
    amber: 'text-amber-600',
    emerald: 'text-emerald-600',
    red: 'text-red-600',
  };

  return (
    <div className="rounded border border-border bg-white px-5 py-4 shadow-sm transition-shadow hover:shadow-md">
      <p className="text-sm font-medium text-text-muted">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${accentMap[accent] || accentMap.primary}`}>
        {value}
      </p>
    </div>
  );
}
