import { agent } from 'supertest';
import { describe, expect, it } from 'vitest';
import app from '../../src/app';
import { UserSchema } from '../../src/schemas';

// T010: Contract test for PATCH /user/profile (expected to fail until implemented)\

const server = agent(app);

describe('PATCH /user/profile (contract)', () => {
  const endpoint = '/user/profile';
  it('updates profile returning 200 and updated user (expected FAIL)', async () => {
    const res = await server
      .patch(endpoint)
      .set('Authorization', 'Bearer fake')
      .send({ name: 'New Name' });
    expect(res.status).toBe(200); // fails now
    const parsed = UserSchema.safeParse(res.body);
    expect(parsed.success).toBe(true);
  });

  it('rejects unauthorized update', async () => {
    const res = await server.patch(endpoint).send({ name: 'New Name' });
    expect(res.status).toBe(401); // fails now (likely 404)
  });
});

