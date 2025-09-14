/**
 * T017 Integration test: Service CRUD minimal flow (expected FAIL)
 * Steps:
 *  1. Register manager user (assumed role assignment in future implementation)
 *  2. Register customer user
 *  3. Manager creates a service → 201 ServiceSchema
 *  4. Customer attempts to create service → 403
 *  5. List services (any user) → 200 array length >= 1
 */
import { agent } from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../../src/app';
import { ServiceSchema } from '../../src/schemas';

const app = createApp();
const server = agent(app);

describe('T017: Services flow (expected FAIL)', () => {
  const registerEndpoint = '/auth/register';
  const servicesEndpoint = '/services';

  let managerToken: string | null = null;
  let customerToken: string | null = null;

  it('registers manager user (expected FAIL)', async () => {
    const res = await server.post(registerEndpoint).send({
      name: 'Manager',
      email: 'manager@example.com',
      password: 'Password123!',
      role: 'manager', // Will be validated later
    });
    expect(res.status).toBe(201); // expected FAIL (404 now)
    // (ServiceSchema referenced later once service create returns body)
    managerToken = res.body?.token;
  });

  it('registers customer user (expected FAIL)', async () => {
    const res = await server.post(registerEndpoint).send({
      name: 'Customer',
      email: 'customer@example.com',
      password: 'Password123!',
      role: 'customer',
    });
    expect(res.status).toBe(201); // expected FAIL (404 now)
    customerToken = res.body?.token;
  });

  it('manager creates a service (expected FAIL)', async () => {
    expect(managerToken).not.toBeNull();
    const res = await server
      .post(servicesEndpoint)
      .set('Authorization', `Bearer ${managerToken}`)
      .send({ name: 'Cut', durationMinutes: 30, price: 35 });
    expect(res.status).toBe(201); // expected FAIL (404 now)
    const parsed = ServiceSchema.safeParse(res.body);
    expect(parsed.success).toBe(true);
  });

  it('customer cannot create a service (expected FAIL)', async () => {
    expect(customerToken).not.toBeNull();
    const res = await server
      .post(servicesEndpoint)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ name: 'Wash', durationMinutes: 20, price: 15 });
    expect(res.status).toBe(403); // expected FAIL (404 now)
  });

  it('lists services (expected FAIL)', async () => {
    const res = await server.get(servicesEndpoint);
    expect(res.status).toBe(200); // expected FAIL (404 now)
    expect(Array.isArray(res.body)).toBe(true);
    if (res.body.length > 0) {
      const parsed = ServiceSchema.safeParse(res.body[0]);
      expect(parsed.success).toBe(true);
    }
  });
});

