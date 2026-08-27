import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/authSlice';
import api from '../services/api';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { SocialAuthButtons } from '../components/auth/SocialAuthButtons';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ['confirmPassword']
});

type RegisterForm = z.infer<typeof registerSchema>;

const Register: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      setServerError(null);
      const res = await api.post('/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password
      });

      if (res.data.success) {
        dispatch(setUser({ user: res.data.data, token: res.data.token }));
        navigate('/');
      }
    } catch (err: any) {
      setServerError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="bg-[var(--bg-surface)] p-8 rounded-2xl shadow-xl border border-[var(--border-color)] max-w-md w-full">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] font-bold text-2xl mb-4 border border-[var(--primary)]/20 shadow-xs">
          Π
        </div>
        <h1 className="text-3xl font-black tracking-tight text-[var(--primary)] mb-2 font-serif">Join PROODOS</h1>
        <p className="text-sm text-[var(--text-muted)]">Begin your personalized learning journey</p>
      </div>

      {serverError && (
        <div className="mb-6 p-3.5 rounded-xl bg-[var(--color-brand-brick)]/10 border border-[var(--color-brand-brick)]/20 text-[var(--color-brand-brick)] text-xs flex items-center gap-2.5">
          <span className="text-base">⚠️</span>
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          placeholder="Alex Rivera"
          {...register('name')}
          error={errors.name?.message}
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="alex@example.com"
          {...register('email')}
          error={errors.email?.message}
        />
        
        <Input
          label="Password"
          type="password"
          placeholder="Minimum 6 characters"
          {...register('password')}
          error={errors.password?.message}
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Repeat password"
          {...register('confirmPassword')}
          error={errors.confirmPassword?.message}
        />

        <Button type="submit" className="w-full mt-4" size="lg" disabled={isSubmitting}>
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>

      <SocialAuthButtons isLoading={isSubmitting} />

      <p className="mt-6 text-center text-xs text-[var(--text-muted)] border-t border-[var(--border-color)] pt-6">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-[var(--primary)] hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default Register;
