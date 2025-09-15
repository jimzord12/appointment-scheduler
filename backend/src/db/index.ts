import * as dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';

dotenv.config();

const { Pool } = pg;

// Environment variable: DATABASE_URL must be provided for Postgres connection
// For local dev with SQLite (future), we can branch logic, but initial implementation uses Postgres per spec.
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  // Fail fast to highlight misconfiguration early (tests can set env)
  throw new Error('DATABASE_URL environment variable is required');
}

const pool = new Pool({ connectionString });

export const db = drizzle(pool, { logger: false });

export type DbClient = typeof db;
