import { agent } from 'supertest';
import { describe, expect, it } from 'vitest';
import app from '../../src/app';
import { UserSchema } from '../../src/schemas';

// T009: Contract test for GET /user/profile (expected 401 or not implemented)

const server = agent(app);

describe('GET /user/profile (contract)', () => {
  const endpoint = '/user/profile';
  it('returns 200 and user profile when authenticated (expected FAIL)', async () => {
    const res = await server.get(endpoint).set('Authorization', 'Bearer fake');
    expect(res.status).toBe(200); // fails now
    const parsed = UserSchema.safeParse(res.body);
    expect(parsed.success).toBe(true);
  });

  it('returns 401 when unauthenticated', async () => {
    const res = await server.get(endpoint);
    expect(res.status).toBe(401); // fails now (currently 404)
  });
});

