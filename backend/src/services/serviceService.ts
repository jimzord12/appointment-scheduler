import { CreateServiceSchema, ServiceSchema } from '../../src/schemas/index.js';

import { __findUserById } from './authService.js';

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
  const now = new Date();
  const service: StoredService = {
    id: crypto.randomUUID(),
    name: parsed.name,
    description: parsed.description,
    durationMinutes: parsed.durationMinutes,
    price: parsed.price,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };
  servicesStore.push(service);
  return ServiceSchema.parse({
    ...service,
    createdAt: service.createdAt.toISOString(),
    updatedAt: service.updatedAt.toISOString(),
  });
};

export const listServices = async () => {
  // Return only active services for now; future: include filters or role-based inactive visibility
  return servicesStore
    .filter(s => s.isActive)
    .map(s =>
      ServiceSchema.parse({
        ...s,
        createdAt: s.createdAt.toISOString(),
        updatedAt: s.updatedAt.toISOString(),
      })
    );
};

export function __resetServicesStore() {
  servicesStore.splice(0, servicesStore.length);
}

export function __findServiceById(id: string) {
  return servicesStore.find(s => s.id === id) || null;
}
