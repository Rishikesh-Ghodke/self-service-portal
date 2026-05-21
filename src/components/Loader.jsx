import { Loader2 } from 'lucide-react';

export default function Loader({ size = 'md', label = 'Loading...' }) {
  const sizeClass = size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-8 w-8' : 'h-6 w-6';
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-8" role="status">
      <Loader2 className={`${sizeClass} animate-spin text-primary`} aria-hidden />
      <span className="text-sm text-text-muted">{label}</span>
    </div>
  );
}
