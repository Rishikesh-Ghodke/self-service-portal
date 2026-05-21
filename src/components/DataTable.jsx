import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

function SortIcon({ columnKey, sortKey, sortDir }) {
  if (sortKey !== columnKey) {
    return <ChevronsUpDown className="h-3.5 w-3.5 text-text-muted/50" />;
  }
  return sortDir === 'asc' ? (
    <ChevronUp className="h-3.5 w-3.5 text-primary" />
  ) : (
    <ChevronDown className="h-3.5 w-3.5 text-primary" />
  );
}

export default function DataTable({
  columns,
  data,
  sortKey,
  sortDir,
  onSort,
  stickyHeader = true,
  emptyMessage = 'No records to display',
}) {
  const handleSort = (col) => {
    if (!col.sortable || !onSort) return;
    if (sortKey === col.key) {
      onSort(col.key, sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      onSort(col.key, 'asc');
    }
  };

  if (!data?.length) {
    return (
      <div className="rounded border border-border bg-white px-4 py-12 text-center text-sm text-text-muted">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded border border-border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-left text-sm">
          <thead className={stickyHeader ? 'sticky top-0 z-10' : ''}>
            <tr className="border-b border-border bg-surface">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`whitespace-nowrap px-4 py-3 font-semibold text-text ${
                    col.sortable ? 'cursor-pointer select-none hover:bg-border/30' : ''
                  } ${col.className || ''}`}
                  onClick={() => handleSort(col)}
                  scope="col"
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {col.sortable && onSort && (
                      <SortIcon columnKey={col.key} sortKey={sortKey} sortDir={sortDir} />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr
                key={row.id || idx}
                className="border-b border-border transition-colors last:border-0 hover:bg-primary-light/30"
              >
                {columns.map((col) => (
                  <td key={col.key} className={`px-4 py-3 text-text ${col.className || ''}`}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
