import { agent } from 'supertest';
import { describe, expect, it } from 'vitest';
import app from '../../src/app';
import { AuthResponseSchema, CreateUserSchema } from '../../src/schemas';

// T007: Contract test for POST /auth/register
// Enforced RED state: expects future successful implementation & validation behavior.

const server = agent(app);

describe('POST /auth/register (contract)', () => {
  const endpoint = '/auth/register';

  it('returns 201 with AuthResponseSchema shape when valid payload provided (expected FAIL until implemented)', async () => {
    const payload = { name: 'Test User', email: 'test@example.com', password: 'password123' };
    const res = await server.post(endpoint).send(payload);
    expect(res.status).toBe(201); // Fails now (endpoint absent)
    const parsed = AuthResponseSchema.safeParse(res.body);
    expect(parsed.success).toBe(true); // Unreachable until implemented
  });

  it('rejects missing required fields', async () => {
    const res = await server.post(endpoint).send({});
    expect(res.status).toBe(400); // Fails now (likely 404)
  });

  it('rejects weak password', async () => {
    const res = await server
      .post(endpoint)
      .send({ name: 'A', email: 'weak@example.com', password: '123' });
    expect(res.status).toBe(400); // Fails now
  });

  it('schema compile sanity check (should remain green)', () => {
    const invalid = CreateUserSchema.safeParse({});
    expect(invalid.success).toBe(false);
  });
});

