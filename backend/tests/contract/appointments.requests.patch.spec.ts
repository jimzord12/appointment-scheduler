import { agent } from 'supertest';
import { describe, expect, it } from 'vitest';

import app from '../../src/app';
import { AppointmentRequestSchema, UpdateAppointmentRequestSchema } from '../../src/schemas';

// T015: Contract test PATCH /appointments/requests/:id (expected RED)

describe('PATCH /appointments/requests/:id (contract)', () => {
  const endpoint = (id: string) => `/appointments/requests/${id}`;
  const server = agent(app);

  it('updates status to approved returning 200 (expected FAIL)', async () => {
    const id = crypto.randomUUID();
    const res = await server
      .patch(endpoint(id))
      .send({ status: 'approved' })
      .set('Authorization', 'Bearer fake');
    expect(res.status).toBe(200); // fails now
    const parsed = AppointmentRequestSchema.safeParse(res.body);
    expect(parsed.success).toBe(true);
  });

  it('rejects invalid status', async () => {
    const id = crypto.randomUUID();
    const res = await server
      .patch(endpoint(id))
      .send({ status: 'unknown' })
      .set('Authorization', 'Bearer fake');
    expect(res.status).toBe(400); // fails now
  });

  it('schema compile check', () => {
    expect(UpdateAppointmentRequestSchema.shape).toBeDefined();
  });
});
