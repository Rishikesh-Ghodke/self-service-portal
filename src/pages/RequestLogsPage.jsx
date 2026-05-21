import { useState, useEffect, useCallback, useMemo } from 'react';
import { Download, RefreshCw } from 'lucide-react';
import SummaryCard from '../components/SummaryCard';
import FilterBar from '../components/FilterBar';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import SkeletonTable from '../components/SkeletonTable';
import EmptyState from '../components/EmptyState';
import { getRequests } from '../api/requestApi';
import { useDebounce } from '../hooks/useDebounce';
import { usePolling } from '../hooks/usePolling';
import { useToast } from '../hooks/useToast';
import { REQUEST_STATUS, DEFAULT_PAGE_SIZE, DEBOUNCE_MS, POLL_INTERVAL_MS } from '../constants';
import { formatDateTime } from '../utils/formatDate';
import { exportToCsv } from '../utils/exportCsv';
import { getErrorMessage } from '../utils/apiError';

const defaultFilters = {
  searchRequester: '',
  searchUser: '',
  searchProject: '',
  role: '',
  status: '',
};

export default function RequestLogsPage() {
  const { addToast } = useToast();
  const [filters, setFilters] = useState(defaultFilters);
  const [sortKey, setSortKey] = useState('requestedAt');
  const [sortDir, setSortDir] = useState('desc');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1, summary: {} });

  const debouncedFilters = useDebounce(filters, DEBOUNCE_MS);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getRequests({
        ...debouncedFilters,
        sortKey,
        sortDir,
        page,
        limit: DEFAULT_PAGE_SIZE,
      });
      setData(result.data);
      setMeta(result.meta);
    } catch (err) {
      addToast(getErrorMessage(err, 'Failed to load requests'), 'error');
    } finally {
      setLoading(false);
    }
  }, [debouncedFilters, sortKey, sortDir, page, addToast]);

  const { secondsAgo, refresh } = usePolling(fetchData, POLL_INTERVAL_MS);

  useEffect(() => {
    setPage(1);
  }, [debouncedFilters, sortKey, sortDir]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSort = (key, dir) => {
    setSortKey(key);
    setSortDir(dir);
  };

  const columns = useMemo(
    () => [
      { key: 'requester', label: 'Requester', sortable: true },
      { key: 'subjectUser', label: 'Subject User', sortable: true },
      { key: 'project', label: 'Project', sortable: true },
      {
        key: 'roles',
        label: 'Roles',
        render: (row) => (
          <span className="line-clamp-2" title={row.roles.join(', ')}>
            {row.roles.join(', ')}
          </span>
        ),
      },
      {
        key: 'description',
        label: 'Description',
        className: 'max-w-[200px]',
        render: (row) => (
          <span className="line-clamp-2" title={row.description}>
            {row.description}
          </span>
        ),
      },
      {
        key: 'startDate',
        label: 'Start Date',
        sortable: true,
        render: (row) => formatDateTime(row.startDate),
      },
      {
        key: 'endDate',
        label: 'End Date',
        sortable: true,
        render: (row) => formatDateTime(row.endDate),
      },
      {
        key: 'status',
        label: 'Status',
        sortable: true,
        render: (row) => <StatusBadge status={row.status} />,
      },
      {
        key: 'approver',
        label: 'Approver',
        render: (row) => row.approver || '—',
      },
      {
        key: 'requestedAt',
        label: 'Requested At',
        sortable: true,
        render: (row) => formatDateTime(row.requestedAt),
      },
      {
        key: 'updatedAt',
        label: 'Updated At',
        sortable: true,
        render: (row) => formatDateTime(row.updatedAt),
      },
    ],
    []
  );

  const handleExport = () => {
    const headers = columns.map((c) => c.label);
    const rows = data.map((row) =>
      columns.map((col) => {
        const val = row[col.key];
        if (Array.isArray(val)) return val.join('; ');
        if (col.key === 'status') return val;
        if (col.key.includes('Date') || col.key.includes('At')) return formatDateTime(val);
        return val ?? '';
      })
    );
    exportToCsv(`request-logs-${Date.now()}.csv`, headers, rows);
    addToast('CSV exported successfully');
  };

  const summary = meta.summary || {};

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">Request Logs</h2>
          <p className="mt-1 text-sm text-text-muted">
            Historical IAM access requests (read-only)
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-text-muted">
            Last synced {secondsAgo} sec ago
          </span>
          <button
            type="button"
            onClick={refresh}
            className="inline-flex items-center gap-1.5 rounded border border-border bg-white px-3 py-2 text-sm text-text transition-colors hover:border-primary hover:text-primary"
            aria-label="Refresh now"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          <button
            type="button"
            onClick={handleExport}
            disabled={!data.length}
            className="inline-flex items-center gap-1.5 rounded bg-primary px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard label="Pending" value={summary.pending ?? 0} accent="amber" />
        <SummaryCard label="Approved" value={summary.approved ?? 0} accent="emerald" />
        <SummaryCard label="Declined" value={summary.declined ?? 0} accent="red" />
        <SummaryCard label="Active Access" value={summary.activeAccess ?? 0} accent="primary" />
      </div>

      <div className="mt-6">
        <FilterBar
          filters={filters}
          onChange={setFilters}
          statusOptions={Object.values(REQUEST_STATUS)}
        />
      </div>

      <div className="mt-6">
        {loading ? (
          <SkeletonTable rows={6} cols={8} />
        ) : data.length === 0 ? (
          <EmptyState
            title="No requests found"
            description="Try adjusting your search or filter criteria."
          />
        ) : (
          <DataTable
            columns={columns}
            data={data}
            sortKey={sortKey}
            sortDir={sortDir}
            onSort={handleSort}
            stickyHeader
          />
        )}
      </div>

      {!loading && meta.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-text-muted">
            Showing page {page} of {meta.totalPages} ({meta.total} total)
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded border border-border px-3 py-1.5 text-sm disabled:opacity-50 hover:bg-white"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={page >= meta.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded border border-border px-3 py-1.5 text-sm disabled:opacity-50 hover:bg-white"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
