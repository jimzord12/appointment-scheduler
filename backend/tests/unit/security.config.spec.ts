import { describe, expect, it } from 'vitest';

import { assertValidJwtSecret } from '../../src/utils/security.js';

describe('security config validation', () => {
  it('does not throw in non-production when JWT_SECRET is missing', () => {
    expect(() => assertValidJwtSecret({ env: { NODE_ENV: 'test' } as any })).not.toThrow();
  });

  it('throws in production when JWT_SECRET is missing or default', () => {
    // missing
    expect(() => assertValidJwtSecret({ env: { NODE_ENV: 'production' } as any })).toThrow(
      /JWT_SECRET must be set to a strong secret/
    );
    // default dev value
    expect(() =>
      assertValidJwtSecret({
        env: { NODE_ENV: 'production', JWT_SECRET: 'dev-insecure-secret' } as any,
      })
    ).toThrow(/JWT_SECRET must be set to a strong secret/);
    // example placeholder value
    expect(() =>
      assertValidJwtSecret({
        env: { NODE_ENV: 'production', JWT_SECRET: 'change_me_dev_secret' } as any,
      })
    ).toThrow(/JWT_SECRET must be set to a strong secret/);
  });

  it('accepts strong secret in production', () => {
    expect(() =>
      assertValidJwtSecret({
        env: { NODE_ENV: 'production', JWT_SECRET: 'super-strong-secret' } as any,
      })
    ).not.toThrow();
  });
});
