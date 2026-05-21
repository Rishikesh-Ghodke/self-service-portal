import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth.jsx';
import { ToastProvider } from './hooks/useToast.jsx';
import AppLayout from './layouts/AppLayout';
import LandingPage from './pages/LandingPage';
import NewRequestPage from './pages/NewRequestPage';
import RequestLogsPage from './pages/RequestLogsPage';
import CurrentAccessPage from './pages/CurrentAccessPage';
import Loader from './components/Loader';
import { ROUTES } from './constants';
import { getDashboardRoute } from './constants/roles';

function LandingRoute() {
  const { status, user } = useAuth();

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <Loader size="lg" label="Loading..." />
      </div>
    );
  }

  if (status === 'authenticated' && user) {
    return <Navigate to={getDashboardRoute(user.role)} replace />;
  }

  return <LandingPage />;
}

function ProtectedRoute({ children }) {
  const { status } = useAuth();

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <Loader size="lg" label="Checking authentication..." />
      </div>
    );
  }

  if (status !== 'authenticated') {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingRoute />} />
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path={ROUTES.NEW_REQUEST} element={<NewRequestPage />} />
        <Route path={ROUTES.REQUEST_LOGS} element={<RequestLogsPage />} />
        <Route path={ROUTES.CURRENT_ACCESS} element={<CurrentAccessPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
