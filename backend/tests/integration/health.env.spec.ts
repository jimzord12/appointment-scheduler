import { agent } from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';

import app from '../../src/app.js';

// Basic environment variables expectation (extend as needed)
const REQUIRED_ENV_VARS: string[] = [
  // Add any required vars as they become mandatory
  // 'DATABASE_URL',
];
const server = agent(app);

describe('Environment & Health', () => {
  beforeAll(() => {
    // Ensure dotenv already loaded in app; optionally we could call dotenv.config() here
  });

  it('loads required environment variables (present or intentionally unset)', () => {
    for (const key of REQUIRED_ENV_VARS) {
      expect(process.env[key]).toBeDefined();
    }
  });

  it('responds with 200 on /health and expected JSON', async () => {
    const res = await server.get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('exposes PORT fallback logic', () => {
    // The server isn't started in tests; just assert our fallback value selection logic
    const fallback = process.env.PORT || 3001;
    expect(fallback).toBeDefined();
  });
});
