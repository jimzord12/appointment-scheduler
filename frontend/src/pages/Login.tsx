import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { apiClient } from '../lib/api/client.js';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid input data' }),
  password: z.string().min(1, { message: 'Invalid input data' }),
});

type LoginInput = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });
  const [error, setError] = React.useState('');

  const onSubmit = async (values: LoginInput) => {
    setError('');
    try {
      const res = await apiClient.login(values);
      localStorage.setItem('token', res.token);
      if (res.user?.role) {
        localStorage.setItem('role', res.user.role);
      }
      navigate({ to: '/dashboard' });
    } catch (e) {
      const msg =
        (e as { response?: { status?: number } }).response?.status === 400
          ? 'Invalid input data'
          : 'Invalid credentials';
      setError(msg);
    }
  };

  return (
    <div data-testid="login-page">
      <h2>Login</h2>
      <form
        data-testid="login-form"
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: 'contents' }}
        aria-busy={isSubmitting}
      >
        <label htmlFor="email">Email</label>
        <input
          data-testid="email-input"
          type="email"
          aria-invalid={!!errors.email}
          {...register('email')}
        />
        <label htmlFor="password">Password</label>
        <input
          data-testid="password-input"
          type="password"
          aria-invalid={!!errors.password}
          {...register('password')}
        />
        <button type="submit" data-testid="login-button" disabled={isSubmitting}>
          Login
        </button>
      </form>
      <p
        data-testid="login-error"
        role="alert"
        aria-live="assertive"
        style={{ display: error || errors.email || errors.password ? 'block' : 'none' }}
      >
        {error || errors.email?.message || errors.password?.message}
      </p>
    </div>
  );
}
