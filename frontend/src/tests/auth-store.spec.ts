import { beforeEach, describe, expect, it } from 'vitest';

// Importing the store under test
import { authStore } from '../stores/auth.js';

describe('Auth Store (T038)', () => {
  beforeEach(() => {
    // Reset storage and store between tests
    localStorage.clear();
    // Reset state if store exists
    try {
      authStore.setState({ token: null, role: null, user: null });
    } catch {
      // ignore if not yet implemented
    }
  });

  it('is unauthenticated by default and has no role', () => {
    const state = authStore.getState();
    expect(state.token).toBeNull();
    expect(state.role).toBeNull();
    expect(state.isAuthenticated()).toBe(false);
  });

  it('setAuth persists token and role to localStorage and state', () => {
    const input = {
      token: 'jwt-token-123',
      user: {
        id: 'u1',
        name: 'Taylor',
        email: 'taylor@example.com',
        role: 'customer' as const,
      },
    };
    authStore.getState().setAuth(input);

    // State updates
    const s = authStore.getState();
    expect(s.token).toBe(input.token);
    expect(s.role).toBe('customer');
    expect(s.user?.email).toBe('taylor@example.com');
    expect(s.isAuthenticated()).toBe(true);

    // Persistence
    expect(localStorage.getItem('token')).toBe('jwt-token-123');
    expect(localStorage.getItem('role')).toBe('customer');
  });

  it('logout clears token/role from state and localStorage', () => {
    // Seed
    authStore.getState().setAuth({
      token: 'abc',
      user: { id: '1', name: 'A', email: 'a@b.c', role: 'manager' },
    });
    // Act
    authStore.getState().logout();

    const s = authStore.getState();
    expect(s.token).toBeNull();
    expect(s.role).toBeNull();
    expect(s.user).toBeNull();
    expect(s.isAuthenticated()).toBe(false);

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('role')).toBeNull();
  });

  it('hydrateFromStorage reads token/role and updates state', () => {
    localStorage.setItem('token', 'seed-token');
    localStorage.setItem('role', 'customer');

    authStore.getState().hydrateFromStorage();
    const s = authStore.getState();
    expect(s.token).toBe('seed-token');
    expect(s.role).toBe('customer');
    expect(s.isAuthenticated()).toBe(true);
    // user can remain null until profile is fetched separately
    expect(s.user).toBeNull();
  });
});
