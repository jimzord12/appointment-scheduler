import { NextFunction, Request, Response } from 'express';

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export interface LoggingConfig {
  level: LogLevel;
  logRequestBody: boolean;
  logResponseBody: boolean;
  excludePaths: string[];
}

const defaultConfig: LoggingConfig = {
  level: LogLevel.INFO,
  logRequestBody: false,
  logResponseBody: false,
  excludePaths: ['/health'],
};

export class Logger {
  private config: LoggingConfig;

  constructor(config: Partial<LoggingConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
    return levels.indexOf(level) >= levels.indexOf(this.config.level);
  }

  private formatLog(level: LogLevel, message: string, meta: Record<string, any> = {}): string {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...meta,
    };
    return JSON.stringify(logEntry);
  }

  private log(level: LogLevel, message: string, meta: Record<string, any> = {}): void {
    if (!this.shouldLog(level)) return;

    const formattedLog = this.formatLog(level, message, meta);

    switch (level) {
      case LogLevel.DEBUG:
        console.debug(formattedLog);
        break;
      case LogLevel.INFO:
        console.info(formattedLog);
        break;
      case LogLevel.WARN:
        console.warn(formattedLog);
        break;
      case LogLevel.ERROR:
        console.error(formattedLog);
        break;
    }
  }

  debug(message: string, meta: Record<string, any> = {}): void {
    this.log(LogLevel.DEBUG, message, meta);
  }

  info(message: string, meta: Record<string, any> = {}): void {
    this.log(LogLevel.INFO, message, meta);
  }

  warn(message: string, meta: Record<string, any> = {}): void {
    this.log(LogLevel.WARN, message, meta);
  }

  error(message: string, meta: Record<string, any> = {}): void {
    this.log(LogLevel.ERROR, message, meta);
  }
}

export const createLogger = (config?: Partial<LoggingConfig>) => new Logger(config);

export const loggingMiddleware = (config?: Partial<LoggingConfig>) => {
  const logger = createLogger(config);
  const mergedConfig = { ...defaultConfig, ...config };

  return (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    const { method, originalUrl, headers, ip } = req;

    // Determine or generate a request id for correlation
    const headerRequestId = (headers['x-request-id'] || headers['X-Request-Id']) as
      | string
      | undefined;
    const requestId =
      headerRequestId && typeof headerRequestId === 'string' && headerRequestId.length > 0
        ? headerRequestId
        : `req_${Math.random().toString(36).slice(2, 10)}`;
    // Attach requestId to response for downstream usage (e.g., error handler)
    (res as any).locals = { ...(res as any).locals, requestId };

    // Check if path should be excluded from logging
    if (mergedConfig.excludePaths.includes(originalUrl)) {
      return next();
    }

    // Log request
    const requestLog: Record<string, any> = {
      method,
      url: originalUrl,
      ip,
      userAgent: headers['user-agent'],
      requestId,
      userId: req.user?.id,
    };

    if (mergedConfig.logRequestBody && req.body) {
      requestLog.body = req.body;
    }

    logger.info('Incoming request', requestLog);

    // Override res.json to log response
    const originalJson = res.json;
    res.json = function (body: any) {
      const responseTime = Date.now() - startTime;
      const { statusCode } = res;

      const responseLog: Record<string, any> = {
        method,
        url: originalUrl,
        statusCode,
        responseTime,
        requestId,
        userId: req.user?.id,
      };

      if (mergedConfig.logResponseBody) {
        responseLog.body = body;
      }

      // Log based on status code
      if (statusCode >= 500) {
        logger.error('Request failed', responseLog);
      } else if (statusCode >= 400) {
        logger.warn('Request warning', responseLog);
      } else {
        logger.info('Request completed', responseLog);
      }

      return originalJson.call(this, body);
    };

    // Handle errors
    res.on('error', err => {
      const responseTime = Date.now() - startTime;
      logger.error('Response error', {
        method,
        url: originalUrl,
        error: err.message,
        responseTime,
      });
    });

    next();
  };
};
