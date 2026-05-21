export const USER_ROLES = {
  REQUESTER: 'requester',
  ADMIN: 'admin',
};

const DASHBOARD_ROUTES = {
  [USER_ROLES.ADMIN]: '/request-logs',
  [USER_ROLES.REQUESTER]: '/new-request',
};

export function getDashboardRoute(role) {
  return DASHBOARD_ROUTES[role] || DASHBOARD_ROUTES[USER_ROLES.REQUESTER];
}
