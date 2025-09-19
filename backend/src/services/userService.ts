import { z } from 'zod';

import { UserSchema } from '../../src/schemas/index.js';

import { __findUserById, __updateUser, sanitizeUser } from './authService.js';
import * as usersRepo from './repos/usersRepo.js';

const isDbEnabled = () => process.env.USE_DB_USERS === '1' && !!process.env.DATABASE_URL;

const UpdateProfileInput = z.object({
  userId: z.string().uuid(),
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
});

export async function getProfile(userId: string) {
  const user = isDbEnabled() ? await usersRepo.findById(userId) : __findUserById(userId);
  if (!user) {
    throw Object.assign(new Error('Not found'), { status: 404 });
  }
  return sanitizeUser(user as any);
}

export async function updateProfile(input: z.infer<typeof UpdateProfileInput>) {
  const parsed = UpdateProfileInput.parse(input);
  const updated = isDbEnabled()
    ? await usersRepo.update(parsed.userId, { name: parsed.name, email: parsed.email })
    : __updateUser(parsed.userId, { name: parsed.name, email: parsed.email });
  if (!updated) {
    throw Object.assign(new Error('Not found'), { status: 404 });
  }
  return UserSchema.parse(sanitizeUser(updated as any));
}

export { UpdateProfileInput };
