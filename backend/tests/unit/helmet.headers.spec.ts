import { agent } from 'supertest';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { createApp } from '../../src/app.js';

// Helper to set env vars per test without leaking globally
const withEnv = (env: Record<string, string | undefined>, fn: () => Promise<void> | void) => {
  const originals: Record<string, string | undefined> = {};
  for (const k of Object.keys(env)) {
    originals[k] = process.env[k];
    const v = env[k];
    if (v === undefined) delete process.env[k];
    else process.env[k] = v;
  }
  return Promise.resolve()
    .then(() => fn())
    .finally(() => {
      for (const k of Object.keys(env)) {
        const v = originals[k];
        if (v === undefined) delete process.env[k];
        else process.env[k] = v;
      }
    });
};

describe('helmet security headers', () => {
  beforeEach(() => {
    // Ensure no rate limit interference in these tests
    process.env.RATE_LIMIT_ENABLED = '0';
  });

  afterEach(() => {
    delete process.env.RATE_LIMIT_ENABLED;
  });

  it('sets standard security headers and removes X-Powered-By', async () => {
    await withEnv(
      {
        NODE_ENV: 'development',
        JWT_SECRET: 'dev-secret',
      },
      async () => {
        const app = createApp();
        const request = agent(app);
        const res = await request.get('/health');
        expect(res.status).toBe(200);

        // Helmet default headers (subset; avoid relying on full set which may vary by version)
        expect(res.headers['x-dns-prefetch-control']).toBeDefined();
        expect(res.headers['x-frame-options']).toBeDefined();
        expect(res.headers['x-content-type-options']).toBe('nosniff');
        expect(res.headers['referrer-policy']).toBeDefined();

        // Express powered by header should be hidden
        expect(res.headers['x-powered-by']).toBeUndefined();
      }
    );
  });
});
