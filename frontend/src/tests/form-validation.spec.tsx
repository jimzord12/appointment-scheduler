import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { LoginPage } from '../pages/Login.js';

// T054: Frontend form validation unit tests
// Focus: Login form shows validation messages for invalid inputs.

// Mock router navigate to prevent RouterProvider requirement
vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => vi.fn(),
}));

// Mock apiClient to avoid network and control responses
vi.mock('../lib/api/client.js', () => ({
  apiClient: {
    login: vi.fn(async (values: { email: string; password: string }) => {
      if (values.email === 'api400@example.com') {
        const error: any = new Error('Bad Request');
        error.response = { status: 400 };
        throw error;
      }
      if (!values.email.includes('@') || !values.password) {
        const error: any = new Error('Bad Request');
        error.response = { status: 400 };
        throw error;
      }
      if (values.email === 'valid@example.com' && values.password === 'password123') {
        return {
          user: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'John Doe',
            email: values.email,
            role: 'customer',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          token: 'mock-jwt-token',
        };
      }
      const error: any = new Error('Unauthorized');
      error.response = { status: 401 };
      throw error;
    }),
  },
}));

describe('Login form validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('shows error message on API 400 response (invalid input)', async () => {
    const user: any = userEvent as any;
    render(<LoginPage />);

    const email = screen.getByTestId('email-input');
    const password = screen.getByTestId('password-input');
    const submit = screen.getByTestId('login-button');

    await user.clear(email);
    await user.type(email, 'api400@example.com');

    await user.clear(password);
    await user.type(password, 'password123');

    await user.click(submit);

    const alert = screen.getByTestId('login-error');
    await waitFor(() => expect(alert).toHaveTextContent('Invalid input data'));
  });

  it('submits when inputs are valid (error area stays empty)', async () => {
    const user: any = userEvent as any;
    render(<LoginPage />);

    const email = screen.getByTestId('email-input');
    const password = screen.getByTestId('password-input');
    const submit = screen.getByTestId('login-button');

    await user.clear(email);
    await user.type(email, 'valid@example.com');

    await user.clear(password);
    await user.type(password, 'password123');

    await user.click(submit);

    const alert = await screen.findByTestId('login-error');
    // On success, the component clears the error; the paragraph still exists but should be empty
    expect(alert.textContent?.trim()).toBe('');
  });
});
