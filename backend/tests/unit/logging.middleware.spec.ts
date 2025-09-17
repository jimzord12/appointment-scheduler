import { NextFunction, Request, Response } from 'express';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { LogLevel, Logger, createLogger, loggingMiddleware } from '../../src/middleware/logging.js';

describe('Logging Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let originalJson: Response['json'];
  let mockConsoleDebug: any;
  let mockConsoleInfo: any;
  let mockConsoleWarn: any;
  let mockConsoleError: any;

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Mock console methods
    mockConsoleDebug = vi.spyOn(console, 'debug').mockImplementation(vi.fn());
    mockConsoleInfo = vi.spyOn(console, 'info').mockImplementation(vi.fn());
    mockConsoleWarn = vi.spyOn(console, 'warn').mockImplementation(vi.fn());
    mockConsoleError = vi.spyOn(console, 'error').mockImplementation(vi.fn());

    // Setup mock request
    mockRequest = {
      method: 'GET',
      originalUrl: '/test',
      headers: {
        'user-agent': 'test-agent',
      },
      ip: '127.0.0.1',
      body: {},
    };

    // Setup mock response
    originalJson = vi.fn().mockReturnThis();
    mockResponse = {
      statusCode: 200,
      json: originalJson,
      on: vi.fn(),
    };

    // Setup mock next function
    mockNext = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Logger class', () => {
    it('should create a logger with default configuration', () => {
      const logger = createLogger();
      expect(logger).toBeInstanceOf(Logger);
    });

    it('should create a logger with custom configuration', () => {
      const config = { level: LogLevel.DEBUG, logRequestBody: true };
      const logger = createLogger(config);
      expect(logger).toBeInstanceOf(Logger);
    });

    it('should respect log levels', () => {
      const logger = createLogger({ level: LogLevel.WARN });

      logger.debug('Debug message');
      logger.info('Info message');
      logger.warn('Warn message');
      logger.error('Error message');

      expect(mockConsoleDebug).not.toHaveBeenCalled();
      expect(mockConsoleInfo).not.toHaveBeenCalled();
      expect(mockConsoleWarn).toHaveBeenCalled();
      expect(mockConsoleError).toHaveBeenCalled();
    });

    it('should format logs as JSON', () => {
      const logger = createLogger({ level: LogLevel.DEBUG });

      logger.debug('Test message', { key: 'value' });

      expect(mockConsoleDebug).toHaveBeenCalled();
      const logOutput = mockConsoleDebug.mock.calls[0][0];
      const parsedLog = JSON.parse(logOutput);

      expect(parsedLog.level).toBe(LogLevel.DEBUG);
      expect(parsedLog.message).toBe('Test message');
      expect(parsedLog.key).toBe('value');
      expect(parsedLog.timestamp).toBeDefined();
    });
  });

  describe('loggingMiddleware', () => {
    it('should log incoming requests', () => {
      const middleware = loggingMiddleware();

      // Provide a stable request id header and a user id
      (mockRequest.headers as any)['x-request-id'] = 'req-123';
      (mockRequest as any).user = { id: 'user-abc', role: 'customer' };

      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockConsoleInfo).toHaveBeenCalled();

      const logOutput = mockConsoleInfo.mock.calls[0][0];
      const parsedLog = JSON.parse(logOutput);

      expect(parsedLog.message).toBe('Incoming request');
      expect(parsedLog.method).toBe('GET');
      expect(parsedLog.url).toBe('/test');
      expect(parsedLog.requestId).toBe('req-123');
      expect(parsedLog.userId).toBe('user-abc');
    });

    it('should log request body when configured', () => {
      mockRequest.body = { test: 'data' };
      const middleware = loggingMiddleware({ logRequestBody: true });

      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockConsoleInfo).toHaveBeenCalled();

      const logOutput = mockConsoleInfo.mock.calls[0][0];
      const parsedLog = JSON.parse(logOutput);

      expect(parsedLog.body).toEqual({ test: 'data' });
    });

    it('should exclude paths from logging when configured', () => {
      mockRequest.originalUrl = '/health';
      const middleware = loggingMiddleware({ excludePaths: ['/health'] });

      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockConsoleInfo).not.toHaveBeenCalled();
    });

    it('should log successful responses', () => {
      const middleware = loggingMiddleware();

      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      // Simulate response
      if (mockResponse.json) {
        mockResponse.json({ success: true });
      }

      expect(mockConsoleInfo).toHaveBeenCalledTimes(2); // Request + Response

      const responseLogOutput = mockConsoleInfo.mock.calls[1][0];
      const parsedResponseLog = JSON.parse(responseLogOutput);

      expect(parsedResponseLog.message).toBe('Request completed');
      expect(parsedResponseLog.statusCode).toBe(200);
      expect(parsedResponseLog.responseTime).toBeDefined();
      // Response log should also carry correlation fields
      expect(parsedResponseLog.requestId).toBeDefined();
    });

    it('should log warning responses for 4xx status codes', () => {
      mockResponse.statusCode = 400;
      const middleware = loggingMiddleware();

      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      // Simulate response
      if (mockResponse.json) {
        mockResponse.json({ error: 'Bad request' });
      }

      expect(mockConsoleWarn).toHaveBeenCalled();

      const warningLogOutput = mockConsoleWarn.mock.calls[0][0];
      const parsedWarningLog = JSON.parse(warningLogOutput);

      expect(parsedWarningLog.message).toBe('Request warning');
      expect(parsedWarningLog.statusCode).toBe(400);
    });

    it('should log error responses for 5xx status codes', () => {
      mockResponse.statusCode = 500;
      const middleware = loggingMiddleware();

      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      // Simulate response
      if (mockResponse.json) {
        mockResponse.json({ error: 'Internal server error' });
      }

      expect(mockConsoleError).toHaveBeenCalled();

      const errorLogOutput = mockConsoleError.mock.calls[0][0];
      const parsedErrorLog = JSON.parse(errorLogOutput);

      expect(parsedErrorLog.message).toBe('Request failed');
      expect(parsedErrorLog.statusCode).toBe(500);
    });

    it('should log response body when configured', () => {
      const responseBody = { data: 'test' };
      const middleware = loggingMiddleware({ logResponseBody: true });

      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      // Simulate response
      if (mockResponse.json) {
        mockResponse.json(responseBody);
      }

      expect(mockConsoleInfo).toHaveBeenCalledTimes(2);

      const responseLogOutput = mockConsoleInfo.mock.calls[1][0];
      const parsedResponseLog = JSON.parse(responseLogOutput);

      expect(parsedResponseLog.body).toEqual(responseBody);
    });

    it('should handle response errors', () => {
      const middleware = loggingMiddleware();
      const mockError = new Error('Response error');

      // Mock the 'on' method to simulate an error event
      const mockOn = vi.fn().mockImplementation((event, callback) => {
        if (event === 'error') {
          callback(mockError);
        }
      });
      mockResponse.on = mockOn;

      middleware(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockOn).toHaveBeenCalledWith('error', expect.any(Function));
      expect(mockConsoleError).toHaveBeenCalled();

      const errorLogOutput = mockConsoleError.mock.calls[0][0];
      const parsedErrorLog = JSON.parse(errorLogOutput);

      expect(parsedErrorLog.message).toBe('Response error');
      expect(parsedErrorLog.error).toBe('Response error');
    });
  });
});
