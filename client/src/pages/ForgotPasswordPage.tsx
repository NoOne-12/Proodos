import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export const ForgotPasswordPage: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    try {
      setServerError(null);
      await api.post('/auth/forgot-password', data);
      setSubmittedEmail(data.email);
      setIsSubmitted(true);
    } catch (err: any) {
      setServerError(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="bg-[var(--bg-surface)] p-8 rounded-2xl shadow-xl border border-[var(--border-color)] max-w-md w-full">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] font-bold text-2xl mb-4 border border-[var(--primary)]/20 shadow-xs">
          <Mail className="w-7 h-7" />
        </div>
        <h1 className="text-3xl font-black tracking-tight text-[var(--primary)] mb-2 font-serif">
          Forgot Password
        </h1>
        <p className="text-sm text-[var(--text-muted)]">
          {isSubmitted
            ? 'Check your inbox for password reset instructions'
            : 'Enter your email and we will send you a reset link'}
        </p>
      </div>

      {serverError && (
        <div className="mb-6 p-3.5 rounded-xl bg-[var(--color-brand-brick)]/10 border border-[var(--color-brand-brick)]/20 text-[var(--color-brand-brick)] text-xs flex items-center gap-2.5">
          <span className="text-base">⚠️</span>
          <span>{serverError}</span>
        </div>
      )}

      {isSubmitted ? (
        <div className="space-y-6 text-center">
          <div className="p-4 rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-xs text-[var(--text-main)] space-y-2 text-left">
            <div className="flex items-center gap-2 font-semibold text-[var(--accent)]">
              <CheckCircle2 className="w-4 h-4" />
              <span>Reset Email Sent</span>
            </div>
            <p className="text-[var(--text-muted)] leading-relaxed">
              If an account with <strong className="text-[var(--text-main)]">{submittedEmail}</strong> exists, you will receive an email shortly with instructions to reset your password.
            </p>
          </div>

          <div className="pt-2">
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 text-xs font-semibold text-[var(--primary)] hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Return to Login
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="example@email.com"
            {...register('email')}
            error={errors.email?.message}
          />

          <Button
            type="submit"
            className="w-full mt-2"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending Reset Link...' : 'Send Reset Link'}
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

export default ForgotPasswordPage;
