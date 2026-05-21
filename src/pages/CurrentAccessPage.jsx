import { useState, useEffect, useCallback } from 'react';
import SearchInput from '../components/SearchInput';
import StatusBadge from '../components/StatusBadge';
import UserAvatar from '../components/UserAvatar';
import CopyButton from '../components/CopyButton';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import { getAccess } from '../api/accessApi';
import { useDebounce } from '../hooks/useDebounce';
import { useToast } from '../hooks/useToast';
import { DEBOUNCE_MS, DEFAULT_PAGE_SIZE } from '../constants';
import { formatDate } from '../utils/formatDate';
import { getErrorMessage } from '../utils/apiError';

export default function CurrentAccessPage() {
  const { addToast } = useToast();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState([]);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1 });

  const debouncedSearch = useDebounce(search, DEBOUNCE_MS);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getAccess({
        search: debouncedSearch,
        page,
        limit: 5,
      });
      setGroups(result.data);
      setMeta(result.meta);
    } catch (err) {
      addToast(getErrorMessage(err, 'Failed to load access records'), 'error');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, page, addToast]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getInitials = (name) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  return (
    <div>
      <h2 className="text-2xl font-bold text-primary">Current Access</h2>
      <p className="mt-1 text-sm text-text-muted">
        Active IAM access mappings by user and project
      </p>

      <div className="mt-6 max-w-md">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by user, email, project, or role..."
        />
      </div>

      <div className="mt-6 space-y-4">
        {loading ? (
          <Loader label="Loading access records..." />
        ) : groups.length === 0 ? (
          <EmptyState
            title="No access records found"
            description="No active access matches your search criteria."
          />
        ) : (
          groups.map((group) => (
            <div
              key={group.email}
              className="overflow-hidden rounded border border-border bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-center gap-3 border-b border-border bg-surface px-5 py-4">
                <UserAvatar initials={getInitials(group.user)} />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-text">{group.user}</p>
                  <div className="flex items-center gap-1">
                    <p className="truncate text-sm text-text-muted">{group.email}</p>
                    <CopyButton value={group.email} label="Copy email" />
                  </div>
                </div>
                <span className="text-xs text-text-muted">
                  {group.projects.length} project{group.projects.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="divide-y divide-border">
                {group.projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-text">{proj.project}</p>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {proj.roles.map((role) => (
                          <span
                            key={role}
                            className="rounded bg-primary-light px-2 py-0.5 text-xs font-medium text-primary"
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                      <p className="mt-2 text-xs text-text-muted">
                        {formatDate(proj.startDate)} — {formatDate(proj.endDate)}
                      </p>
                    </div>
                    <StatusBadge status={proj.status} variant="access" />
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {!loading && meta.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-text-muted">
            Page {page} of {meta.totalPages} ({meta.total} users)
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded border border-border bg-white px-3 py-1.5 text-sm disabled:opacity-50 hover:border-primary"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={page >= meta.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded border border-border bg-white px-3 py-1.5 text-sm disabled:opacity-50 hover:border-primary"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
