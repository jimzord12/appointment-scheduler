import { agent } from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { createApp } from '../../src/app.js';
import { requireDockerOrSkip, startDbContainer, stopDbContainer } from '../utils/dbTestEnv.js';

const app = createApp();
const server = agent(app);

describe('DB-backed happy path', () => {
  beforeAll(async () => {
    if (requireDockerOrSkip()) return;
    try {
      await startDbContainer();
    } catch (err) {
      // If Docker is not available, skip this suite gracefully
      console.warn('Skipping DB-backed tests: container runtime not available:', err?.toString?.());
      process.env.SKIP_DB_TESTS = '1';
    }
  }, 120_000);

  afterAll(async () => {
    if (requireDockerOrSkip()) return;
    await stopDbContainer();
  });

  beforeEach(() => {
    if (requireDockerOrSkip()) return;
  });

  it('registers manager and customer, creates service, creates and approves a request', async () => {
    if (requireDockerOrSkip()) {
      return expect(true).toBe(true);
    }

    // Register manager
    const mRes = await server.post('/auth/register').send({
      name: 'M1',
      email: `m_${Math.random().toString(36).slice(2)}@example.com`,
      password: 'password123',
      role: 'manager',
    });
    expect(mRes.status).toBe(201);
    const managerToken = mRes.body.token as string;

    // Register customer
    const cRes = await server.post('/auth/register').send({
      name: 'C1',
      email: `c_${Math.random().toString(36).slice(2)}@example.com`,
      password: 'password123',
      role: 'customer',
    });
    expect(cRes.status).toBe(201);
    const customerToken = cRes.body.token as string;

    // Manager creates a service
    const svcRes = await server
      .post('/services')
      .set('Authorization', `Bearer ${managerToken}`)
      .send({ name: 'Cut', durationMinutes: 30, price: 35 });
    expect(svcRes.status).toBe(201);
    const serviceId = svcRes.body.id as string;

    // Customer creates an appointment request
    const reqRes = await server
      .post('/appointments/requests')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ serviceId, requestedDate: '2030-01-01', requestedTime: '09:00' });
    expect(reqRes.status).toBe(201);
    const requestId = reqRes.body.id as string;

    // Manager approves the request
    const approveRes = await server
      .patch(`/appointments/requests/${requestId}`)
      .set('Authorization', `Bearer ${managerToken}`)
      .send({ status: 'approved' });
    expect(approveRes.status).toBe(200);

    // Creating and approving a second request for same slot should conflict
    const req2 = await server
      .post('/appointments/requests')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ serviceId, requestedDate: '2030-01-01', requestedTime: '09:00' });
    expect(req2.status).toBe(201);
    const approve2 = await server
      .patch(`/appointments/requests/${req2.body.id}`)
      .set('Authorization', `Bearer ${managerToken}`)
      .send({ status: 'approved' });
    expect(approve2.status).toBe(409);
  });
});
