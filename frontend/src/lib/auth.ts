export type Role = 'customer' | 'manager' | 'guest';

export function getRole(): Role {
  if (typeof localStorage === 'undefined') return 'guest';
  // Prefer explicit role stored during real backend login
  const stored = localStorage.getItem('role');
  if (stored === 'manager' || stored === 'customer') return stored;
  // Fallbacks for MSW-based tests using mock tokens
  const token = localStorage.getItem('token');
  if (!token) return 'guest';
  if (token === 'mock-manager-jwt-token') return 'manager';
  if (token === 'mock-jwt-token') return 'customer';
  // Unknown token from real backend → assume authenticated customer unless role later discovered
  return 'customer';
}

export function isAuthenticated(): boolean {
  if (typeof localStorage === 'undefined') return false;
  const token = localStorage.getItem('token');
  // Consider any non-empty token as authenticated to support real backend JWTs
  return Boolean(token);
}

export function hasManagerRole(): boolean {
  return getRole() === 'manager';
}
