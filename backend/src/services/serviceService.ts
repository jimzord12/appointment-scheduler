import { CreateServiceSchema, ServiceSchema } from '../../src/schemas/index.js';

import { __findUserById } from './authService.js';
import * as servicesRepo from './repos/servicesRepo.js';

interface StoredService {
  id: string;
  name: string;
  description?: string;
  durationMinutes: number;
  price: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const servicesStore: StoredService[] = [];

export const createService = async (userId: string, input: unknown) => {
  const actor = __findUserById(userId);
  if (!actor || actor.role !== 'manager') {
    throw Object.assign(new Error('Forbidden'), { status: 403 });
  }
  const parsed = CreateServiceSchema.parse(input);
  // Basic constraints already validated by schema; add any business rules here if needed
  const created = await servicesRepo.create({
    name: parsed.name,
    description: parsed.description,
    durationMinutes: parsed.durationMinutes,
    price: parsed.price,
  });
  // Mirror into local store for synchronous lookup compatibility
  servicesStore.push({
    id: created.id,
    name: created.name,
    description: created.description ?? undefined,
    durationMinutes: created.durationMinutes,
    price: typeof created.price === 'string' ? Number(created.price) : created.price,
    isActive: created.isActive,
    createdAt: created.createdAt,
    updatedAt: created.updatedAt,
  });
  return ServiceSchema.parse(normalizeService(created));
};

export const listServices = async () => {
  // Return only active services for now; future: include filters or role-based inactive visibility
  const rows = await servicesRepo.listActive();
  return rows.map(normalizeService).map(s => ServiceSchema.parse(s));
};

export function __resetServicesStore() {
  servicesStore.splice(0, servicesStore.length);
  servicesRepo.__resetMemory();
}

export function __findServiceById(id: string) {
  return servicesStore.find(s => s.id === id) || null;
}

function normalizeService(r: servicesRepo.ServiceRecord) {
  return {
    id: r.id,
    name: r.name,
    description: r.description ?? undefined,
    durationMinutes: r.durationMinutes,
    price: typeof r.price === 'string' ? Number(r.price) : r.price,
    isActive: r.isActive,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  };
}
