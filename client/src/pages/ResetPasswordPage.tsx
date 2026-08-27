import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useSearchParams } from 'react-router-dom';
import { KeyRound, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordForm) => {
    if (!token) {
      setServerError('Reset token is missing or invalid.');
      return;
    }

    try {
      setServerError(null);
      await api.post('/auth/reset-password', {
        token,
        password: data.password,
      });
      setIsSuccess(true);
    } catch (err: any) {
      setServerError(
        err.response?.data?.message ||
          'Failed to reset password. The link may have expired or already been used.'
      );
    }
  };

  if (!token) {
    return (
      <div className="bg-[var(--bg-surface)] p-8 rounded-2xl shadow-xl border border-[var(--border-color)] max-w-md w-full text-center space-y-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--color-brand-brick)]/10 text-[var(--color-brand-brick)] font-bold text-2xl border border-[var(--color-brand-brick)]/20 shadow-xs">
          <AlertCircle className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[var(--text-main)] mb-2 font-serif">
            Invalid Reset Link
          </h1>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            The password reset link is invalid or incomplete. Please request a new link from the forgot password page.
          </p>
        </div>
        <div className="pt-2">
          <Link
            to="/forgot-password"
            className="inline-flex items-center justify-center gap-2 text-xs font-semibold text-[var(--primary)] hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Request New Reset Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg-surface)] p-8 rounded-2xl shadow-xl border border-[var(--border-color)] max-w-md w-full">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] font-bold text-2xl mb-4 border border-[var(--primary)]/20 shadow-xs">
          <KeyRound className="w-7 h-7" />
        </div>
        <h1 className="text-3xl font-black tracking-tight text-[var(--primary)] mb-2 font-serif">
          Reset Password
        </h1>
        <p className="text-sm text-[var(--text-muted)]">
          {isSuccess
            ? 'Your password has been successfully updated'
            : 'Enter a strong new password for your account'}
        </p>
      </div>

      {serverError && (
        <div className="mb-6 p-3.5 rounded-xl bg-[var(--color-brand-brick)]/10 border border-[var(--color-brand-brick)]/20 text-[var(--color-brand-brick)] text-xs flex items-center gap-2.5">
          <span className="text-base">⚠️</span>
          <span>{serverError}</span>
        </div>
      )}

      {isSuccess ? (
        <div className="space-y-6 text-center">
          <div className="p-4 rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-xs text-[var(--text-main)] space-y-2 text-left">
            <div className="flex items-center gap-2 font-semibold text-[var(--accent)]">
              <CheckCircle2 className="w-4 h-4" />
              <span>Password Changed Successfully</span>
            </div>
            <p className="text-[var(--text-muted)] leading-relaxed">
              Your password has been securely updated. You can now use your new password to sign in to Proodos.
            </p>
          </div>

          <div className="pt-2">
            <Link
              to="/login"
              className="inline-flex items-center justify-center w-full py-3 px-4 rounded-xl bg-[var(--primary)] text-white font-medium text-xs shadow-sm hover:opacity-95 transition-opacity"
            >
              Sign In to Your Account
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="New Password"
            type="password"
            placeholder="Minimum 6 characters"
            {...register('password')}
            error={errors.password?.message}
          />

          <Input
            label="Confirm New Password"
            type="password"
            placeholder="Repeat new password"
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
          />

          <div className="text-[11px] text-[var(--text-muted)] bg-black/5 dark:bg-white/5 p-3 rounded-lg space-y-1">
            <p className="font-semibold text-[var(--text-main)]">Password Requirements:</p>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Must be at least 6 characters long</li>
              <li>Must match confirm password field</li>
            </ul>
          </div>

          <Button
            type="submit"
            className="w-full mt-2"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Updating Password...' : 'Set New Password'}
          </Button>

          <div className="mt-6 pt-6 border-t border-[var(--border-color)] text-center text-xs">
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Sign In
            </Link>
          </div>
        </form>
      )}
    </div>
  );
};

export default ResetPasswordPage;
