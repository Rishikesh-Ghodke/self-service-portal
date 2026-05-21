import { format, parseISO, isValid } from 'date-fns';

export function formatDateTime(value, pattern = 'MMM d, yyyy h:mm a') {
  if (!value) return '—';
  try {
    const date = typeof value === 'string' ? parseISO(value) : value;
    if (!isValid(date)) return '—';
    return format(date, pattern);
  } catch {
    return '—';
  }
}

export function formatDate(value, pattern = 'MMM d, yyyy') {
  return formatDateTime(value, pattern);
}

export function toDatetimeLocalValue(isoString) {
  if (!isoString) return '';
  const date = parseISO(isoString);
  if (!isValid(date)) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function fromDatetimeLocalValue(localValue) {
  if (!localValue) return null;
  return new Date(localValue).toISOString();
}
