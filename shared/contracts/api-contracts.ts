// API Contracts for Appointment Management
// Using Zod schemas with oRPC for end-to-end type-safe API communication

import { z } from 'zod';

// Helper: ISO 8601 date (YYYY-MM-DD) string (not Date instance). Adjust if timezones later required.
const isoDateString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Expected date in YYYY-MM-DD format' })
  .refine(
    (v: string) => {
      const d = new Date(v + 'T00:00:00Z');
      // Check constructed date validity and preserve original components (avoid JS date coercion mismatches)
      return !isNaN(d.getTime()) && v === d.toISOString().slice(0, 10);
    },
    { message: 'Invalid calendar date' }
  );

// User schemas
export const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2).max(100),
  email: z.string().email(),
  role: z.enum(['customer', 'manager']),
  // Transport as ISO datetime strings
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateUserSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['customer', 'manager']).optional().default('customer'),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Service schemas
export const ServiceSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2).max(50),
  description: z.string().optional(),
  durationMinutes: z.number().int().min(15).max(480),
  price: z.number().min(0),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateServiceSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().optional(),
  durationMinutes: z.number().int().min(15).max(480),
  price: z.number().min(0),
});

// Appointment Request schemas
export const AppointmentRequestSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  serviceId: z.string().uuid(),
  requestedDate: isoDateString, // ISO date string (validated)
  requestedTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/), // HH:MM 24h
  status: z.enum(['pending', 'approved', 'rejected']),
  notes: z.string().optional(),
  managerNotes: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateAppointmentRequestSchema = z.object({
  serviceId: z.string().uuid(),
  requestedDate: isoDateString,
  requestedTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  notes: z.string().optional(),
});

export const UpdateAppointmentRequestSchema = z.object({
  status: z.enum(['approved', 'rejected']),
  managerNotes: z.string().optional(),
});

// Response schemas
export const AuthResponseSchema = z.object({
  user: UserSchema,
  token: z.string(),
});

export const ErrorResponseSchema = z.object({
  error: z.string(),
  message: z.string().optional(),
});

// API Procedure definitions (for oRPC)
export const authProcedures = {
  register: {
    input: CreateUserSchema,
    output: AuthResponseSchema,
  },
  login: {
    input: LoginSchema,
    output: AuthResponseSchema,
  },
};

export const userProcedures = {
  getProfile: {
    input: z.object({}),
    output: UserSchema,
  },
  updateProfile: {
    input: z.object({
      name: z.string().min(2).max(100).optional(),
      email: z.string().email().optional(),
    }),
    output: UserSchema,
  },
};

export const serviceProcedures = {
  getServices: {
    input: z.object({}),
    output: z.array(ServiceSchema),
  },
  createService: {
    input: CreateServiceSchema,
    output: ServiceSchema,
  },
};

export const appointmentProcedures = {
  getRequests: {
    input: z.object({}),
    output: z.array(AppointmentRequestSchema),
  },
  createRequest: {
    input: CreateAppointmentRequestSchema,
    output: AppointmentRequestSchema,
  },
  updateRequest: {
    input: z.object({
      id: z.string().uuid(),
      ...UpdateAppointmentRequestSchema.shape,
    }),
    output: AppointmentRequestSchema,
  },
};
