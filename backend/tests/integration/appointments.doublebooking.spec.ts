import { agent } from 'supertest';
import { describe, expect, it } from 'vitest';

import { createApp } from '../../src/app';

const app = createApp();
const server = agent(app);

/**
 * Focused test: approving overlapping appointment requests returns 409 conflict
 */
describe('appointments: double-booking conflict (focused)', () => {
  const register = '/auth/register';
  const services = '/services';
  const requests = '/appointments/requests';

  let managerToken: string;
  let customerToken: string;
  let serviceId: string;

  it('sets up manager and customer', async () => {
    const r1 = await server.post(register).send({
      name: 'Mgr',
      email: 'mgr-conflict@example.com',
      password: 'Password123!',
      role: 'manager',
    });
    expect(r1.status).toBe(201);
    managerToken = r1.body.token;

    const r2 = await server.post(register).send({
      name: 'Cust',
      email: 'cust-conflict@example.com',
      password: 'Password123!',
      role: 'customer',
    });
    expect(r2.status).toBe(201);
    customerToken = r2.body.token;
  });

  it('manager creates a service', async () => {
    const res = await server
      .post(services)
      .set('Authorization', `Bearer ${managerToken}`)
      .send({ name: 'Hair', durationMinutes: 30, price: 20 });
    expect(res.status).toBe(201);
    serviceId = res.body.id;
  });

  it('customer creates two requests for same slot; approving second yields 409 with error shape', async () => {
    const date = '2031-01-01';
    const time = '10:00';

    const rA = await server
      .post(requests)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ serviceId, requestedDate: date, requestedTime: time });
    expect(rA.status).toBe(201);

    const approveA = await server
      .patch(`${requests}/${rA.body.id}`)
      .set('Authorization', `Bearer ${managerToken}`)
      .send({ status: 'approved' });
    expect(approveA.status).toBe(200);

    const rB = await server
      .post(requests)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ serviceId, requestedDate: date, requestedTime: time });
    expect(rB.status).toBe(201);

    const approveB = await server
      .patch(`${requests}/${rB.body.id}`)
      .set('Authorization', `Bearer ${managerToken}`)
      .send({ status: 'approved' });
    expect(approveB.status).toBe(409);
    expect(approveB.body).toEqual(expect.objectContaining({ error: 'conflict' }));
  });
});
