export type Role = 'customer' | 'manager' | 'guest';

export function getRole(): Role {
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
  if (!token) return 'guest';
  if (token === 'mock-manager-jwt-token') return 'manager';
  return 'customer';
}

export function isAuthenticated(): boolean {
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
  return Boolean(token && (token === 'mock-jwt-token' || token === 'mock-manager-jwt-token'));
}

export function hasManagerRole(): boolean {
  return getRole() === 'manager';
}
