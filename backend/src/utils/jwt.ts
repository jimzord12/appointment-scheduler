export const DEFAULT_DEV_JWT_SECRET = 'dev-insecure-secret';

/**
 * Returns the JWT secret. In development/test, falls back to a default value.
 * In production, app startup validates the strength via assertValidJwtSecret.
 */
export function getJwtSecret(): string {
  return process.env.JWT_SECRET || DEFAULT_DEV_JWT_SECRET;
}
