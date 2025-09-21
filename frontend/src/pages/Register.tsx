import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { apiClient } from '../lib/api/client.js';

const registerSchema = z.object({
  name: z.string().min(2, { message: 'Invalid input data' }),
  email: z.string().email({ message: 'Invalid input data' }),
  password: z.string().min(8, { message: 'Invalid input data' }),
});

type RegisterInput = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });
  const [error, setError] = React.useState('');

  const onSubmit = async (values: RegisterInput) => {
    setError('');
    try {
      await apiClient.register(values);
      navigate({ to: '/login' });
    } catch (e) {
      const status = (e as { response?: { status?: number } }).response?.status;
      if (status === 400) setError('Invalid input data');
      else if (status === 409) setError('User already exists');
      else setError('Invalid input data');
    }
  };

  return (
    <div data-testid="register-page">
      <h2>Register</h2>
      <form
        data-testid="register-form"
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: 'contents' }}
        noValidate
        aria-busy={isSubmitting}
      >
        <label htmlFor="name">Name</label>
        <input
          data-testid="name-input"
          type="text"
          aria-invalid={!!errors.name}
          {...register('name')}
        />
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
        <button type="submit" data-testid="register-button" disabled={isSubmitting}>
          Register
        </button>
      </form>
      <p
        data-testid="register-error"
        role="alert"
        aria-live="assertive"
        style={{ display: error || Object.keys(errors).length ? 'block' : 'none' }}
      >
        {error || errors.name?.message || errors.email?.message || errors.password?.message}
      </p>
    </div>
  );
}
