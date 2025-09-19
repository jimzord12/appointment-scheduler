import { describe, expect, it } from 'vitest';

import { AppointmentRequestSchema, UpdateAppointmentRequestSchema } from '../../src/schemas';
import { createManagerAndService, makeServer, registerUser } from '../utils/testClient';

// Contract test for PATCH /appointments/requests/:id

describe('PATCH /appointments/requests/:id (contract)', () => {
  const base = `/appointments/requests`;
  const server = makeServer();

  it('updates status to approved returning 200', async () => {
    const { service, managerToken } = await createManagerAndService(server, {
      service: { name: 'Cut', durationMinutes: 30, price: 35 },
    });
    const { token: customerToken } = await registerUser(server, {
      name: 'Carol',
      email: `carol_${Math.random().toString(36).slice(2)}@example.com`,
      password: 'password123',
      role: 'customer',
    });
    const createRes = await server
      .post(base)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ serviceId: service.id, requestedDate: '2030-01-01', requestedTime: '11:00' });
    const requestId = createRes.body.id as string;
    const res = await server
      .patch(`${base}/${requestId}`)
      .set('Authorization', `Bearer ${managerToken}`)
      .send({ status: 'approved' });
    expect(res.status).toBe(200);
    const parsed = AppointmentRequestSchema.safeParse(res.body);
    expect(parsed.success).toBe(true);
  });

  it('rejects invalid status', async () => {
    const { service, managerToken } = await createManagerAndService(server, {
      service: { name: 'Cut', durationMinutes: 30, price: 35 },
    });
    const { token: customerToken } = await registerUser(server, {
      name: 'Dave',
      email: `dave_${Math.random().toString(36).slice(2)}@example.com`,
      password: 'password123',
      role: 'customer',
    });
    const createRes = await server
      .post(base)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ serviceId: service.id, requestedDate: '2030-01-02', requestedTime: '12:00' });
    const requestId = createRes.body.id as string;
    const res = await server
      .patch(`${base}/${requestId}`)
      .set('Authorization', `Bearer ${managerToken}`)
      .send({ status: 'unknown' });
    expect(res.status).toBe(400);
  });

  it('schema compile check', () => {
    expect(UpdateAppointmentRequestSchema.shape).toBeDefined();
  });
});
