import { agent } from 'supertest';
import { describe, expect, it } from 'vitest';

import app from '../../src/app';
import { AuthResponseSchema, LoginSchema } from '../../src/schemas';

// T008: Contract test for POST /auth/login (expected to FAIL initially)

const server = agent(app);

describe('POST /auth/login (contract)', () => {
  const endpoint = '/auth/login';
  it('returns 200 with AuthResponseSchema shape when valid credentials supplied (expected FAIL)', async () => {
    const res = await server
      .post(endpoint)
      .send({ email: 'test@example.com', password: 'password123' });
    expect(res.status).toBe(200); // fails now
    const parsed = AuthResponseSchema.safeParse(res.body);
    expect(parsed.success).toBe(true);
  });

  it('rejects missing credentials', async () => {
    const res = await server.post(endpoint).send({});
    expect(res.status).toBe(400); // fails now
  });

  it('schema compile check', () => {
    const invalid = LoginSchema.safeParse({});
    expect(invalid.success).toBe(false);
  });
});
