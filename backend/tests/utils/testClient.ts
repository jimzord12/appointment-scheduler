import { agent } from 'supertest';

import app from '../../src/app.js';

export type ServerAgent = ReturnType<typeof agent>;

export function makeServer(): ServerAgent {
  return agent(app);
}

export async function registerUser(
  server: ServerAgent,
  {
    name = 'Test User',
    email = `test_${Math.random().toString(36).slice(2)}@example.com`,
    password = 'password123',
    role,
  }: { name?: string; email?: string; password?: string; role?: 'customer' | 'manager' }
) {
  const res = await server.post('/auth/register').send({ name, email, password, role });
  return res.body as { user: any; token: string };
}

export async function loginUser(
  server: ServerAgent,
  { email, password = 'password123' }: { email: string; password?: string }
) {
  const res = await server.post('/auth/login').send({ email, password });
  return res.body as { user: any; token: string };
}

export async function createManagerAndService(
  server: ServerAgent,
  {
    service = { name: 'Cut', durationMinutes: 30, price: 35 },
  }: { service?: { name: string; durationMinutes: number; price: number; description?: string } }
) {
  const { token: managerToken } = await registerUser(server, {
    name: 'Manager',
    email: `manager_${Math.random().toString(36).slice(2)}@example.com`,
    password: 'password123',
    role: 'manager',
  });
  const serviceRes = await server
    .post('/services')
    .set('Authorization', `Bearer ${managerToken}`)
    .send(service);
  return { managerToken, service: serviceRes.body } as {
    managerToken: string;
    service: any;
  };
}
