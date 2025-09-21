import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { RegisterPage } from '../pages/Register.js';

// T054: Frontend form validation unit tests — Register form

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => vi.fn(),
}));

vi.mock('../lib/api/client.js', () => ({
  apiClient: {
    register: vi.fn(async (values: { name: string; email: string; password: string }) => {
      // Simulate server-side 400 for a specific sentinel email while keeping inputs otherwise valid
      if (values.email === 'api400@example.com') {
        const error: any = new Error('Bad Request');
        error.response = { status: 400 };
        throw error;
      }
      // Fallback: if somehow invalid data passes client validation, also return 400
      if (values.name.length < 2 || !values.email.includes('@') || values.password.length < 8) {
        const error: any = new Error('Bad Request');
        error.response = { status: 400 };
        throw error;
      }
      return {
        user: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: values.name,
          email: values.email,
          role: 'customer',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        token: 'mock-jwt-token',
      };
    }),
  },
}));

describe('Register form validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('shows error message on API 400 response (invalid input)', async () => {
    const user: any = userEvent as any;
    render(<RegisterPage />);

    // Use valid inputs but a sentinel email that the mocked API treats as a 400 response
    await user.clear(screen.getByTestId('name-input'));
    await user.type(screen.getByTestId('name-input'), 'Alice');
    await user.clear(screen.getByTestId('email-input'));
    await user.type(screen.getByTestId('email-input'), 'api400@example.com');
    await user.clear(screen.getByTestId('password-input'));
    await user.type(screen.getByTestId('password-input'), 'password123');

    await user.click(screen.getByTestId('register-button'));

    const alert = screen.getByTestId('register-error');
    await waitFor(() => expect(alert).toHaveTextContent('Invalid input data'));
  });

  it('submits when inputs are valid (error area stays empty)', async () => {
    const user: any = userEvent as any;
    render(<RegisterPage />);

    await user.clear(screen.getByTestId('name-input'));
    await user.type(screen.getByTestId('name-input'), 'Alice');
    await user.clear(screen.getByTestId('email-input'));
    await user.type(screen.getByTestId('email-input'), 'alice@example.com');
    await user.clear(screen.getByTestId('password-input'));
    await user.type(screen.getByTestId('password-input'), 'password123');

    await user.click(screen.getByTestId('register-button'));

    const alert = await screen.findByTestId('register-error');
    expect(alert.textContent?.trim()).toBe('');
  });
});
