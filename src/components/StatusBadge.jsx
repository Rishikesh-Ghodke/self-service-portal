import { requestStatusStyles, accessStatusStyles } from '../constants/statusColors';

export default function StatusBadge({ status, variant = 'request' }) {
  const styles =
    variant === 'access' ? accessStatusStyles[status] : requestStatusStyles[status];
  const base = 'inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium';
  return (
    <span className={`${base} ${styles || 'bg-gray-50 text-gray-700 border-gray-200'}`}>
      {status}
    </span>
  );
}
