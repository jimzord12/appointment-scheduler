import { z } from 'zod';

import { UserSchema } from '../../src/schemas/index.js';

import { __findUserById, __updateUser, sanitizeUser } from './authService.js';

const UpdateProfileInput = z.object({
  userId: z.string().uuid(),
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
});

export async function getProfile(userId: string) {
  const user = __findUserById(userId);
  if (!user) {
    throw Object.assign(new Error('Not found'), { status: 404 });
  }
  return sanitizeUser(user);
}

export async function updateProfile(input: z.infer<typeof UpdateProfileInput>) {
  const parsed = UpdateProfileInput.parse(input);
  const updated = __updateUser(parsed.userId, { name: parsed.name, email: parsed.email });
  if (!updated) {
    throw Object.assign(new Error('Not found'), { status: 404 });
  }
  return UserSchema.parse(sanitizeUser(updated));
}

export { UpdateProfileInput };
