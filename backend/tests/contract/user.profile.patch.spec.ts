import { describe, expect, it } from 'vitest';

import { UserSchema } from '../../src/schemas/index.js';
import { makeServer, registerUser } from '../utils/testClient.js';

// Contract test for PATCH /user/profile

describe('PATCH /user/profile (contract)', () => {
  const server = makeServer();
  const endpoint = '/user/profile';

  it('updates profile returning 200 and updated user', async () => {
    const { token } = await registerUser(server, {
      name: 'Frank',
      email: `frank_${Math.random().toString(36).slice(2)}@example.com`,
      password: 'password123',
      role: 'customer',
    });
    const res = await server
      .patch(endpoint)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'New Name' });
    expect(res.status).toBe(200);
    const parsed = UserSchema.safeParse(res.body);
    expect(parsed.success).toBe(true);
  });

  it('rejects unauthorized update', async () => {
    const res = await server.patch(endpoint).send({ name: 'New Name' });
    expect(res.status).toBe(401);
  });
});
