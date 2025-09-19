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

describe('CORS middleware', () => {
  beforeEach(() => {
    // Ensure no rate limit interference in these tests
    process.env.RATE_LIMIT_ENABLED = '0';
  });

  afterEach(() => {
    delete process.env.RATE_LIMIT_ENABLED;
  });

  it('allows any origin in development/test', async () => {
    await withEnv(
      {
        NODE_ENV: 'development',
        ALLOWED_ORIGINS: '',
        JWT_SECRET: 'dev-secret',
      },
      async () => {
        const app = createApp();
        const request = agent(app);
        const res = await request.get('/health').set('Origin', 'http://any.local');
        expect(res.status).toBe(200);
        // In dev permissive mode, CORS reflects origin by default with cors()
        expect(res.headers['access-control-allow-origin']).toBe('*' /* default behavior */);
      }
    );
  });

  it('allows only allowlisted origins in production', async () => {
    await withEnv(
      {
        NODE_ENV: 'production',
        ALLOWED_ORIGINS: 'https://app.example.com, https://admin.example.com',
        JWT_SECRET: 'a-very-strong-secret-for-tests',
      },
      async () => {
        const app = createApp();
        const request = agent(app);
        // Allowed origin
        const ok = await request.get('/health').set('Origin', 'https://app.example.com');
        expect(ok.status).toBe(200);
        expect(ok.headers['access-control-allow-origin']).toBe('https://app.example.com');

        // Disallowed origin: CORS should reject the request at the preflight level normally,
        // but since we are issuing a simple GET in supertest, we assert that the header is absent.
        const bad = await request.get('/health').set('Origin', 'https://evil.example.com');
        expect(bad.status).toBe(200);
        expect(bad.headers['access-control-allow-origin']).toBeUndefined();
      }
    );
  });
});
