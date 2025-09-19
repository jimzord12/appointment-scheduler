import { describe, expect, it } from 'vitest';

import { CreateServiceSchema, ServiceSchema } from '../../src/schemas';
import { createManagerAndService, makeServer } from '../utils/testClient';

// T012: Contract test POST /services (expected RED)

describe('POST /services (contract)', () => {
  const endpoint = '/services';
  const server = makeServer();

  it('creates a new service returning 201 and ServiceSchema', async () => {
    const payload = { name: 'Cut', durationMinutes: 30, price: 35 };
    const { managerToken } = await createManagerAndService(server, { service: payload });
    // The helper already created a service; create another to assert behavior
    const res = await server
      .post(endpoint)
      .set('Authorization', `Bearer ${managerToken}`)
      .send({ name: 'Color', durationMinutes: 45, price: 55 });
    expect(res.status).toBe(201);
    const parsed = ServiceSchema.safeParse(res.body);
    expect(parsed.success).toBe(true);
  });

  it('rejects invalid payload (missing name)', async () => {
    const { managerToken } = await createManagerAndService(server, {
      service: { name: 'X', durationMinutes: 15, price: 10 },
    });
    const res = await server
      .post(endpoint)
      .set('Authorization', `Bearer ${managerToken}`)
      .send({ durationMinutes: 30, price: 35 });
    expect(res.status).toBe(400);
  });

  it('schema compile check', () => {
    expect(CreateServiceSchema.safeParse({}).success).toBe(false);
  });
});
