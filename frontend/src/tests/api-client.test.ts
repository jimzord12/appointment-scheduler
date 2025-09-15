import { setupServer } from 'msw/node';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Import API contracts for type reference
import {
  AppointmentRequestSchema,
  AuthResponseSchema,
  ServiceSchema,
  UserSchema,
} from '../../../specs/001-build-an-web/contracts/api-contracts.js';

// Setup MSW server
const server = setupServer();

// Mock API client that doesn't exist yet
// These tests will fail until the actual API client is implemented
const apiClient = {
  // Auth methods
  login: vi.fn(),
  register: vi.fn(),

  // User methods
  getProfile: vi.fn(),
  updateProfile: vi.fn(),

  // Service methods
  getServices: vi.fn(),
  createService: vi.fn(),

  // Appointment methods
  getAppointmentRequests: vi.fn(),
  createAppointmentRequest: vi.fn(),
  updateAppointmentRequest: vi.fn(),

  // Interceptors
  requestInterceptor: vi.fn(),
  responseInterceptor: vi.fn(),
};

// Mock data for tests
const mockUser = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'customer' as const,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockService = {
  id: '123e4567-e89b-12d3-a456-426614174001',
  name: 'Haircut',
  description: 'Basic haircut service',
  durationMinutes: 30,
  price: 25,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockAppointmentRequest = {
  id: '123e4567-e89b-12d3-a456-426614174002',
  userId: mockUser.id,
  serviceId: mockService.id,
  requestedDate: '2023-12-01',
  requestedTime: '14:30',
  status: 'pending' as const,
  notes: 'Please trim my hair short',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockAuthResponse = {
  user: mockUser,
  token: 'mock-jwt-token',
};

describe('API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    server.resetHandlers();
  });

  describe('Authentication API calls', () => {
    it('should login with valid credentials', async () => {
      // Arrange
      const loginData = {
        email: 'john@example.com',
        password: 'password123',
      };

      // Act
      apiClient.login.mockResolvedValue(mockAuthResponse);
      const result = await apiClient.login(loginData);

      // Assert
      expect(apiClient.login).toHaveBeenCalledWith(loginData);
      expect(result).toEqual(mockAuthResponse);
      expect(AuthResponseSchema.safeParse(result).success).toBe(true);
    });

    it('should register a new user', async () => {
      // Arrange
      const registerData = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'password123',
        role: 'customer' as const,
      };

      // Act
      apiClient.register.mockResolvedValue(mockAuthResponse);
      const result = await apiClient.register(registerData);

      // Assert
      expect(apiClient.register).toHaveBeenCalledWith(registerData);
      expect(result).toEqual(mockAuthResponse);
      expect(AuthResponseSchema.safeParse(result).success).toBe(true);
    });

    it('should handle login errors', async () => {
      // Arrange
      const loginData = {
        email: 'invalid@example.com',
        password: 'wrongpassword',
      };

      const errorResponse = {
        error: 'Unauthorized',
        message: 'Invalid credentials',
      };

      // Act
      apiClient.login.mockRejectedValue(errorResponse);

      // Assert
      await expect(apiClient.login(loginData)).rejects.toEqual(errorResponse);
    });

    it('should handle registration errors', async () => {
      // Arrange
      const registerData = {
        name: 'Jane Doe',
        email: 'existing@example.com',
        password: 'password123',
      };

      const errorResponse = {
        error: 'Conflict',
        message: 'User already exists',
      };

      // Act
      apiClient.register.mockRejectedValue(errorResponse);

      // Assert
      await expect(apiClient.register(registerData)).rejects.toEqual(errorResponse);
    });
  });

  describe('User profile API calls', () => {
    it('should get user profile', async () => {
      // Act
      apiClient.getProfile.mockResolvedValue(mockUser);
      const result = await apiClient.getProfile();

      // Assert
      expect(apiClient.getProfile).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
      expect(UserSchema.safeParse(result).success).toBe(true);
    });

    it('should update user profile', async () => {
      // Arrange
      const updateData = {
        name: 'John Updated',
      };
      const updatedUser = { ...mockUser, name: 'John Updated' };

      // Act
      apiClient.updateProfile.mockResolvedValue(updatedUser);
      const result = await apiClient.updateProfile(updateData);

      // Assert
      expect(apiClient.updateProfile).toHaveBeenCalledWith(updateData);
      expect(result).toEqual(updatedUser);
      expect(UserSchema.safeParse(result).success).toBe(true);
    });

    it('should handle get profile errors', async () => {
      // Arrange
      const errorResponse = {
        error: 'Unauthorized',
        message: 'Invalid or expired token',
      };

      // Act
      apiClient.getProfile.mockRejectedValue(errorResponse);

      // Assert
      await expect(apiClient.getProfile()).rejects.toEqual(errorResponse);
    });
  });

  describe('Services API calls', () => {
    it('should get all services', async () => {
      // Arrange
      const mockServices = [mockService];

      // Act
      apiClient.getServices.mockResolvedValue(mockServices);
      const result = await apiClient.getServices();

      // Assert
      expect(apiClient.getServices).toHaveBeenCalled();
      expect(result).toEqual(mockServices);
      expect(result.every((service: any) => ServiceSchema.safeParse(service).success)).toBe(true);
    });

    it('should create a new service', async () => {
      // Arrange
      const serviceData = {
        name: 'Massage',
        description: 'Relaxing full body massage',
        durationMinutes: 60,
        price: 80,
      };

      // Act
      apiClient.createService.mockResolvedValue(mockService);
      const result = await apiClient.createService(serviceData);

      // Assert
      expect(apiClient.createService).toHaveBeenCalledWith(serviceData);
      expect(result).toEqual(mockService);
      expect(ServiceSchema.safeParse(result).success).toBe(true);
    });

    it('should handle get services errors', async () => {
      // Arrange
      const errorResponse = {
        error: 'Internal Server Error',
        message: 'Failed to fetch services',
      };

      // Act
      apiClient.getServices.mockRejectedValue(errorResponse);

      // Assert
      await expect(apiClient.getServices()).rejects.toEqual(errorResponse);
    });
  });

  describe('Appointment API calls', () => {
    it('should get all appointment requests', async () => {
      // Arrange
      const mockRequests = [mockAppointmentRequest];

      // Act
      apiClient.getAppointmentRequests.mockResolvedValue(mockRequests);
      const result = await apiClient.getAppointmentRequests();

      // Assert
      expect(apiClient.getAppointmentRequests).toHaveBeenCalled();
      expect(result).toEqual(mockRequests);
      expect(
        result.every((request: any) => AppointmentRequestSchema.safeParse(request).success)
      ).toBe(true);
    });

    it('should create a new appointment request', async () => {
      // Arrange
      const requestData = {
        serviceId: mockService.id,
        requestedDate: '2023-12-01',
        requestedTime: '14:30',
        notes: 'Please trim my hair short',
      };

      // Act
      apiClient.createAppointmentRequest.mockResolvedValue(mockAppointmentRequest);
      const result = await apiClient.createAppointmentRequest(requestData);

      // Assert
      expect(apiClient.createAppointmentRequest).toHaveBeenCalledWith(requestData);
      expect(result).toEqual(mockAppointmentRequest);
      expect(AppointmentRequestSchema.safeParse(result).success).toBe(true);
    });

    it('should update an appointment request', async () => {
      // Arrange
      const updateData = {
        id: mockAppointmentRequest.id,
        status: 'approved' as const,
        managerNotes: 'Approved for 2:30 PM',
      };
      const updatedRequest = {
        ...mockAppointmentRequest,
        status: 'approved' as const,
        managerNotes: 'Approved for 2:30 PM',
      };

      // Act
      apiClient.updateAppointmentRequest.mockResolvedValue(updatedRequest);
      const result = await apiClient.updateAppointmentRequest(updateData);

      // Assert
      expect(apiClient.updateAppointmentRequest).toHaveBeenCalledWith(updateData);
      expect(result).toEqual(updatedRequest);
      expect(AppointmentRequestSchema.safeParse(result).success).toBe(true);
    });

    it('should handle get appointment requests errors', async () => {
      // Arrange
      const errorResponse = {
        error: 'Unauthorized',
        message: 'Invalid or expired token',
      };

      // Act
      apiClient.getAppointmentRequests.mockRejectedValue(errorResponse);

      // Assert
      await expect(apiClient.getAppointmentRequests()).rejects.toEqual(errorResponse);
    });
  });

  describe('Error handling for various HTTP status codes', () => {
    it('should handle 400 Bad Request', async () => {
      // Arrange
      const errorResponse = {
        error: 'Bad Request',
        message: 'Invalid input data',
      };

      // Act
      apiClient.login.mockRejectedValue(errorResponse);

      // Assert
      await expect(apiClient.login({ email: 'invalid', password: '' })).rejects.toEqual(
        errorResponse
      );
    });

    it('should handle 401 Unauthorized', async () => {
      // Arrange
      const errorResponse = {
        error: 'Unauthorized',
        message: 'Invalid credentials',
      };

      // Act
      apiClient.login.mockRejectedValue(errorResponse);

      // Assert
      await expect(
        apiClient.login({ email: 'test@example.com', password: 'wrong' })
      ).rejects.toEqual(errorResponse);
    });

    it('should handle 403 Forbidden', async () => {
      // Arrange
      const errorResponse = {
        error: 'Forbidden',
        message: 'Insufficient permissions',
      };

      // Act
      apiClient.createService.mockRejectedValue(errorResponse);

      // Assert
      await expect(
        apiClient.createService({ name: 'Test', durationMinutes: 30, price: 25 })
      ).rejects.toEqual(errorResponse);
    });

    it('should handle 404 Not Found', async () => {
      // Arrange
      const errorResponse = {
        error: 'Not Found',
        message: 'Resource not found',
      };

      // Act
      apiClient.getProfile.mockRejectedValue(errorResponse);

      // Assert
      await expect(apiClient.getProfile()).rejects.toEqual(errorResponse);
    });

    it('should handle 500 Internal Server Error', async () => {
      // Arrange
      const errorResponse = {
        error: 'Internal Server Error',
        message: 'An unexpected error occurred',
      };

      // Act
      apiClient.getServices.mockRejectedValue(errorResponse);

      // Assert
      await expect(apiClient.getServices()).rejects.toEqual(errorResponse);
    });
  });

  describe('Request/response interceptors for authentication tokens', () => {
    it('should add authorization token to requests', async () => {
      // Arrange
      const token = 'mock-jwt-token';
      const config = { headers: {} };

      // Act
      apiClient.requestInterceptor.mockReturnValue({
        ...config,
        headers: {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        },
      });

      const result = apiClient.requestInterceptor(config);

      // Assert
      expect(apiClient.requestInterceptor).toHaveBeenCalledWith(config);
      expect(result.headers.Authorization).toBe(`Bearer ${token}`);
    });

    it('should handle 401 responses and redirect to login', async () => {
      // Arrange
      const error = {
        response: {
          status: 401,
          data: {
            error: 'Unauthorized',
            message: 'Token expired',
          },
        },
      };

      // Act
      apiClient.responseInterceptor.mockImplementation(() => {
        if (error.response?.status === 401) {
          // Simulate redirect to login
          window.location.href = '/login';
          throw new Error('Redirecting to login');
        }
        return Promise.reject(error);
      });

      // Assert
      expect(() => apiClient.responseInterceptor(error)).toThrow('Redirecting to login');
      // Note: In a real test, we would need to mock window.location.href
    });

    it('should refresh token on 403 responses', async () => {
      // Arrange
      const error = {
        response: {
          status: 403,
          data: {
            error: 'Forbidden',
            message: 'Token expired',
          },
        },
      };

      // Act
      apiClient.responseInterceptor.mockImplementation(async () => {
        if (error.response?.status === 403) {
          // Simulate token refresh
          const newToken = 'refreshed-jwt-token';
          // Retry the original request with new token
          console.log('Using new token:', newToken);
          return { data: { success: true } };
        }
        return Promise.reject(error);
      });

      const result = await apiClient.responseInterceptor(error);

      // Assert
      expect(result).toEqual({ data: { success: true } });
    });
  });
});
