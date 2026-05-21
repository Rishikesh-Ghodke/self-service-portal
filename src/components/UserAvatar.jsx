export default function UserAvatar({ initials, size = 'md', className = '' }) {
  const sizeClass =
    size === 'sm' ? 'h-8 w-8 text-xs' : size === 'lg' ? 'h-12 w-12 text-base' : 'h-9 w-9 text-sm';
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-primary font-semibold text-white ${sizeClass} ${className}`}
      aria-hidden
    >
      {initials}
    </div>
  );
}
