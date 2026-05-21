import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth.jsx';
import { ToastProvider } from './hooks/useToast.jsx';
import AppLayout from './layouts/AppLayout';
import LoginPage from './pages/LoginPage';
import NewRequestPage from './pages/NewRequestPage';
import RequestLogsPage from './pages/RequestLogsPage';
import CurrentAccessPage from './pages/CurrentAccessPage';
import Loader from './components/Loader';
import { ROUTES } from './constants';

function ProtectedRoute({ children }) {
  const { status } = useAuth();

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <Loader size="lg" label="Checking authentication..." />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return <LoginPage />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to={ROUTES.NEW_REQUEST} replace />} />
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
