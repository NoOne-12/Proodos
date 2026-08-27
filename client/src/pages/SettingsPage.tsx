import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  User, 
  Lock, 
  Settings as SettingsIcon, 
  ShieldCheck, 
  CheckCircle2, 
  LogOut,
  Moon,
  Sun,
  Sparkles
} from 'lucide-react';
import { RootState } from '../store';
import { updateUser, logout } from '../store/authSlice';
import api from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const SettingsPage: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const [name, setName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setSavingProfile(true);
      setStatusMessage(null);
      const res = await api.put('/auth/profile', { name });
      if (res.data.success) {
        dispatch(updateUser(res.data.data));
        setStatusMessage({ type: 'success', text: 'Profile name updated successfully!' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile.' });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;
    if (newPassword !== confirmPassword) {
      setStatusMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    if (newPassword.length < 6) {
      setStatusMessage({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }

    try {
      setSavingPassword(true);
      setStatusMessage(null);
      const res = await api.put('/auth/profile', {
        currentPassword,
        newPassword
      });
      if (res.data.success) {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setStatusMessage({ type: 'success', text: 'Password changed successfully!' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update password.' });
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="border-b border-[var(--border-color)] pb-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--primary)] mb-1">
          <SettingsIcon className="w-4 h-4" />
          Account & Preferences
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--primary)] font-serif">
          Settings & Profile
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
          Manage your account identity, security, and learning preferences.
        </p>
      </div>

      {statusMessage && (
        <div
          className={`p-4 rounded-2xl border flex items-center gap-3 font-semibold text-sm animate-in fade-in ${
            statusMessage.type === 'success'
              ? 'bg-[var(--accent)]/15 border-[var(--accent)]/30 text-[var(--accent)]'
              : 'bg-[var(--color-brand-brick)]/15 border-[var(--color-brand-brick)]/30 text-[var(--color-brand-brick)]'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <ShieldCheck className="w-5 h-5 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      <div className="grid gap-8 md:grid-cols-2">
        {/* Profile Card */}
        <Card className="border-[var(--border-color)]">
          <CardHeader>
            <CardTitle className="text-lg font-bold font-serif flex items-center gap-2">
              <User className="w-5 h-5 text-[var(--primary)]" />
              Public Profile
            </CardTitle>
            <p className="text-xs text-[var(--text-muted)]">Your identity on Proodos.</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-[var(--secondary)] text-white font-bold text-xl flex items-center justify-center uppercase shadow">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="text-sm font-bold text-[var(--text-main)]">{user?.name || 'User'}</p>
                  <p className="text-xs text-[var(--text-muted)]">{user?.email}</p>
                </div>
              </div>

              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <Input
                label="Email Address"
                value={user?.email || ''}
                disabled
                className="bg-black/5 dark:bg-white/5 cursor-not-allowed opacity-75"
              />

              <Button type="submit" className="w-full mt-2" disabled={savingProfile}>
                {savingProfile ? 'Saving...' : 'Save Profile Changes'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Security & Password Card */}
        <Card className="border-[var(--border-color)]">
          <CardHeader>
            <CardTitle className="text-lg font-bold font-serif flex items-center gap-2">
              <Lock className="w-5 h-5 text-[var(--primary)]" />
              Security & Password
            </CardTitle>
            <p className="text-xs text-[var(--text-muted)]">Update your account credentials.</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <Input
                label="Current Password"
                type="password"
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />

              <Input
                label="New Password"
                type="password"
                placeholder="Minimum 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />

              <Input
                label="Confirm New Password"
                type="password"
                placeholder="Repeat new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <Button type="submit" variant="outline" className="w-full mt-2" disabled={savingPassword}>
                {savingPassword ? 'Updating...' : 'Change Password'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
