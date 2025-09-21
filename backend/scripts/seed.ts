import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import { and, eq } from 'drizzle-orm';

import { db } from '../src/db/index.js';
import { services } from '../src/db/schema/services.js';
import { users } from '../src/db/schema/users.js';

dotenv.config();

async function ensureManagerUser() {
  const email = 'manager@demo.local';
  const name = 'Demo Manager';
  const password = 'password123';

  const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existing.length > 0) {
    return existing[0];
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const [created] = await db
    .insert(users)
    .values({ name, email, passwordHash, role: 'manager' })
    .returning();
  return created;
}

async function ensureService(
  name: string,
  durationMinutes: number,
  price: string,
  description?: string
) {
  const existing = await db
    .select()
    .from(services)
    .where(and(eq(services.name, name), eq(services.isActive, true)))
    .limit(1);
  if (existing.length > 0) return existing[0];

  const [created] = await db
    .insert(services)
    .values({ name, description, durationMinutes, price, isActive: true })
    .returning();
  return created;
}

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not set. Please configure backend/.env before seeding.');
    process.exit(1);
  }

  console.log('Seeding database...');
  const manager = await ensureManagerUser();
  console.log(`✔ Manager user ready: ${manager.email}`);

  const svc1 = await ensureService('Haircut', 30, '25.00', 'Basic haircut');
  const svc2 = await ensureService('Hair Color', 90, '70.00', 'Single-process color');
  const svc3 = await ensureService('Beard Trim', 15, '15.00', 'Quick beard trim');
  console.log('✔ Services ready:', [svc1.name, svc2.name, svc3.name].join(', '));

  console.log('✅ Seed complete');
}

main().catch(err => {
  console.error('Seed failed:', err);
  console.error('Tip: Run migrations first: pnpm -C backend db:migrate');
  process.exit(1);
});
