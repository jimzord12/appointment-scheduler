/**
 * T016 Integration test: User registration + login flow (expected FAIL until implementation)
 * Steps:
 *  1. Register new user → 201 AuthResponseSchema
 *  2. Duplicate registration (same email) → 409 Conflict
 *  3. Login wrong password → 401
 *  4. Login correct password → 200 AuthResponseSchema
 *  5. Fetch profile with bearer token → 200 UserSchema
 *
 * All assertions currently FAIL because endpoints are not implemented (404 responses).
 */
import { agent } from 'supertest';
import { describe, expect, it } from 'vitest';

import { createApp } from '../../src/app';
import { AuthResponseSchema, UserSchema } from '../../src/schemas';

const app = createApp();
const server = agent(app);
const baseEmail = 'flowuser@example.com';
const password = 'Password123!';

describe('T016: Auth flow (expected FAIL)', () => {
  const registerEndpoint = '/auth/register';
  const loginEndpoint = '/auth/login';
  const profileEndpoint = '/user/profile';
  let token: string | null = null;

  it('registers a new user (expected FAIL)', async () => {
    const res = await server.post(registerEndpoint).send({
      name: 'Flow User',
      email: baseEmail,
      password,
    });
    expect(res.status).toBe(201); // expected FAIL (404 now)
    const parsed = AuthResponseSchema.safeParse(res.body);
    expect(parsed.success).toBe(true);
    if (parsed.success) token = parsed.data.token;
  });

  it('rejects duplicate registration (expected FAIL)', async () => {
    const res = await server.post(registerEndpoint).send({
      name: 'Flow User',
      email: baseEmail,
      password,
    });
    expect(res.status).toBe(409); // expected FAIL (404 now)
  });

  it('rejects login with wrong password (expected FAIL)', async () => {
    const res = await server.post(loginEndpoint).send({
      email: baseEmail,
      password: 'WrongPass999',
    });
    expect(res.status).toBe(401); // expected FAIL (404 now)
  });

  it('logs in with correct password (expected FAIL)', async () => {
    const res = await server.post(loginEndpoint).send({
      email: baseEmail,
      password,
    });
    expect(res.status).toBe(200); // expected FAIL (404 now)
    const parsed = AuthResponseSchema.safeParse(res.body);
    expect(parsed.success).toBe(true);
    if (parsed.success) token = parsed.data.token;
  });

  it('fetches profile with token (expected FAIL)', async () => {
    expect(token).not.toBeNull(); // Will not be set yet; previous test already fails
    const res = await server.get(profileEndpoint).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200); // expected FAIL (404 now)
    const parsed = UserSchema.safeParse(res.body);
    expect(parsed.success).toBe(true);
  });
});
