// Shared Zod schema exports (T006)
// Re-export contract-level schemas for backend usage. Implementation-specific refinements will live in adjacent files later.
import {
  AppointmentRequestSchema,
  AuthResponseSchema,
  CreateAppointmentRequestSchema,
  CreateServiceSchema,
  CreateUserSchema,
  ErrorResponseSchema,
  LoginSchema,
  ServiceSchema,
  UpdateAppointmentRequestSchema,
  UserSchema,
} from '../../../specs/001-build-an-web/contracts/api-contracts.js';

export {
  AppointmentRequestSchema,
  AuthResponseSchema,
  CreateAppointmentRequestSchema,
  CreateServiceSchema,
  CreateUserSchema,
  ErrorResponseSchema,
  LoginSchema,
  ServiceSchema,
  UpdateAppointmentRequestSchema,
  UserSchema,
};

// Example placeholder for future internal-only schema variations
// export const InternalUserWithPasswordSchema = UserSchema.extend({ passwordHash: z.string() });
