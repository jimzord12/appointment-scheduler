import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

import {
  AuthResponseSchema,
  CreateUserSchema,
  LoginSchema,
  UserSchema,
} from '../../src/schemas/index.js';

import * as usersRepo from './repos/usersRepo.js';

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
const isDbEnabled = () => process.env.USE_DB_USERS === '1' && !!process.env.DATABASE_URL;

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
  const existing = isDbEnabled()
    ? await usersRepo.findByEmail(parsed.email)
    : users.find(u => u.email.toLowerCase() === parsed.email.toLowerCase());
  if (existing) {
    throw Object.assign(new Error('Email already registered'), { status: 409 });
  }
  // Basic password strength (already min length checked); can extend later
  const passwordHash = await bcrypt.hash(parsed.password, 10);
  const now = new Date();
  let created: usersRepo.UserRecord;
  if (isDbEnabled()) {
    created = await usersRepo.create({
      name: parsed.name,
      email: parsed.email,
      passwordHash,
      role: parsed.role ?? 'customer',
    });
    // Mirror into memory for compatibility with synchronous callers
    users.push({
      id: created.id,
      name: created.name,
      email: created.email,
      passwordHash: created.passwordHash,
      role: created.role,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    });
  } else {
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
    created = user as unknown as usersRepo.UserRecord;
  }
  const token = jwt.sign({ sub: (created as any).id, role: (created as any).role }, JWT_SECRET, {
    expiresIn: TOKEN_EXPIRY,
  });
  const authResponse = { user: sanitizeUser(created as any as StoredUser), token };
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
  const user = isDbEnabled()
    ? await usersRepo.findByEmail(parsed.email)
    : users.find(u => u.email.toLowerCase() === parsed.email.toLowerCase());
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
  if (isDbEnabled()) {
    // Mirror into memory to keep other services using __findUserById working
    const exists = users.find(u => u.id === (user as any).id);
    if (!exists) {
      users.push({
        id: (user as any).id,
        name: (user as any).name,
        email: (user as any).email,
        passwordHash: (user as any).passwordHash,
        role: (user as any).role,
        createdAt: (user as any).createdAt,
        updatedAt: (user as any).updatedAt,
      });
    }
  }
  return AuthResponseSchema.parse({ user: sanitizeUser(user as any as StoredUser), token });
};

export function sanitizeUser(user: StoredUser) {
  return UserSchema.parse({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  });
}

// For test resets (will be removed when DB integration ready)
export function __resetAuthStore() {
  users.splice(0, users.length);
  // Also clear backing repo memory if used in tests
  try {
    usersRepo.__resetMemory();
  } catch {
    // no-op: repo may not expose reset in production
  }
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
