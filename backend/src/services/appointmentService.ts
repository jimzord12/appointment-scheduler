import { z } from 'zod';

import {
  AppointmentRequestSchema,
  CreateAppointmentRequestSchema,
} from '../../src/schemas/index.js';

import { __findUserById } from './authService.js';
import { __findServiceById } from './serviceService.js';

type Status = 'pending' | 'approved' | 'rejected';

interface StoredAppointmentRequest {
  id: string;
  userId: string;
  serviceId: string;
  requestedDate: string; // ISO date (YYYY-MM-DD)
  requestedTime: string; // HH:MM
  status: Status;
  notes?: string;
  managerNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const requests: StoredAppointmentRequest[] = [];

export const createRequest = async (userId: string, input: unknown) => {
  const actor = __findUserById(userId);
  if (!actor) {
    throw Object.assign(new Error('Unauthorized'), { status: 401 });
  }
  const parsed = CreateAppointmentRequestSchema.parse(input);
  const service = __findServiceById(parsed.serviceId);
  if (!service) {
    throw Object.assign(new Error('Service not found'), { status: 404 });
  }
  const now = new Date();
  const request: StoredAppointmentRequest = {
    id: crypto.randomUUID(),
    userId: actor.id,
    serviceId: parsed.serviceId,
    requestedDate: parsed.requestedDate,
    requestedTime: parsed.requestedTime,
    status: 'pending',
    notes: parsed.notes,
    createdAt: now,
    updatedAt: now,
  };
  requests.push(request);
  return AppointmentRequestSchema.parse(normalizeRequest(request));
};

export const listRequests = async (userId: string) => {
  const actor = __findUserById(userId);
  if (!actor) {
    throw Object.assign(new Error('Unauthorized'), { status: 401 });
  }
  const visible = actor.role === 'manager' ? requests : requests.filter(r => r.userId === actor.id);
  return visible.map(r => AppointmentRequestSchema.parse(normalizeRequest(r)));
};

export const updateRequest = async (userId: string, input: unknown) => {
  const actor = __findUserById(userId);
  if (!actor) {
    throw Object.assign(new Error('Unauthorized'), { status: 401 });
  }
  const updateInputSchema = z.object({
    id: z.string().uuid(),
    status: z.enum(['approved', 'rejected']),
    managerNotes: z.string().optional(),
  });
  const parsed = updateInputSchema.parse(input);
  const request = requests.find(r => r.id === parsed.id);
  if (!request) {
    throw Object.assign(new Error('Not found'), { status: 404 });
  }
  if (actor.role !== 'manager') {
    throw Object.assign(new Error('Forbidden'), { status: 403 });
  }
  // Double-book prevention: if approving, ensure no other approved request same service/date/time
  if (parsed.status === 'approved') {
    const conflict = requests.find(
      r =>
        r.id !== request.id &&
        r.serviceId === request.serviceId &&
        r.requestedDate === request.requestedDate &&
        r.requestedTime === request.requestedTime &&
        r.status === 'approved'
    );
    if (conflict) {
      throw Object.assign(new Error('Time slot already booked'), { status: 409 });
    }
  }
  request.status = parsed.status;
  if (parsed.managerNotes) request.managerNotes = parsed.managerNotes;
  request.updatedAt = new Date();
  return AppointmentRequestSchema.parse(normalizeRequest(request));
};

function normalizeRequest(r: StoredAppointmentRequest) {
  return {
    id: r.id,
    userId: r.userId,
    serviceId: r.serviceId,
    requestedDate: r.requestedDate,
    requestedTime: r.requestedTime,
    status: r.status,
    notes: r.notes,
    managerNotes: r.managerNotes,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  };
}

export function __resetAppointmentStore() {
  requests.splice(0, requests.length);
}
