import { agent } from 'supertest';
import { describe, expect, it } from 'vitest';

import { createApp } from '../../src/app.js';

const app = createApp();
const server = agent(app);

describe('appointments: time normalization enforces conflict (9:00 vs 09:00)', () => {
  const register = '/auth/register';
  const services = '/services';
  const requests = '/appointments/requests';

  let managerToken: string;
  let customerToken: string;
  let serviceId: string;

  it('sets up users and service', async () => {
    const r1 = await server.post(register).send({
      name: 'Mgr2',
      email: 'mgr-norm@example.com',
      password: 'Password123!',
      role: 'manager',
    });
    expect(r1.status).toBe(201);
    managerToken = r1.body.token;

    const r2 = await server.post(register).send({
      name: 'Cust2',
      email: 'cust-norm@example.com',
      password: 'Password123!',
      role: 'customer',
    });
    expect(r2.status).toBe(201);
    customerToken = r2.body.token;

    const s = await server
      .post(services)
      .set('Authorization', `Bearer ${managerToken}`)
      .send({ name: 'Hair', durationMinutes: 30, price: 20 });
    expect(s.status).toBe(201);
    serviceId = s.body.id;
  });

  it('treats 9:00 and 09:00 as the same slot', async () => {
    const date = '2031-02-02';

    const rA = await server
      .post(requests)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ serviceId, requestedDate: date, requestedTime: '9:00' });
    expect(rA.status).toBe(201);

    const approveA = await server
      .patch(`${requests}/${rA.body.id}`)
      .set('Authorization', `Bearer ${managerToken}`)
      .send({ status: 'approved' });
    expect(approveA.status).toBe(200);

    const rB = await server
      .post(requests)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ serviceId, requestedDate: date, requestedTime: '09:00' });
    expect(rB.status).toBe(201);

    const approveB = await server
      .patch(`${requests}/${rB.body.id}`)
      .set('Authorization', `Bearer ${managerToken}`)
      .send({ status: 'approved' });
    expect(approveB.status).toBe(409);
    expect(approveB.body).toEqual(expect.objectContaining({ error: 'conflict' }));
  });
});
