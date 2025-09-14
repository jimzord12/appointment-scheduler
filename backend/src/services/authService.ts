import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import {
  AuthResponseSchema,
  CreateUserSchema,
  LoginSchema,
  UserSchema,
} from '../../src/schemas/index.js';

// Temporary in-memory user store until DB integration with Drizzle queries is added in later tasks.
interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'customer' | 'manager';
  createdAt: Date;
  updatedAt: Date;
}

const users: StoredUser[] = [];

const JWT_SECRET = process.env.JWT_SECRET || 'dev-insecure-secret';
const TOKEN_EXPIRY = '1h';

export const register = async (input: z.infer<typeof CreateUserSchema>) => {
  const parsedResult = CreateUserSchema.safeParse(input);
  if (!parsedResult.success) {
    throw Object.assign(new Error('Invalid registration payload'), {
      status: 400,
      issues: parsedResult.error.issues,
    });
  }
  const parsed = parsedResult.data;
  const existing = users.find(u => u.email.toLowerCase() === parsed.email.toLowerCase());
  if (existing) {
    throw Object.assign(new Error('Email already registered'), { status: 409 });
  }
  // Basic password strength (already min length checked); can extend later
  const passwordHash = await bcrypt.hash(parsed.password, 10);
  const now = new Date();
  const user: StoredUser = {
    id: crypto.randomUUID(),
    name: parsed.name,
    email: parsed.email,
    passwordHash,
    role: parsed.role ?? 'customer',
    createdAt: now,
    updatedAt: now,
  };
  users.push(user);
  const token = jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: TOKEN_EXPIRY,
  });
  const authResponse = { user: sanitizeUser(user), token };
  return AuthResponseSchema.parse(authResponse);
};

export const login = async (input: z.infer<typeof LoginSchema>) => {
  const parsedResult = LoginSchema.safeParse(input);
  if (!parsedResult.success) {
    throw Object.assign(new Error('Invalid login payload'), {
      status: 400,
      issues: parsedResult.error.issues,
    });
  }
  const parsed = parsedResult.data;
  const user = users.find(u => u.email.toLowerCase() === parsed.email.toLowerCase());
  if (!user) {
    throw Object.assign(new Error('Invalid credentials'), { status: 401 });
  }
  const ok = await bcrypt.compare(parsed.password, user.passwordHash);
  if (!ok) {
    throw Object.assign(new Error('Invalid credentials'), { status: 401 });
  }
  const token = jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: TOKEN_EXPIRY,
  });
  return AuthResponseSchema.parse({ user: sanitizeUser(user), token });
};

export function sanitizeUser(user: StoredUser) {
  return UserSchema.parse({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  });
}

// For test resets (will be removed when DB integration ready)
export function __resetAuthStore() {
  users.splice(0, users.length);
}

export function __findUserById(id: string) {
  return users.find(u => u.id === id) || null;
}

export function __updateUser(id: string, patch: Partial<Pick<StoredUser, 'name' | 'email'>>) {
  const u = users.find(user => user.id === id);
  if (!u) return null;
  if (patch.name) u.name = patch.name;
  if (patch.email) u.email = patch.email;
  u.updatedAt = new Date();
  return u;
}

export type AuthUser = ReturnType<typeof sanitizeUser>;

