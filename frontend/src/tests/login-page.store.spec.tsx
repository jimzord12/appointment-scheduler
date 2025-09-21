import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { apiClient } from '../lib/api/client.js';
import { LoginPage } from '../pages/Login.js';
import { authStore } from '../stores/auth.js';

// Mock router navigate
const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }));
vi.mock('@tanstack/react-router', () => ({ useNavigate: () => mockNavigate }));

describe('LoginPage + Auth Store (T041)', () => {
  beforeEach(() => {
    // Reset store and storage
    authStore.setState({ token: null, role: null, user: null });
    localStorage.clear();
    mockNavigate.mockClear();
  });

  it('sets auth store on successful login and navigates', async () => {
    // Arrange
    const user = userEvent as unknown as {
      clear: (el: Element) => Promise<void> | void;
      type: (el: Element, text: string) => Promise<void> | void;
      click: (el: Element) => Promise<void> | void;
    };
    const mockResponse = {
      user: {
        id: 'u-1',
        name: 'Taylor',
        email: 'taylor@example.com',
        role: 'customer' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      token: 'jwt-123',
    };
    const spy = vi.spyOn(apiClient, 'login').mockResolvedValue(mockResponse as any);

    render(<LoginPage />);

    // Act
    await user.clear(screen.getByTestId('email-input'));
    await user.type(screen.getByTestId('email-input'), 'taylor@example.com');
    await user.clear(screen.getByTestId('password-input'));
    await user.type(screen.getByTestId('password-input'), 'password123');
    await user.click(screen.getByTestId('login-button'));

    // Assert
    await waitFor(() => {
      expect(authStore.getState().isAuthenticated()).toBe(true);
      expect(authStore.getState().role).toBe('customer');
      expect(localStorage.getItem('token')).toBe('jwt-123');
      expect(localStorage.getItem('role')).toBe('customer');
      expect(mockNavigate).toHaveBeenCalledWith({ to: '/dashboard' });
    });

    spy.mockRestore();
  });
});
