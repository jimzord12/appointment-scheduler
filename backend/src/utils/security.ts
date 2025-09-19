/**
 * Validates configuration required for production runtime.
 * Throws an Error with actionable message when validation fails.
 */
export function assertValidJwtSecret(opts?: { env?: NodeJS.ProcessEnv }) {
  const env = opts?.env ?? process.env;
  const isProd = env.NODE_ENV === 'production';
  const jwtSecret = env.JWT_SECRET;
  if (
    isProd &&
    (!jwtSecret || jwtSecret === 'dev-insecure-secret' || jwtSecret === 'change_me_dev_secret')
  ) {
    throw new Error('JWT_SECRET must be set to a strong secret in production');
  }
}
