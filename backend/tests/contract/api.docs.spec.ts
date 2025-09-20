import { agent } from 'supertest';
import { describe, expect, it } from 'vitest';

import app from '../../src/app.js';

const server = agent(app);

describe('GET /docs/openapi.json (contract)', () => {
  it('returns 200 and valid OpenAPI fields', async () => {
    const res = await server.get('/docs/openapi.json');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('openapi');
    expect(res.body.openapi).toMatch(/^3\.\d+\.\d+$/);
    expect(res.body).toHaveProperty('paths');
    expect(res.body.paths).toHaveProperty('/auth/login');
    expect(res.body.paths).toHaveProperty('/services');
    expect(res.body.paths).toHaveProperty('/appointments/requests');
  });
});
