import { agent } from 'supertest';
import { describe, expect, it } from 'vitest';
import app from '../../src/app';
import { AppointmentRequestSchema } from '../../src/schemas';

// T013: Contract test GET /appointments/requests (expected RED)

describe('GET /appointments/requests (contract)', () => {
  const endpoint = '/appointments/requests';
  const server = agent(app);

  it('returns 200 with list when authenticated (expected FAIL)', async () => {
    const res = await server.get(endpoint).set('Authorization', 'Bearer fake');
    expect(res.status).toBe(200); // fails now
    if (Array.isArray(res.body) && res.body.length > 0) {
      const parsed = AppointmentRequestSchema.safeParse(res.body[0]);
      expect(parsed.success).toBe(true);
    }
  });

  it('returns 401 when unauthenticated', async () => {
    const res = await server.get(endpoint);
    expect(res.status).toBe(401); // fails now (404)
  });
});

