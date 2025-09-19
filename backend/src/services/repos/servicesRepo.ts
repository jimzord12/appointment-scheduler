// Repository for services with optional DB backing
import { eq } from 'drizzle-orm';

const isDbEnabled = () => process.env.USE_DB_SERVICES === '1' && !!process.env.DATABASE_URL;

export interface ServiceRecord {
  id: string;
  name: string;
  description?: string | null;
  durationMinutes: number;
  price: string | number; // numeric in DB may come back as string depending on driver
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateServiceInput {
  name: string;
  description?: string;
  durationMinutes: number;
  price: number;
}

const memory: ServiceRecord[] = [];

function now() {
  return new Date();
}

export async function create(input: CreateServiceInput): Promise<ServiceRecord> {
  if (isDbEnabled()) {
    const { db } = await import('../../db/index.js');
    const { services } = await import('../../db/schema/services.js');
    const [row] = await db
      .insert(services)
      .values({
        name: input.name,
        description: input.description,
        durationMinutes: input.durationMinutes,
        price: String(input.price),
        isActive: true,
      })
      .returning();
    return row as unknown as ServiceRecord;
  }
  const rec: ServiceRecord = {
    id: crypto.randomUUID(),
    name: input.name,
    description: input.description,
    durationMinutes: input.durationMinutes,
    price: input.price,
    isActive: true,
    createdAt: now(),
    updatedAt: now(),
  };
  memory.push(rec);
  return rec;
}

export async function listActive(): Promise<ServiceRecord[]> {
  if (isDbEnabled()) {
    const { db } = await import('../../db/index.js');
    const { services } = await import('../../db/schema/services.js');
    const rows = await db.select().from(services).where(eq(services.isActive, true));
    return rows as unknown as ServiceRecord[];
  }
  return memory.filter(s => s.isActive);
}

export async function findById(id: string): Promise<ServiceRecord | null> {
  if (isDbEnabled()) {
    const { db } = await import('../../db/index.js');
    const { services } = await import('../../db/schema/services.js');
    const [row] = (await db
      .select()
      .from(services)
      .where(eq(services.id, id))
      .limit(1)) as unknown as ServiceRecord[];
    return row || null;
  }
  return memory.find(s => s.id === id) || null;
}

export function __resetMemory() {
  memory.splice(0, memory.length);
}
