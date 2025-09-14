import { agent } from 'supertest';
import { describe, expect, it } from 'vitest';
import app from '../../src/app';
import { AppointmentRequestSchema, CreateAppointmentRequestSchema } from '../../src/schemas';

// T014: Contract test POST /appointments/requests (expected RED)

describe('POST /appointments/requests (contract)', () => {
  const endpoint = '/appointments/requests';
  const server = agent(app);

  it('creates appointment request returning 201 (expected FAIL)', async () => {
    const payload = {
      serviceId: crypto.randomUUID(),
      requestedDate: '2030-01-01',
      requestedTime: '10:00',
    };
    const res = await server.post(endpoint).send(payload).set('Authorization', 'Bearer fake');
    expect(res.status).toBe(201); // fails now
    const parsed = AppointmentRequestSchema.safeParse(res.body);
    expect(parsed.success).toBe(true);
  });

  it('rejects invalid time format', async () => {
    const payload = {
      serviceId: crypto.randomUUID(),
      requestedDate: '2030-01-01',
      requestedTime: '25:99',
    };
    const res = await server.post(endpoint).send(payload).set('Authorization', 'Bearer fake');
    expect(res.status).toBe(400); // fails now
  });

  it('schema compile check', () => {
    expect(CreateAppointmentRequestSchema.safeParse({}).success).toBe(false);
  });
});

