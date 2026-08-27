import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  LayoutDashboard, 
  Map, 
  Clock, 
  Target, 
  BarChart2, 
  Timer, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  Sparkles,
  Play
} from 'lucide-react';
import { RootState } from '../store';
import { logout } from '../store/authSlice';
import api from '../services/api';
import { cn } from '../components/ui/Button';

export const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.documentElement.classList.contains('dark') || 
      localStorage.getItem('theme') === 'dark';
  });

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.error(e);
    } finally {
      dispatch(logout());
      navigate('/login');
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Roadmaps', path: '/roadmaps', icon: Map },
    { name: 'Focus Session', path: '/learning', icon: Timer },
    { name: 'Goals', path: '/goals', icon: Target },
    { name: 'Analytics', path: '/statistics', icon: BarChart2 },
    { name: 'History', path: '/history', icon: Clock },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-200">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-[var(--border-color)] bg-[var(--bg-surface)] px-4 py-6 justify-between shrink-0 h-screen sticky top-0">
        <div>
          {/* Logo */}
          <div className="flex items-center justify-between px-3 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--primary)] text-white flex items-center justify-center font-serif font-black text-xl shadow-md">
                Π
              </div>
              <div>
                <h1 className="text-xl font-black tracking-wider text-[var(--primary)] font-serif">PROODOS</h1>
                <p className="text-[10px] tracking-widest uppercase font-semibold text-[var(--text-muted)]">Learning OS</p>
              </div>
            </div>
          </div>

          {/* Quick Action Start Learning */}
          <div className="px-2 mb-6">
            <button
              onClick={() => navigate('/learning')}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white font-medium text-xs flex items-center justify-center gap-2 shadow-sm hover:opacity-95 transition-all hover:shadow"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Quick Focus Session
            </button>
          </div>

          {/* Nav List */}
          <nav className="space-y-1 px-2">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all",
                  isActive 
                    ? "bg-[var(--primary)] text-white shadow-sm" 
                    : "text-[var(--text-muted)] hover:bg-black/5 dark:hover:bg-white/5 hover:text-[var(--text-main)]"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer: User Card + Theme Toggle + Logout */}
        <div className="pt-4 border-t border-[var(--border-color)] space-y-3 px-2">
          <div className="flex items-center justify-between">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--text-muted)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-[var(--color-brand-ochre)]" /> : <Moon className="w-4 h-4 text-[var(--primary)]" />}
              <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-[var(--color-brand-brick)] hover:bg-[var(--color-brand-brick)]/10 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <div 
            onClick={() => navigate('/settings')}
            className="flex items-center gap-3 p-2 rounded-xl bg-black/5 dark:bg-white/5 cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-[var(--secondary)] text-white font-bold text-sm flex items-center justify-center uppercase shrink-0 shadow-sm">
              {user?.name ? user.name.charAt(0) : 'U'}
            </div>
            <div className="truncate flex-1">
              <p className="text-xs font-bold text-[var(--text-main)] truncate">{user?.name || 'Proodos Explorer'}</p>
              <p className="text-[10px] text-[var(--text-muted)] truncate">{user?.email || 'demo@proodos.app'}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Top Navbar */}
      <header className="md:hidden h-16 border-b border-[var(--border-color)] bg-[var(--bg-surface)] flex items-center justify-between px-4 sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[var(--primary)] text-white flex items-center justify-center font-serif font-black text-base shadow">
            Π
          </div>
          <span className="font-black font-serif text-lg tracking-wider text-[var(--primary)]">PROODOS</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-[var(--text-muted)]"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-[var(--color-brand-ochre)]" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Dropdown Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 bg-[var(--bg-surface)] border-b border-[var(--border-color)] p-4 shadow-xl z-30 space-y-2 animate-in slide-in-from-top-2 duration-150">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all",
                isActive 
                  ? "bg-[var(--primary)] text-white" 
                  : "text-[var(--text-muted)] hover:bg-black/5 dark:hover:bg-white/5"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </NavLink>
          ))}
          <div className="pt-3 border-t border-[var(--border-color)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[var(--secondary)] text-white font-bold text-xs flex items-center justify-center uppercase">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <span className="text-xs font-bold">{user?.name}</span>
            </div>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-[var(--color-brand-brick)] bg-[var(--color-brand-brick)]/10"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Main App Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
