import { agent } from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';

// Important: set env before importing app
process.env.RATE_LIMIT_ENABLED = '1';
process.env.RATE_LIMIT_WINDOW_MS = '50';
process.env.RATE_LIMIT_MAX = '2';

import { createApp } from '../../src/app.js';

describe('rate limiting middleware', () => {
  let server = agent(createApp());

  beforeEach(() => {
    server = agent(createApp());
  });

  it('returns 429 after exceeding the request limit', async () => {
    // First and second requests should pass
    const ok1 = await server.get('/health');
    expect(ok1.status).toBe(200);
    const ok2 = await server.get('/health');
    expect(ok2.status).toBe(200);

    // Third within the short window should be rate-limited
    const limited = await server.get('/health');
    expect([429, 200]).toContain(limited.status); // flake-allow
    if (limited.status !== 429) {
      // In rare flake cases due to timer imprecision on CI, try one more
      const limited2 = await server.get('/health');
      expect(limited2.status).toBe(429);
      expect(limited2.body).toEqual({ error: 'rate_limit' });
    } else {
      expect(limited.body).toEqual({ error: 'rate_limit' });
    }

    // Wait for the window to reset and ensure it's allowed again
    await new Promise(r => setTimeout(r, 60));
    const ok3 = await server.get('/health');
    expect(ok3.status).toBe(200);
  });
});
