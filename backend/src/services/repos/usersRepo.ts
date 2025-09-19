import { eq } from 'drizzle-orm';

const isDbEnabled = () => process.env.USE_DB_USERS === '1' && !!process.env.DATABASE_URL;

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'customer' | 'manager';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  name: string;
  email: string;
  passwordHash: string;
  role: 'customer' | 'manager';
}

const memory: UserRecord[] = [];

function now() {
  return new Date();
}

export async function create(input: CreateUserInput): Promise<UserRecord> {
  if (isDbEnabled()) {
    const { db } = await import('../../db/index.js');
    const { users } = await import('../../db/schema/users.js');
    const [row] = await db
      .insert(users)
      .values({
        name: input.name,
        email: input.email,
        passwordHash: input.passwordHash,
        role: input.role,
      })
      .returning();
    return row as unknown as UserRecord;
  }
  const rec: UserRecord = {
    id: crypto.randomUUID(),
    name: input.name,
    email: input.email,
    passwordHash: input.passwordHash,
    role: input.role,
    createdAt: now(),
    updatedAt: now(),
  };
  memory.push(rec);
  return rec;
}

export async function findByEmail(email: string): Promise<UserRecord | null> {
  if (isDbEnabled()) {
    const { db } = await import('../../db/index.js');
    const { users } = await import('../../db/schema/users.js');
    const [row] = (await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1)) as unknown as UserRecord[];
    return row || null;
  }
  return memory.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export async function findById(id: string): Promise<UserRecord | null> {
  if (isDbEnabled()) {
    const { db } = await import('../../db/index.js');
    const { users } = await import('../../db/schema/users.js');
    const [row] = (await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1)) as unknown as UserRecord[];
    return row || null;
  }
  return memory.find(u => u.id === id) || null;
}

export async function update(
  id: string,
  patch: Partial<Pick<UserRecord, 'name' | 'email'>>
): Promise<UserRecord | null> {
  if (isDbEnabled()) {
    const { db } = await import('../../db/index.js');
    const { users } = await import('../../db/schema/users.js');
    const [row] = await db
      .update(users)
      .set({ ...patch, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return (row as unknown as UserRecord) ?? null;
  }
  const u = memory.find(m => m.id === id);
  if (!u) return null;
  if (patch.name) u.name = patch.name;
  if (patch.email) u.email = patch.email;
  u.updatedAt = now();
  return u;
}

export function __resetMemory() {
  memory.splice(0, memory.length);
}
