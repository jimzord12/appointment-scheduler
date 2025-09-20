import { describe, expect, it } from 'vitest';

import { AuthResponseSchema, LoginSchema } from '../../src/schemas/index.js';
import { makeServer, registerUser } from '../utils/testClient.js';

// T008: Contract test for POST /auth/login (expected to FAIL initially)

const server = makeServer();

describe('POST /auth/login (contract)', () => {
  const endpoint = '/auth/login';
  it('returns 200 with AuthResponseSchema shape when valid credentials supplied', async () => {
    // Arrange: register a user first
    const email = `login_${Math.random().toString(36).slice(2)}@example.com`;
    await registerUser(server, { name: 'Login User', email, password: 'password123' });

    // Act: login with correct credentials
    const res = await server.post(endpoint).send({ email, password: 'password123' });
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
