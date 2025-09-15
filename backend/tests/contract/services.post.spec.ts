import { agent } from 'supertest';
import { describe, expect, it } from 'vitest';

import app from '../../src/app';
import { CreateServiceSchema, ServiceSchema } from '../../src/schemas';

// T012: Contract test POST /services (expected RED)

describe('POST /services (contract)', () => {
  const endpoint = '/services';
  const server = agent(app);

  it('creates a new service returning 201 and ServiceSchema (expected FAIL)', async () => {
    const payload = { name: 'Cut', durationMinutes: 30, price: 35 };
    const res = await server.post(endpoint).send(payload);
    expect(res.status).toBe(201); // fails now
    const parsed = ServiceSchema.safeParse(res.body);
    expect(parsed.success).toBe(true);
  });

  it('rejects invalid payload (missing name)', async () => {
    const res = await server.post(endpoint).send({ durationMinutes: 30, price: 35 });
    expect(res.status).toBe(400); // fails now
  });

  it('schema compile check', () => {
    expect(CreateServiceSchema.safeParse({}).success).toBe(false);
  });
});
