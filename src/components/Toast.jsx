import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '../hooks/useToast.jsx';

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (!toasts.length) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-2"
      role="region"
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex min-w-[280px] max-w-sm items-start gap-3 rounded border bg-white px-4 py-3 shadow-lg transition-all ${
            toast.type === 'error' ? 'border-red-200' : 'border-emerald-200'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
          ) : (
            <CheckCircle className="h-5 w-5 shrink-0 text-emerald-500" />
          )}
          <p className="flex-1 text-sm text-text">{toast.message}</p>
          <button
            type="button"
            onClick={() => removeToast(toast.id)}
            className="shrink-0 text-text-muted hover:text-text"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
