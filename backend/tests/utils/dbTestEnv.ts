import { exec as execCb } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

import { GenericContainer, StartedTestContainer, Wait } from 'testcontainers';

const exec = promisify(execCb);

let container: StartedTestContainer | null = null;
let dbName = '';

function backendDir() {
  // Resolve to backend directory regardless of CWD
  const __filename = fileURLToPath(import.meta.url);
  const utilsDir = path.dirname(__filename);
  // utilsDir => backend/tests/utils
  return path.resolve(utilsDir, '..', '..');
}

export async function startDbContainer() {
  if (container) return container;
  dbName = `test_${randomUUID().replace(/-/g, '').slice(0, 12)}`;
  container = await new GenericContainer('postgres:16')
    .withEnvironment({
      POSTGRES_USER: 'postgres',
      POSTGRES_PASSWORD: 'postgres',
      POSTGRES_DB: dbName,
    })
    .withExposedPorts(5432)
    .withWaitStrategy(Wait.forLogMessage('database system is ready to accept connections'))
    .start();

  const host = container.getHost();
  const port = container.getMappedPort(5432);
  const url = `postgres://postgres:postgres@${host}:${port}/${dbName}`;

  // Set envs for repos to use DB
  process.env.DATABASE_URL = url;
  process.env.USE_DB_USERS = '1';
  process.env.USE_DB_SERVICES = '1';
  process.env.USE_DB_APPOINTMENTS = '1';
  process.env.JWT_SECRET = 'dev-insecure-secret';

  // Run migrations/push using drizzle-kit CLI
  const cwd = backendDir();
  // drizzle-kit push will create schema if not exists based on ./drizzle/config.ts
  await exec('pnpm db:push', { cwd, env: { ...process.env, DATABASE_URL: url } });

  return container;
}

export async function stopDbContainer() {
  if (container) {
    try {
      await container.stop({ timeout: 10_000 });
    } catch {
      // ignore
    }
  }
  container = null;
}

export function requireDockerOrSkip() {
  // Basic heuristic: if running in CI without Docker, allow skip via env
  if (process.env.SKIP_DB_TESTS === '1') {
    return true;
  }
  return false;
}
