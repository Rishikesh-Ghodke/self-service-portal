import { REQUEST_STATUS, ACCESS_STATUS } from './index';

export const requestStatusStyles = {
  [REQUEST_STATUS.PENDING]: 'bg-amber-50 text-amber-800 border-amber-200',
  [REQUEST_STATUS.APPROVED]: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  [REQUEST_STATUS.DECLINED]: 'bg-red-50 text-red-800 border-red-200',
};

export const accessStatusStyles = {
  [ACCESS_STATUS.ACTIVE]: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  [ACCESS_STATUS.EXPIRING_SOON]: 'bg-amber-50 text-amber-800 border-amber-200',
  [ACCESS_STATUS.EXPIRED]: 'bg-gray-100 text-gray-600 border-gray-200',
};
