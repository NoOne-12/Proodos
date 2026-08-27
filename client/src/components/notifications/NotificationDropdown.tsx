import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, CheckCheck, Sparkles, X } from 'lucide-react';
import api from '../../services/api';
import { NotificationItem } from '../../types';

interface NotificationDropdownProps {
  placement?: 'bottom-sidebar' | 'top-header';
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ 
  placement = 'top-header' 
}) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      if (res.data.success) {
        setNotifications(res.data.data);
        setUnreadCount(res.data.unreadCount);
      }
    } catch (e) {
      console.error('Failed to fetch notifications:', e);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // 1 min poll
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id: string, linkUrl?: string | null) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      if (linkUrl) {
        setIsOpen(false);
        navigate(linkUrl);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
        title="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--secondary)] ring-2 ring-[var(--bg-surface)]" />
        )}
      </button>

      {isOpen && (
        <div 
          className={`fixed sm:absolute z-50 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 ${
            placement === 'bottom-sidebar'
              ? 'left-4 bottom-20 w-80 sm:w-96 sm:left-0 sm:bottom-12'
              : 'right-3 top-16 w-[calc(100vw-24px)] max-w-sm sm:right-0 sm:top-auto sm:mt-2 sm:w-96'
          }`}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-color)] bg-black/5 dark:bg-white/5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-serif text-[var(--text-main)]">Notifications</span>
              {unreadCount > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[var(--secondary)] text-white">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-[11px] font-semibold text-[var(--primary)] hover:underline flex items-center gap-1"
              >
                <CheckCheck className="w-3 h-3" /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-[var(--border-color)]">
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleMarkAsRead(n.id, n.linkUrl)}
                  className={`p-3.5 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-colors space-y-1 ${
                    !n.read ? 'bg-[var(--primary)]/5 font-medium' : 'opacity-80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-bold text-[var(--text-main)]">{n.title}</p>
                    {!n.read && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--secondary)] shrink-0 mt-1" />
                    )}
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">{n.message}</p>
                  <p className="text-[9px] text-[var(--text-muted)] pt-0.5">
                    {new Date(n.createdAt).toLocaleDateString()} at {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-[var(--text-muted)] space-y-1">
                <Sparkles className="w-6 h-6 mx-auto opacity-30 mb-1 text-[var(--primary)]" />
                <p className="font-semibold text-[var(--text-main)]">You're all caught up</p>
                <p className="text-[11px]">Milestones and focus streak updates will appear here.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
