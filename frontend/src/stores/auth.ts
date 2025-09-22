import { create } from 'zustand';

type Role = 'customer' | 'manager';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

interface SetAuthInput {
  token: string;
  user?: AuthUser | null;
}

export interface AuthState {
  token: string | null;
  role: Role | null;
  user: AuthUser | null;
  setAuth: (input: SetAuthInput) => void;
  logout: () => void;
  hydrateFromStorage: () => void;
  isAuthenticated: () => boolean;
}

export const authStore = create<AuthState>((set, get) => ({
  token: null,
  role: null,
  user: null,
  setAuth: ({ token, user }) => {
    // Persist
    localStorage.setItem('token', token);
    if (user?.role) localStorage.setItem('role', user.role);
    if (user?.id) localStorage.setItem('userId', user.id);

    set({ token, role: user?.role ?? null, user: user ?? null });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    set({ token: null, role: null, user: null });
  },
  hydrateFromStorage: () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role') as Role | null;
    set({ token, role: (role as Role | null) ?? null });
  },
  isAuthenticated: () => !!get().token,
}));

export type AuthStore = typeof authStore;
