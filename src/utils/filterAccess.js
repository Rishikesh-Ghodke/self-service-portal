export function filterAccessRecords(records, search = '') {
  if (!search.trim()) return records;
  const q = search.toLowerCase();
  return records.filter(
    (r) =>
      r.user.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.project.toLowerCase().includes(q) ||
      r.roles.some((role) => role.toLowerCase().includes(q))
  );
}

export function groupAccessByUser(records) {
  const map = new Map();
  for (const record of records) {
    const key = record.email;
    if (!map.has(key)) {
      map.set(key, { user: record.user, email: record.email, projects: [] });
    }
    map.get(key).projects.push({
      id: record.id,
      project: record.project,
      roles: record.roles,
      startDate: record.startDate,
      endDate: record.endDate,
      status: record.status,
    });
  }
  return Array.from(map.values());
}

export function paginateGroups(groups, page, limit) {
  const start = (page - 1) * limit;
  return {
    data: groups.slice(start, start + limit),
    total: groups.length,
    page,
    limit,
    totalPages: Math.ceil(groups.length / limit) || 1,
  };
}
