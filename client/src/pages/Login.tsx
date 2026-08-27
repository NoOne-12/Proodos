import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/authSlice';
import api from '../services/api';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [serverError, setServerError] = React.useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setServerError(null);
      const res = await api.post('/auth/login', data);
      if (res.data.success) {
        dispatch(setUser({ user: res.data.data, token: res.data.token }));
        navigate('/');
      }
    } catch (err: any) {
      setServerError(err.response?.data?.message || 'Login failed. Please verify credentials.');
    }
  };

  return (
    <div className="bg-[var(--bg-surface)] p-8 rounded-2xl shadow-xl border border-[var(--border-color)] max-w-md w-full">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] font-bold text-2xl mb-4 border border-[var(--primary)]/20">
          Π
        </div>
        <h1 className="text-3xl font-black tracking-tight text-[var(--primary)] mb-2 font-serif">PROODOS</h1>
        <p className="text-sm text-[var(--text-muted)]">Your Personal Learning Operating System</p>
      </div>

      {serverError && (
        <div className="mb-6 p-3 rounded-lg bg-[var(--color-brand-brick)]/10 border border-[var(--color-brand-brick)]/20 text-[var(--color-brand-brick)] text-sm flex items-center gap-2">
          <span>⚠️</span>
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="demo@proodos.app"
          {...register('email')}
          error={errors.email?.message}
        />
        
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          {...register('password')}
          error={errors.password?.message}
        />
        
        <div className="flex items-center justify-between text-xs py-1">
          <label className="flex items-center gap-2 cursor-pointer text-[var(--text-muted)]">
            <input type="checkbox" className="rounded border-[var(--border-color)] accent-[var(--primary)]" />
            Remember me
          </label>
          <span className="text-[var(--secondary)] hover:underline cursor-pointer">Forgot password?</span>
        </div>

        <Button type="submit" className="w-full mt-2" size="lg" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Sign In to Proodos'}
        </Button>
      </form>

      <div className="mt-6 pt-6 border-t border-[var(--border-color)] text-center text-xs text-[var(--text-muted)]">
        <p className="mb-3">
          Quick Demo Credentials: <span className="font-mono text-[var(--primary)] font-semibold">demo@proodos.app / password123</span>
        </p>
        <p>
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-[var(--primary)] hover:underline">
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
