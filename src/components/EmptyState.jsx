import { Inbox } from 'lucide-react';

export default function EmptyState({ title = 'No data found', description, icon: Icon = Inbox }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="mb-4 rounded-full bg-surface p-4">
        <Icon className="h-8 w-8 text-text-muted" aria-hidden />
      </div>
      <h3 className="text-lg font-semibold text-text">{title}</h3>
      {description && (
        <p className="mt-2 max-w-md text-sm text-text-muted">{description}</p>
      )}
    </div>
  );
}
