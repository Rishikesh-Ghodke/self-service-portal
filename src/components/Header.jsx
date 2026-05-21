import UserAvatar from './UserAvatar';
import PortalBrand from './PortalBrand';

export default function Header({ user, onMenuToggle }) {
  return (
    <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-white px-4 lg:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button
          type="button"
          onClick={onMenuToggle}
          className="shrink-0 rounded p-2 text-text-muted hover:bg-surface lg:hidden"
          aria-label="Toggle menu"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <PortalBrand />
      </div>
      {user && (
        <div className="flex shrink-0 items-center gap-3 pl-3">
          <UserAvatar initials={user.initials} />
          <span className="hidden text-sm text-text-muted md:inline">{user.email}</span>
        </div>
      )}
    </header>
  );
}
