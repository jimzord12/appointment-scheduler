import * as dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';

dotenv.config();

if (!process.env.DATABASE_URL) {
  // Do not throw here; drizzle CLI may load env later. Provide fallback warning.
  console.warn('Warning: DATABASE_URL not set at drizzle config evaluation time.');
}

export default defineConfig({
  schema: './src/db/schema/*',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgres://username:password@localhost:5432/appointments',
  },
  strict: true,
  verbose: true,
  casing: 'camelCase',
});

