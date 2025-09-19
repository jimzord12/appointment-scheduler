import * as dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';

dotenv.config();

const { Pool } = pg;

let cachedDb: ReturnType<typeof drizzle> | null = null;

function initDb() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is required to use the database');
  }
  const pool = new Pool({ connectionString });
  return drizzle(pool, { logger: false });
}

export const db: ReturnType<typeof drizzle> = new Proxy({} as any, {
  get(_target, prop) {
    if (!cachedDb) {
      cachedDb = initDb();
    }
    // @ts-expect-error dynamic proxy passthrough
    return cachedDb[prop];
  },
});

export type DbClient = typeof db;
