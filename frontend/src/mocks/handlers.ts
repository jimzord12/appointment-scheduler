import { http, HttpResponse } from 'msw';
import { z } from 'zod';

// Import API contracts for type reference
import {
  CreateAppointmentRequestSchema,
  CreateServiceSchema,
  CreateUserSchema,
  LoginSchema,
} from '../../../specs/001-build-an-web/contracts/api-contracts.js';

// Mock data
const mockUser = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'customer' as const,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockManager = {
  id: '123e4567-e89b-12d3-a456-426614174001',
  name: 'Jane Manager',
  email: 'manager@example.com',
  role: 'manager' as const,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockService = {
  id: '123e4567-e89b-12d3-a456-426614174002',
  name: 'Haircut',
  description: 'Basic haircut service',
  durationMinutes: 30,
  price: 25,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockServices = [
  mockService,
  {
    ...mockService,
    id: '123e4567-e89b-12d3-a456-426614174003',
    name: 'Massage',
    description: 'Relaxing full body massage',
    durationMinutes: 60,
    price: 80,
  },
  {
    ...mockService,
    id: '123e4567-e89b-12d3-a456-426614174004',
    name: 'Manicure',
    description: 'Basic manicure service',
    durationMinutes: 45,
    price: 35,
  },
];

const mockAppointmentRequest = {
  id: '123e4567-e89b-12d3-a456-426614174005',
  userId: mockUser.id,
  serviceId: mockService.id,
  requestedDate: '2023-12-01',
  requestedTime: '14:30',
  status: 'pending' as const,
  notes: 'Please trim my hair short',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockAppointmentRequests = [
  mockAppointmentRequest,
  {
    ...mockAppointmentRequest,
    id: '123e4567-e89b-12d3-a456-426614174006',
    requestedDate: '2023-12-02',
    requestedTime: '10:00',
    status: 'approved' as const,
    managerNotes: 'Approved for 10:00 AM',
  },
  {
    ...mockAppointmentRequest,
    id: '123e4567-e89b-12d3-a456-426614174007',
    requestedDate: '2023-12-03',
    requestedTime: '16:00',
    status: 'rejected' as const,
    managerNotes: 'Fully booked at that time',
  },
];

const mockAuthResponse = {
  user: mockUser,
  token: 'mock-jwt-token',
};

// Authentication handlers
export const authHandlers = [
  // Register
  http.post('/api/auth/register', async ({ request }) => {
    try {
      const body = await request.json();
      const validatedBody = CreateUserSchema.parse(body);

      // Check if user already exists
      if (validatedBody.email === 'existing@example.com') {
        return HttpResponse.json(
          { error: 'Conflict', message: 'User already exists' },
          { status: 409 }
        );
      }

      // Return success response
      const response = {
        user: {
          ...mockUser,
          name: validatedBody.name,
          email: validatedBody.email,
          role: validatedBody.role || 'customer',
        },
        token: 'mock-jwt-token',
      };

      return HttpResponse.json(response, { status: 201 });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return HttpResponse.json(
          { error: 'Bad Request', message: 'Invalid input data' },
          { status: 400 }
        );
      }
      return HttpResponse.json(
        { error: 'Internal Server Error', message: 'An unexpected error occurred' },
        { status: 500 }
      );
    }
  }),

  // Login
  http.post('/api/auth/login', async ({ request }) => {
    try {
      const body = await request.json();
      const validatedBody = LoginSchema.parse(body);

      // Check credentials
      if (validatedBody.email === 'john@example.com' && validatedBody.password === 'password123') {
        return HttpResponse.json(mockAuthResponse, { status: 200 });
      }

      if (
        validatedBody.email === 'manager@example.com' &&
        validatedBody.password === 'password123'
      ) {
        return HttpResponse.json(
          {
            user: mockManager,
            token: 'mock-manager-jwt-token',
          },
          { status: 200 }
        );
      }

      // Invalid credentials
      return HttpResponse.json(
        { error: 'Unauthorized', message: 'Invalid credentials' },
        { status: 401 }
      );
    } catch (error) {
      if (error instanceof z.ZodError) {
        return HttpResponse.json(
          { error: 'Bad Request', message: 'Invalid input data' },
          { status: 400 }
        );
      }
      return HttpResponse.json(
        { error: 'Internal Server Error', message: 'An unexpected error occurred' },
        { status: 500 }
      );
    }
  }),
];

// User profile handlers
export const userHandlers = [
  // Get profile
  http.get('/api/user/profile', ({ request }) => {
    const authHeader = request.headers.get('authorization');

    // Check if token is valid
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        { error: 'Unauthorized', message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // Check token validity
    if (token === 'mock-jwt-token') {
      return HttpResponse.json(mockUser, { status: 200 });
    } else if (token === 'mock-manager-jwt-token') {
      return HttpResponse.json(mockManager, { status: 200 });
    } else {
      return HttpResponse.json(
        { error: 'Unauthorized', message: 'Invalid or expired token' },
        { status: 401 }
      );
    }
  }),

  // Update profile
  http.patch('/api/user/profile', async ({ request }) => {
    try {
      const authHeader = request.headers.get('authorization');

      // Check if token is valid
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return HttpResponse.json(
          { error: 'Unauthorized', message: 'Invalid or expired token' },
          { status: 401 }
        );
      }

      const token = authHeader.substring(7);

      // Check token validity
      if (token !== 'mock-jwt-token' && token !== 'mock-manager-jwt-token') {
        return HttpResponse.json(
          { error: 'Unauthorized', message: 'Invalid or expired token' },
          { status: 401 }
        );
      }

      const body = (await request.json()) as Record<string, any>;

      // Validate input
      if (
        body.name &&
        (typeof body.name !== 'string' || body.name.length < 2 || body.name.length > 100)
      ) {
        return HttpResponse.json(
          { error: 'Bad Request', message: 'Invalid name' },
          { status: 400 }
        );
      }

      if (body.email && (typeof body.email !== 'string' || !body.email.includes('@'))) {
        return HttpResponse.json(
          { error: 'Bad Request', message: 'Invalid email' },
          { status: 400 }
        );
      }

      // Return updated user
      const updatedUser = {
        ...(token === 'mock-jwt-token' ? mockUser : mockManager),
        ...body,
        updatedAt: new Date(),
      };

      return HttpResponse.json(updatedUser, { status: 200 });
    } catch (error) {
      return HttpResponse.json(
        { error: 'Internal Server Error', message: 'An unexpected error occurred' },
        { status: 500 }
      );
    }
  }),
];

// Services handlers
export const servicesHandlers = [
  // Get services
  http.get('/api/services', () => {
    return HttpResponse.json(mockServices, { status: 200 });
  }),

  // Create service
  http.post('/api/services', async ({ request }) => {
    try {
      const authHeader = request.headers.get('authorization');

      // Check if token is valid
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return HttpResponse.json(
          { error: 'Unauthorized', message: 'Invalid or expired token' },
          { status: 401 }
        );
      }

      const token = authHeader.substring(7);

      // Check if user is manager
      if (token !== 'mock-manager-jwt-token') {
        return HttpResponse.json(
          { error: 'Forbidden', message: 'Insufficient permissions' },
          { status: 403 }
        );
      }

      const body = await request.json();
      const validatedBody = CreateServiceSchema.parse(body);

      // Return new service
      const newService = {
        ...mockService,
        id: '123e4567-e89b-12d3-a456-426614174' + Math.floor(Math.random() * 1000),
        ...validatedBody,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return HttpResponse.json(newService, { status: 201 });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return HttpResponse.json(
          { error: 'Bad Request', message: 'Invalid input data' },
          { status: 400 }
        );
      }
      return HttpResponse.json(
        { error: 'Internal Server Error', message: 'An unexpected error occurred' },
        { status: 500 }
      );
    }
  }),
];

// Appointment handlers
export const appointmentHandlers = [
  // Get appointment requests
  http.get('/api/appointments/requests', ({ request }) => {
    const authHeader = request.headers.get('authorization');

    // Check if token is valid
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        { error: 'Unauthorized', message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // Check token validity
    if (token !== 'mock-jwt-token' && token !== 'mock-manager-jwt-token') {
      return HttpResponse.json(
        { error: 'Unauthorized', message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Return different requests based on user role
    if (token === 'mock-manager-jwt-token') {
      // Managers see all requests
      return HttpResponse.json(mockAppointmentRequests, { status: 200 });
    } else {
      // Customers see only their own requests
      const userRequests = mockAppointmentRequests.filter(req => req.userId === mockUser.id);
      return HttpResponse.json(userRequests, { status: 200 });
    }
  }),

  // Create appointment request
  http.post('/api/appointments/requests', async ({ request }) => {
    try {
      const authHeader = request.headers.get('authorization');

      // Check if token is valid
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return HttpResponse.json(
          { error: 'Unauthorized', message: 'Invalid or expired token' },
          { status: 401 }
        );
      }

      const token = authHeader.substring(7);

      // Check token validity
      if (token !== 'mock-jwt-token' && token !== 'mock-manager-jwt-token') {
        return HttpResponse.json(
          { error: 'Unauthorized', message: 'Invalid or expired token' },
          { status: 401 }
        );
      }

      const body = await request.json();
      const validatedBody = CreateAppointmentRequestSchema.parse(body);

      // Return new appointment request
      const newRequest = {
        ...mockAppointmentRequest,
        id: '123e4567-e89b-12d3-a456-426614174' + Math.floor(Math.random() * 1000),
        userId: token === 'mock-jwt-token' ? mockUser.id : mockManager.id,
        ...validatedBody,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return HttpResponse.json(newRequest, { status: 201 });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return HttpResponse.json(
          { error: 'Bad Request', message: 'Invalid input data' },
          { status: 400 }
        );
      }
      return HttpResponse.json(
        { error: 'Internal Server Error', message: 'An unexpected error occurred' },
        { status: 500 }
      );
    }
  }),

  // Update appointment request
  http.patch('/api/appointments/requests/:id', async ({ request, params }) => {
    try {
      const authHeader = request.headers.get('authorization');

      // Check if token is valid
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return HttpResponse.json(
          { error: 'Unauthorized', message: 'Invalid or expired token' },
          { status: 401 }
        );
      }

      const token = authHeader.substring(7);

      // Check token validity
      if (token !== 'mock-jwt-token' && token !== 'mock-manager-jwt-token') {
        return HttpResponse.json(
          { error: 'Unauthorized', message: 'Invalid or expired token' },
          { status: 401 }
        );
      }

      const requestId = params.id as string;
      const body = (await request.json()) as Record<string, any>;

      // Validate input
      if (!body.status || !['approved', 'rejected'].includes(body.status)) {
        return HttpResponse.json(
          { error: 'Bad Request', message: 'Invalid status' },
          { status: 400 }
        );
      }

      // Find the request
      const requestIndex = mockAppointmentRequests.findIndex(req => req.id === requestId);
      if (requestIndex === -1) {
        return HttpResponse.json(
          { error: 'Not Found', message: 'Appointment request not found' },
          { status: 404 }
        );
      }

      // Only managers can update status
      if (token !== 'mock-manager-jwt-token') {
        return HttpResponse.json(
          { error: 'Forbidden', message: 'Insufficient permissions' },
          { status: 403 }
        );
      }

      // Update and return the request
      const updatedRequest = {
        ...mockAppointmentRequests[requestIndex],
        status: body.status,
        managerNotes: body.managerNotes || null,
        updatedAt: new Date(),
      };

      return HttpResponse.json(updatedRequest, { status: 200 });
    } catch (error) {
      return HttpResponse.json(
        { error: 'Internal Server Error', message: 'An unexpected error occurred' },
        { status: 500 }
      );
    }
  }),
];

// Error handlers for various HTTP status codes
export const errorHandlers = [
  // 400 Bad Request
  http.get('/api/error/bad-request', () => {
    return HttpResponse.json(
      { error: 'Bad Request', message: 'Invalid input data' },
      { status: 400 }
    );
  }),

  // 401 Unauthorized
  http.get('/api/error/unauthorized', () => {
    return HttpResponse.json(
      { error: 'Unauthorized', message: 'Invalid credentials' },
      { status: 401 }
    );
  }),

  // 403 Forbidden
  http.get('/api/error/forbidden', () => {
    return HttpResponse.json(
      { error: 'Forbidden', message: 'Insufficient permissions' },
      { status: 403 }
    );
  }),

  // 404 Not Found
  http.get('/api/error/not-found', () => {
    return HttpResponse.json(
      { error: 'Not Found', message: 'Resource not found' },
      { status: 404 }
    );
  }),

  // 500 Internal Server Error
  http.get('/api/error/server-error', () => {
    return HttpResponse.json(
      { error: 'Internal Server Error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }),
];

// Combine all handlers
export const handlers = [
  ...authHandlers,
  ...userHandlers,
  ...servicesHandlers,
  ...appointmentHandlers,
  ...errorHandlers,
];
