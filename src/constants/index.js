export const APP_NAME = 'Self Service Portal';

export const ROUTES = {
  NEW_REQUEST: '/new-request',
  REQUEST_LOGS: '/request-logs',
  CURRENT_ACCESS: '/current-access',
};

export const REQUEST_STATUS = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  DECLINED: 'Declined',
};

export const ACCESS_STATUS = {
  ACTIVE: 'Active',
  EXPIRING_SOON: 'Expiring Soon',
  EXPIRED: 'Expired',
};

export const POLL_INTERVAL_MS = 30000;

export const DEFAULT_PAGE_SIZE = 10;

export const DEBOUNCE_MS = 300;
