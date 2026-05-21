import SearchInput from './SearchInput';

export default function FilterBar({ filters, onChange, statusOptions = [] }) {
  const update = (key, val) => onChange({ ...filters, [key]: val });

  return (
    <div className="grid gap-3 rounded border border-border bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      <SearchInput
        value={filters.searchRequester}
        onChange={(v) => update('searchRequester', v)}
        placeholder="Search requester..."
      />
      <SearchInput
        value={filters.searchUser}
        onChange={(v) => update('searchUser', v)}
        placeholder="Search subject user..."
      />
      <SearchInput
        value={filters.searchProject}
        onChange={(v) => update('searchProject', v)}
        placeholder="Search project..."
      />
      <SearchInput
        value={filters.role}
        onChange={(v) => update('role', v)}
        placeholder="Filter by role..."
      />
      <select
        value={filters.status}
        onChange={(e) => update('status', e.target.value)}
        className="rounded border border-border bg-white px-3 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        aria-label="Filter by status"
      >
        <option value="">All statuses</option>
        {statusOptions.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </div>
  );
}
