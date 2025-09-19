import { and, eq, ne } from 'drizzle-orm';

// Lazy env evaluation per call to avoid import-time throws in tests
const isDbEnabled = () => process.env.USE_DB_APPOINTMENTS === '1' && !!process.env.DATABASE_URL;

type Status = 'pending' | 'approved' | 'rejected';

export interface AppointmentRequestRecord {
  id: string;
  userId: string;
  serviceId: string;
  requestedDate: string; // YYYY-MM-DD
  requestedTime: string; // HH:MM
  status: Status;
  notes?: string;
  managerNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAppointmentRequestInput {
  userId: string;
  serviceId: string;
  requestedDate: string;
  requestedTime: string;
  notes?: string;
}

export interface UpdateAppointmentRequestInput {
  id: string;
  status: Exclude<Status, 'pending'>;
  managerNotes?: string;
}

// In-memory fallback store (used when DB is not enabled)
const memory: AppointmentRequestRecord[] = [];

function now() {
  return new Date();
}

export async function create(
  input: CreateAppointmentRequestInput
): Promise<AppointmentRequestRecord> {
  if (isDbEnabled()) {
    const { db } = await import('../../db/index.js');
    const { appointmentRequests } = await import('../../db/schema/appointment_requests.js');
    const [row] = await db
      .insert(appointmentRequests)
      .values({
        userId: input.userId,
        serviceId: input.serviceId,
        requestedDate: input.requestedDate,
        requestedTime: input.requestedTime,
        status: 'pending',
        notes: input.notes,
      })
      .returning();
    return row as unknown as AppointmentRequestRecord;
  }
  const record: AppointmentRequestRecord = {
    id: crypto.randomUUID(),
    userId: input.userId,
    serviceId: input.serviceId,
    requestedDate: input.requestedDate,
    requestedTime: input.requestedTime,
    status: 'pending',
    notes: input.notes,
    createdAt: now(),
    updatedAt: now(),
  };
  memory.push(record);
  return record;
}

export async function listForUser(userId: string): Promise<AppointmentRequestRecord[]> {
  if (isDbEnabled()) {
    const { db } = await import('../../db/index.js');
    const { appointmentRequests } = await import('../../db/schema/appointment_requests.js');
    const rows = await db
      .select()
      .from(appointmentRequests)
      .where(eq(appointmentRequests.userId, userId));
    return rows as unknown as AppointmentRequestRecord[];
  }
  return memory.filter(r => r.userId === userId);
}

export async function listAll(): Promise<AppointmentRequestRecord[]> {
  if (isDbEnabled()) {
    const { db } = await import('../../db/index.js');
    const { appointmentRequests } = await import('../../db/schema/appointment_requests.js');
    const rows = await db.select().from(appointmentRequests);
    return rows as unknown as AppointmentRequestRecord[];
  }
  return [...memory];
}

export async function updateStatus(
  input: UpdateAppointmentRequestInput
): Promise<AppointmentRequestRecord> {
  if (isDbEnabled()) {
    const { db } = await import('../../db/index.js');
    const { appointmentRequests } = await import('../../db/schema/appointment_requests.js');
    const { appointments } = await import('../../db/schema/appointments.js');

    // Load current
    const [current] = (await db
      .select()
      .from(appointmentRequests)
      .where(eq(appointmentRequests.id, input.id))) as unknown as AppointmentRequestRecord[];
    if (!current) {
      throw Object.assign(new Error('Not found'), { status: 404 });
    }

    // Conflict check when approving
    if (input.status === 'approved') {
      const [conflict] = await db
        .select({ id: appointmentRequests.id })
        .from(appointmentRequests)
        .where(
          and(
            ne(appointmentRequests.id, input.id),
            eq(appointmentRequests.serviceId, current.serviceId),
            eq(appointmentRequests.requestedDate, current.requestedDate),
            eq(appointmentRequests.requestedTime, current.requestedTime),
            eq(appointmentRequests.status, 'approved')
          )
        )
        .limit(1);
      if (conflict) {
        throw Object.assign(new Error('conflict'), { status: 409 });
      }
    }

    const [updated] = await db
      .update(appointmentRequests)
      .set({ status: input.status, managerNotes: input.managerNotes, updatedAt: new Date() })
      .where(eq(appointmentRequests.id, input.id))
      .returning();

    // Create Appointment row when approved (idempotent assumption for tests)
    if (input.status === 'approved') {
      try {
        await db.insert(appointments).values({ requestId: input.id });
      } catch {
        // ignore duplicates if any
      }
    }

    return updated as unknown as AppointmentRequestRecord;
  }

  // Memory implementation
  const r = memory.find(m => m.id === input.id);
  if (!r) {
    throw Object.assign(new Error('Not found'), { status: 404 });
  }
  if (input.status === 'approved') {
    const conflict = memory.find(
      m =>
        m.id !== r.id &&
        m.serviceId === r.serviceId &&
        m.requestedDate === r.requestedDate &&
        m.requestedTime === r.requestedTime &&
        m.status === 'approved'
    );
    if (conflict) {
      throw Object.assign(new Error('conflict'), { status: 409 });
    }
  }
  r.status = input.status;
  if (input.managerNotes) r.managerNotes = input.managerNotes;
  r.updatedAt = now();
  return r;
}

export function __resetMemory() {
  memory.splice(0, memory.length);
}
