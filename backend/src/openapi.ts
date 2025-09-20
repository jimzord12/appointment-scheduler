import 'zod-openapi';
import * as zv4 from 'zod/v4';
import { createDocument } from 'zod-openapi';

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
} from './schemas/index.js';

export function buildOpenApiSpec() {
  try {
    const doc = createDocument({
      openapi: '3.1.0',
      info: {
        title: 'Appointment Scheduler API',
        version: '0.1.0',
      },
      servers: [{ url: '/' }],
      paths: {
        '/auth/register': {
          post: {
            summary: 'Register a new user',
            requestBody: {
              content: {
                'application/json': { schema: CreateUserSchema as unknown as zv4.ZodTypeAny },
              },
            },
            responses: {
              201: {
                description: 'Registered',
                content: { 'application/json': { schema: AuthResponseSchema } },
              },
              400: {
                description: 'Bad Request',
                content: { 'application/json': { schema: ErrorResponseSchema } },
              },
            },
          },
        },
        '/auth/login': {
          post: {
            summary: 'Login',
            requestBody: {
              content: { 'application/json': { schema: LoginSchema as unknown as zv4.ZodTypeAny } },
            },
            responses: {
              200: {
                description: 'OK',
                content: {
                  'application/json': { schema: AuthResponseSchema as unknown as zv4.ZodTypeAny },
                },
              },
              400: {
                description: 'Bad Request',
                content: {
                  'application/json': { schema: ErrorResponseSchema as unknown as zv4.ZodTypeAny },
                },
              },
            },
          },
        },
        '/user/profile': {
          get: {
            summary: 'Get current user profile',
            responses: {
              200: {
                description: 'OK',
                content: {
                  'application/json': { schema: UserSchema as unknown as zv4.ZodTypeAny },
                },
              },
              401: {
                description: 'Unauthorized',
                content: {
                  'application/json': { schema: ErrorResponseSchema as unknown as zv4.ZodTypeAny },
                },
              },
            },
          },
          patch: {
            summary: 'Update current user profile',
            requestBody: {
              content: {
                'application/json': {
                  schema: zv4.object({
                    name: zv4.string().min(2).max(100).optional(),
                    email: zv4.string().email().optional(),
                  }),
                },
              },
            },
            responses: {
              200: {
                description: 'OK',
                content: {
                  'application/json': { schema: UserSchema as unknown as zv4.ZodTypeAny },
                },
              },
              400: {
                description: 'Bad Request',
                content: {
                  'application/json': { schema: ErrorResponseSchema as unknown as zv4.ZodTypeAny },
                },
              },
              401: {
                description: 'Unauthorized',
                content: {
                  'application/json': { schema: ErrorResponseSchema as unknown as zv4.ZodTypeAny },
                },
              },
            },
          },
        },
        '/services': {
          get: {
            summary: 'List active services',
            responses: {
              200: {
                description: 'OK',
                content: {
                  'application/json': {
                    schema: zv4.array(ServiceSchema as unknown as zv4.ZodTypeAny),
                  },
                },
              },
            },
          },
          post: {
            summary: 'Create a new service (manager only)',
            requestBody: {
              content: {
                'application/json': { schema: CreateServiceSchema as unknown as zv4.ZodTypeAny },
              },
            },
            responses: {
              201: {
                description: 'Created',
                content: {
                  'application/json': { schema: ServiceSchema as unknown as zv4.ZodTypeAny },
                },
              },
              400: {
                description: 'Bad Request',
                content: {
                  'application/json': { schema: ErrorResponseSchema as unknown as zv4.ZodTypeAny },
                },
              },
              401: {
                description: 'Unauthorized',
                content: {
                  'application/json': { schema: ErrorResponseSchema as unknown as zv4.ZodTypeAny },
                },
              },
              403: {
                description: 'Forbidden',
                content: {
                  'application/json': { schema: ErrorResponseSchema as unknown as zv4.ZodTypeAny },
                },
              },
            },
          },
        },
        '/appointments/requests': {
          get: {
            summary: 'List appointment requests for current user',
            responses: {
              200: {
                description: 'OK',
                content: {
                  'application/json': {
                    schema: zv4.array(AppointmentRequestSchema as unknown as zv4.ZodTypeAny),
                  },
                },
              },
              401: {
                description: 'Unauthorized',
                content: {
                  'application/json': { schema: ErrorResponseSchema as unknown as zv4.ZodTypeAny },
                },
              },
            },
          },
          post: {
            summary: 'Create appointment request',
            requestBody: {
              content: {
                'application/json': {
                  schema: CreateAppointmentRequestSchema as unknown as zv4.ZodTypeAny,
                },
              },
            },
            responses: {
              201: {
                description: 'Created',
                content: {
                  'application/json': {
                    schema: AppointmentRequestSchema as unknown as zv4.ZodTypeAny,
                  },
                },
              },
              400: {
                description: 'Bad Request',
                content: {
                  'application/json': { schema: ErrorResponseSchema as unknown as zv4.ZodTypeAny },
                },
              },
              401: {
                description: 'Unauthorized',
                content: {
                  'application/json': { schema: ErrorResponseSchema as unknown as zv4.ZodTypeAny },
                },
              },
              409: {
                description: 'Conflict (double-booking)',
                content: {
                  'application/json': { schema: ErrorResponseSchema as unknown as zv4.ZodTypeAny },
                },
              },
            },
          },
        },
        '/appointments/requests/{id}': {
          patch: {
            summary: 'Approve or reject an appointment request',
            requestParams: {
              path: zv4.object({ id: zv4.string().uuid() }),
            },
            requestBody: {
              content: {
                'application/json': {
                  schema: UpdateAppointmentRequestSchema as unknown as zv4.ZodTypeAny,
                },
              },
            },
            responses: {
              200: {
                description: 'OK',
                content: {
                  'application/json': {
                    schema: AppointmentRequestSchema as unknown as zv4.ZodTypeAny,
                  },
                },
              },
              400: {
                description: 'Bad Request',
                content: {
                  'application/json': { schema: ErrorResponseSchema as unknown as zv4.ZodTypeAny },
                },
              },
              401: {
                description: 'Unauthorized',
                content: {
                  'application/json': { schema: ErrorResponseSchema as unknown as zv4.ZodTypeAny },
                },
              },
              403: {
                description: 'Forbidden',
                content: {
                  'application/json': { schema: ErrorResponseSchema as unknown as zv4.ZodTypeAny },
                },
              },
              404: {
                description: 'Not Found',
                content: {
                  'application/json': { schema: ErrorResponseSchema as unknown as zv4.ZodTypeAny },
                },
              },
            },
          },
        },
      },
    });
    return doc;
  } catch {
    // Fallback: return a minimal static document if generation fails
    return {
      openapi: '3.1.0',
      info: { title: 'Appointment Scheduler API', version: '0.1.0' },
      servers: [{ url: '/' }],
      paths: {
        '/auth/register': {
          post: {
            summary: 'Register a new user',
            responses: { 201: { description: 'Registered' } },
          },
        },
        '/auth/login': { post: { summary: 'Login', responses: { 200: { description: 'OK' } } } },
        '/user/profile': {
          get: { summary: 'Get current user profile', responses: { 200: { description: 'OK' } } },
          patch: {
            summary: 'Update current user profile',
            responses: { 200: { description: 'OK' } },
          },
        },
        '/services': {
          get: { summary: 'List active services', responses: { 200: { description: 'OK' } } },
          post: {
            summary: 'Create a new service (manager only)',
            responses: { 201: { description: 'Created' } },
          },
        },
        '/appointments/requests': {
          get: {
            summary: 'List appointment requests for current user',
            responses: { 200: { description: 'OK' } },
          },
          post: {
            summary: 'Create appointment request',
            responses: { 201: { description: 'Created' } },
          },
        },
        '/appointments/requests/{id}': {
          patch: {
            summary: 'Approve or reject an appointment request',
            responses: { 200: { description: 'OK' } },
          },
        },
      },
    } as const;
  }
}

export type OpenApiDoc = ReturnType<typeof buildOpenApiSpec>;
