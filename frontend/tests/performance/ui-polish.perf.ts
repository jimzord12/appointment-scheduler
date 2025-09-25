import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, test } from 'vitest';

type PerfSnapshot = {
  navigationP95: number;
  themeToggleAvg: number;
  mswLatencyP95: number;
  sampleCount: number;
  timestamp: string;
};

function loadSnapshot(): PerfSnapshot | null {
  const snapshotPath =
    process.env.UI_POLISH_PERF_SNAPSHOT ??
    join(process.cwd(), 'test-results', 'performance', 'latest.json');

  if (!existsSync(snapshotPath)) {
    return null;
  }

  try {
    return JSON.parse(readFileSync(snapshotPath, 'utf-8')) as PerfSnapshot;
  } catch (error) {
    throw new Error(
      `Failed to parse performance snapshot at ${snapshotPath}: ${(error as Error).message}`
    );
  }
}

const snapshot = loadSnapshot();

if (!snapshot) {
  describe.skip('UI Polish Performance Benchmarks', () => {
    test('requires a performance snapshot before validation', () => {
      expect(true).toBe(true);
    });
  });
} else {
  describe('UI Polish Performance Benchmarks', () => {
    const { navigationP95, themeToggleAvg, mswLatencyP95, sampleCount } = snapshot;

    test('navigation P95 is at most 500ms', () => {
      expect(navigationP95).toBeLessThanOrEqual(500);
    });

    test('theme toggle average feedback is at most 100ms', () => {
      expect(themeToggleAvg).toBeLessThanOrEqual(100);
    });

    test('MSW latency P95 is at most 50ms', () => {
      expect(mswLatencyP95).toBeLessThanOrEqual(50);
    });

    test('performance sample includes at least 30 measurements', () => {
      expect(sampleCount).toBeGreaterThanOrEqual(30);
    });
  });
}
