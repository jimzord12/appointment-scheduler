import { agent } from 'supertest';
import { describe, expect, it } from 'vitest';
import app from '../../src/app';
import { ServiceSchema } from '../../src/schemas';

// T011: Contract test GET /services (expected RED)

describe('GET /services (contract)', () => {
  const endpoint = '/services';
  const server = agent(app);

  it('returns 200 with array of ServiceSchema (expected FAIL)', async () => {
    const res = await server.get(endpoint);
    expect(res.status).toBe(200); // fails (404)
    expect(Array.isArray(res.body)).toBe(true);
    // Optionally validate first item shape when implemented
    if (res.body.length > 0) {
      const parsed = ServiceSchema.safeParse(res.body[0]);
      expect(parsed.success).toBe(true);
    }
  });
});

