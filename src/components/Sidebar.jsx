import { NavLink } from 'react-router-dom';
import { FilePlus, ScrollText, Shield } from 'lucide-react';
import { ROUTES } from '../constants';

const navItems = [
  { to: ROUTES.NEW_REQUEST, label: 'New Request', icon: FilePlus },
  { to: ROUTES.REQUEST_LOGS, label: 'Request Logs', icon: ScrollText },
  { to: ROUTES.CURRENT_ACCESS, label: 'Current Access', icon: Shield },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}
      <aside
        className={`fixed left-0 top-16 z-30 flex h-[calc(100vh-4rem)] w-64 flex-col border-r border-border bg-white transition-transform duration-200 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Main navigation">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-text hover:bg-primary-light hover:text-primary'
                }`
              }
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-border p-4">
          <p className="text-xs text-text-muted">Internal use only</p>
        </div>
      </aside>
    </>
  );
}
