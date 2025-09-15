/**
 * T018 Integration test: Appointment request lifecycle (expected FAIL)
 * Business rules (from data-model.md):
 *  - Customer creates request (pending)
 *  - Manager can approve or reject
 *  - Approving creates appointment unless time slot already booked
 *  - Double-book prevention: two approved overlapping bookings for same service/time prohibited
 */
import { agent } from 'supertest';
import { describe, expect, it } from 'vitest';

import { createApp } from '../../src/app';
import { AppointmentRequestSchema } from '../../src/schemas';

const app = createApp();
const server = agent(app);

describe('T018: Appointment lifecycle (expected FAIL)', () => {
  const registerEndpoint = '/auth/register';
  const servicesEndpoint = '/services';
  const requestsEndpoint = '/appointments/requests';

  let managerToken: string | null = null;
  let customerToken: string | null = null;
  let serviceId: string | null = null;
  let requestId: string | null = null;

  it('registers manager (expected FAIL)', async () => {
    const res = await server.post(registerEndpoint).send({
      name: 'Manager2',
      email: 'manager2@example.com',
      password: 'Password123!',
      role: 'manager',
    });
    expect(res.status).toBe(201); // expected FAIL (404 now)
    managerToken = res.body?.token;
  });

  it('registers customer (expected FAIL)', async () => {
    const res = await server.post(registerEndpoint).send({
      name: 'Customer2',
      email: 'customer2@example.com',
      password: 'Password123!',
      role: 'customer',
    });
    expect(res.status).toBe(201); // expected FAIL (404 now)
    customerToken = res.body?.token;
  });

  it('manager creates service (expected FAIL)', async () => {
    expect(managerToken).not.toBeNull();
    const res = await server
      .post(servicesEndpoint)
      .set('Authorization', `Bearer ${managerToken}`)
      .send({ name: 'Color', durationMinutes: 60, price: 120 });
    expect(res.status).toBe(201); // expected FAIL (404 now)
    serviceId = res.body?.id;
  });

  it('customer creates appointment request (expected FAIL)', async () => {
    expect(customerToken).not.toBeNull();
    expect(serviceId).not.toBeNull();
    const res = await server
      .post(requestsEndpoint)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ serviceId, requestedDate: '2030-06-01', requestedTime: '09:00' });
    expect(res.status).toBe(201); // expected FAIL (404 now)
    const parsed = AppointmentRequestSchema.safeParse(res.body);
    expect(parsed.success).toBe(true);
    requestId = parsed.success ? parsed.data.id : null;
  });

  it('manager approves request (expected FAIL)', async () => {
    expect(managerToken).not.toBeNull();
    expect(requestId).not.toBeNull();
    const res = await server
      .patch(`${requestsEndpoint}/${requestId}`)
      .set('Authorization', `Bearer ${managerToken}`)
      .send({ status: 'approved' });
    expect(res.status).toBe(200); // expected FAIL (404 now)
    const parsed = AppointmentRequestSchema.safeParse(res.body);
    expect(parsed.success).toBe(true);
  });

  it('prevents double-book approval (expected FAIL)', async () => {
    // Create second request same slot
    expect(customerToken).not.toBeNull();
    expect(serviceId).not.toBeNull();
    const createRes = await server
      .post(requestsEndpoint)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ serviceId, requestedDate: '2030-06-01', requestedTime: '09:00' });
    expect(createRes.status).toBe(201); // expected FAIL first (404 now)
    const secondId = createRes.body?.id;
    const approveRes = await server
      .patch(`${requestsEndpoint}/${secondId}`)
      .set('Authorization', `Bearer ${managerToken}`)
      .send({ status: 'approved' });
    expect(approveRes.status).toBe(409); // expected FAIL (404 now)
  });
});
