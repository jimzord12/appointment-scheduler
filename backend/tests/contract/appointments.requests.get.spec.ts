import { describe, expect, it } from 'vitest';

import { AppointmentRequestSchema } from '../../src/schemas/index.js';
import { createManagerAndService, makeServer } from '../utils/testClient';

// T013: Contract test GET /appointments/requests (expected RED)

describe('GET /appointments/requests (contract)', () => {
  const endpoint = '/appointments/requests';
  const server = makeServer();

  it('returns 200 with list when authenticated', async () => {
    const { managerToken } = await createManagerAndService(server, {
      service: { name: 'Cut', durationMinutes: 30, price: 35 },
    });
    const res = await server.get(endpoint).set('Authorization', `Bearer ${managerToken}`);
    expect(res.status).toBe(200);
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
