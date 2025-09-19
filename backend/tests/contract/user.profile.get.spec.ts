import { describe, expect, it } from 'vitest';

import { UserSchema } from '../../src/schemas';
import { makeServer, registerUser } from '../utils/testClient';

// T009: Contract test for GET /user/profile (expected 401 or not implemented)

const server = makeServer();

describe('GET /user/profile (contract)', () => {
  const endpoint = '/user/profile';
  it('returns 200 and user profile when authenticated', async () => {
    const { token } = await registerUser(server, {
      name: 'Eve',
      email: `eve_${Math.random().toString(36).slice(2)}@example.com`,
      password: 'password123',
      role: 'customer',
    });
    const res = await server.get(endpoint).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    const parsed = UserSchema.safeParse(res.body);
    expect(parsed.success).toBe(true);
  });

  it('returns 401 when unauthenticated', async () => {
    const res = await server.get(endpoint);
    expect(res.status).toBe(401); // fails now (currently 404)
  });
});
