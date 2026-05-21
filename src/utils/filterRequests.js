import { parseISO, isWithinInterval, isValid } from 'date-fns';

export function filterRequests(requests, filters) {
  const {
    searchRequester = '',
    searchUser = '',
    searchProject = '',
    role = '',
    status = '',
    dateFrom = '',
    dateTo = '',
  } = filters;

  return requests.filter((req) => {
    if (searchRequester && !req.requester.toLowerCase().includes(searchRequester.toLowerCase())) {
      return false;
    }
    if (searchUser && !req.subjectUser.toLowerCase().includes(searchUser.toLowerCase())) {
      return false;
    }
    if (searchProject && !req.project.toLowerCase().includes(searchProject.toLowerCase())) {
      return false;
    }
    if (role && !req.roles.some((r) => r.toLowerCase().includes(role.toLowerCase()))) {
      return false;
    }
    if (status && req.status !== status) {
      return false;
    }
    if (dateFrom || dateTo) {
      const requested = parseISO(req.requestedAt);
      if (!isValid(requested)) return false;
      const from = dateFrom ? parseISO(`${dateFrom}T00:00:00`) : null;
      const to = dateTo ? parseISO(`${dateTo}T23:59:59`) : null;
      if (from && to && isValid(from) && isValid(to)) {
        if (!isWithinInterval(requested, { start: from, end: to })) return false;
      } else if (from && isValid(from) && requested < from) return false;
      else if (to && isValid(to) && requested > to) return false;
    }
    return true;
  });
}

export function sortRequests(requests, sortKey, sortDir) {
  if (!sortKey) return [...requests];
  const sorted = [...requests].sort((a, b) => {
    let aVal = a[sortKey];
    let bVal = b[sortKey];
    if (Array.isArray(aVal)) aVal = aVal.join(', ');
    if (Array.isArray(bVal)) bVal = bVal.join(', ');
    if (aVal == null) return 1;
    if (bVal == null) return -1;
    if (typeof aVal === 'string') {
      return aVal.localeCompare(bVal);
    }
    return aVal > bVal ? 1 : -1;
  });
  return sortDir === 'desc' ? sorted.reverse() : sorted;
}

export function paginate(items, page, limit) {
  const start = (page - 1) * limit;
  return {
    data: items.slice(start, start + limit),
    total: items.length,
    page,
    limit,
    totalPages: Math.ceil(items.length / limit) || 1,
  };
}
