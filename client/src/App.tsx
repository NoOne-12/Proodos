import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store, RootState } from './store';
import { setUser, logout, setLoading } from './store/authSlice';
import api from './services/api';

import Dashboard from './pages/Dashboard';
import RoadmapsList from './pages/RoadmapsList';
import RoadmapDetail from './pages/RoadmapDetail';
import LearningSessionPage from './pages/LearningSessionPage';
import GoalsPage from './pages/GoalsPage';
import StatisticsPage from './pages/StatisticsPage';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';
import Login from './pages/Login';
import Register from './pages/Register';

import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Component to verify token on app startup
const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const { isLoading, isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await api.get('/auth/me');
        if (res.data.success) {
          dispatch(setUser({ user: res.data.data, token: token || undefined }));
        } else {
          dispatch(logout());
        }
      } catch (err) {
        dispatch(logout());
      } finally {
        dispatch(setLoading(false));
      }
    };

    checkAuth();
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-main)] text-[var(--primary)]">
        <div className="w-12 h-12 rounded-2xl bg-[var(--primary)] text-white font-serif font-black text-2xl flex items-center justify-center animate-bounce shadow-lg mb-4">
          Π
        </div>
        <p className="font-serif font-bold tracking-widest text-sm uppercase text-[var(--text-muted)] animate-pulse">
          Loading Proodos OS...
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

// Route wrapper for protected pages
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// Route wrapper for public-only auth pages
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <Provider store={store}>
      <AuthInitializer>
        <Router>
          <Routes>
            {/* Public Authentication Routes */}
            <Route
              element={
                <PublicRoute>
                  <AuthLayout />
                </PublicRoute>
              }
            >
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            {/* Protected Application Routes */}
            <Route
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<Dashboard />} />
              <Route path="/roadmaps" element={<RoadmapsList />} />
              <Route path="/roadmaps/:id" element={<RoadmapDetail />} />
              <Route path="/learning" element={<LearningSessionPage />} />
              <Route path="/goals" element={<GoalsPage />} />
              <Route path="/statistics" element={<StatisticsPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthInitializer>
    </Provider>
  );
}

export default App;
