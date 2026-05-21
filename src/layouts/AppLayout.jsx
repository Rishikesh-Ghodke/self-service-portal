import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import ToastContainer from '../components/Toast';
import { useAuth } from '../hooks/useAuth';

export default function AppLayout() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface">
      <Header user={user} onMenuToggle={() => setSidebarOpen((v) => !v)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="lg:pl-64">
        <div className="mx-auto max-w-7xl px-4 pb-8 pt-20 lg:px-8">
          <Outlet />
        </div>
      </main>
      <ToastContainer />
    </div>
  );
}
