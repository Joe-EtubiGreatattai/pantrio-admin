import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/auth.jsx';
import LoginPage    from './pages/LoginPage';
import OverviewPage from './pages/OverviewPage';
import EventsPage   from './pages/EventsPage';
import UsersPage    from './pages/UsersPage';
import Layout       from './components/Layout';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="page-loading"><span className="blink">▋</span></div>;
  return user ? <Layout>{children}</Layout> : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="page-loading"><span className="blink">▋</span></div>;
  return !user ? children : <Navigate to="/" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/"       element={<PrivateRoute><OverviewPage /></PrivateRoute>} />
      <Route path="/events" element={<PrivateRoute><EventsPage /></PrivateRoute>} />
      <Route path="/users"  element={<PrivateRoute><UsersPage /></PrivateRoute>} />
      <Route path="*"       element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
