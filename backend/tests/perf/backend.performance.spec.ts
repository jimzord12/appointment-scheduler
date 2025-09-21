import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { createApp } from '../../src/app.js';

// Simple, deterministic performance checks for cheap endpoints.
// Goal: catch accidental regressions (e.g., heavy middleware, blocking code).
// These are intentionally generous to be CI-friendly on slower machines.

const N = 30; // number of requests per endpoint
const P95_THRESHOLD_MS = 300; // generous threshold per request
const AVG_THRESHOLD_MS = 100; // average should stay well below this

function p95(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.ceil(0.95 * sorted.length) - 1;
  return sorted[Math.max(0, Math.min(idx, sorted.length - 1))];
}

async function measureGet(path: string) {
  const app = createApp();
  const durations: number[] = [];
  for (let i = 0; i < N; i++) {
    const start = performance.now();
    const res = await request(app).get(path);
    const dur = performance.now() - start;
    durations.push(dur);
    expect(res.status).toBe(200);
  }
  const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
  return { durations, avg, p95: p95(durations) };
}

describe('T049 Backend performance (smoke)', () => {
  it('GET /health stays within thresholds', async () => {
    const { avg, p95 } = await measureGet('/health');
    expect(avg).toBeLessThan(AVG_THRESHOLD_MS);
    expect(p95).toBeLessThan(P95_THRESHOLD_MS);
  });

  it('GET /services stays within thresholds', async () => {
    const { avg, p95 } = await measureGet('/services');
    expect(avg).toBeLessThan(AVG_THRESHOLD_MS);
    expect(p95).toBeLessThan(P95_THRESHOLD_MS);
  });
});
