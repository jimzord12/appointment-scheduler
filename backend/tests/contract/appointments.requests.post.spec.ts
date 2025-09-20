import { describe, expect, it } from 'vitest';

import {
  AppointmentRequestSchema,
  CreateAppointmentRequestSchema,
} from '../../src/schemas/index.js';
import { createManagerAndService, makeServer, registerUser } from '../utils/testClient';

// T014: Contract test POST /appointments/requests (expected RED)

describe('POST /appointments/requests (contract)', () => {
  const endpoint = '/appointments/requests';
  const server = makeServer();

  it('creates appointment request returning 201', async () => {
    const { service } = await createManagerAndService(server, {
      service: { name: 'Cut', durationMinutes: 30, price: 35 },
    });
    const { token: customerToken } = await registerUser(server, {
      name: 'Alice',
      email: `alice_${Math.random().toString(36).slice(2)}@example.com`,
      password: 'password123',
      role: 'customer',
    });
    const payload = {
      serviceId: service.id,
      requestedDate: '2030-01-01',
      requestedTime: '10:00',
    };
    const res = await server
      .post(endpoint)
      .set('Authorization', `Bearer ${customerToken}`)
      .send(payload);
    expect(res.status).toBe(201);
    const parsed = AppointmentRequestSchema.safeParse(res.body);
    expect(parsed.success).toBe(true);
  });

  it('rejects invalid time format', async () => {
    const { service } = await createManagerAndService(server, {
      service: { name: 'Cut', durationMinutes: 30, price: 35 },
    });
    const { token: customerToken } = await registerUser(server, {
      name: 'Bob',
      email: `bob_${Math.random().toString(36).slice(2)}@example.com`,
      password: 'password123',
      role: 'customer',
    });
    const payload = {
      serviceId: service.id,
      requestedDate: '2030-01-01',
      requestedTime: '25:99',
    };
    const res = await server
      .post(endpoint)
      .set('Authorization', `Bearer ${customerToken}`)
      .send(payload);
    expect(res.status).toBe(400);
  });

  it('schema compile check', () => {
    expect(CreateAppointmentRequestSchema.safeParse({}).success).toBe(false);
  });
});
