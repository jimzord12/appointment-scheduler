import { z } from 'zod';

import {
  AppointmentRequestSchema,
  CreateAppointmentRequestSchema,
} from '../../src/schemas/index.js';

import { __findUserById } from './authService.js';
import * as repo from './repos/appointmentRequestsRepo.js';
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
  // Repository-backed creation (DB when enabled, otherwise memory)
  const created = await repo.create({
    userId: actor.id,
    serviceId: parsed.serviceId,
    requestedDate: parsed.requestedDate,
    requestedTime: parsed.requestedTime,
    notes: parsed.notes,
  });
  return AppointmentRequestSchema.parse(normalizeRequest(created));
};

export const listRequests = async (userId: string) => {
  const actor = __findUserById(userId);
  if (!actor) {
    throw Object.assign(new Error('Unauthorized'), { status: 401 });
  }
  const visible =
    actor.role === 'manager' ? await repo.listAll() : await repo.listForUser(actor.id);
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
  if (actor.role !== 'manager') {
    throw Object.assign(new Error('Forbidden'), { status: 403 });
  }
  const updated = await repo.updateStatus({
    id: parsed.id,
    status: parsed.status,
    managerNotes: parsed.managerNotes,
  });
  return AppointmentRequestSchema.parse(normalizeRequest(updated));
};

function normalizeRequest(r: repo.AppointmentRequestRecord) {
  return {
    id: r.id,
    userId: r.userId,
    serviceId: r.serviceId,
    requestedDate: r.requestedDate,
    requestedTime: r.requestedTime,
    status: r.status,
    notes: r.notes,
    managerNotes: r.managerNotes,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  };
}

export function __resetAppointmentStore() {
  requests.splice(0, requests.length);
  repo.__resetMemory();
}
