import cors from 'cors';
import * as dotenv from 'dotenv';
import express, { Application } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

import { errorHandler } from './middleware/errorHandler.js';
import { loggingMiddleware, LogLevel } from './middleware/logging.js';
import apiRouter from './routes/index.ts';

// Load environment variables once here (idempotent if called multiple times in tests)
dotenv.config();

export const createApp = (): Application => {
  const app = express();
  // Environment validation
  const isProd = process.env.NODE_ENV === 'production';
  const jwtSecret = process.env.JWT_SECRET;
  if (
    isProd &&
    (!jwtSecret || jwtSecret === 'dev-insecure-secret' || jwtSecret === 'change_me_dev_secret')
  ) {
    throw new Error('JWT_SECRET must be set to a strong secret in production');
  }
  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  // Rate limiting (disabled in test via VITEST env unless overridden)
  const rateLimitEnabledEnv = process.env.RATE_LIMIT_ENABLED;
  const isRateLimitEnabled = rateLimitEnabledEnv
    ? rateLimitEnabledEnv === '1' || rateLimitEnabledEnv.toLowerCase() === 'true'
    : !process.env.VITEST;
  if (isRateLimitEnabled) {
    const windowMs = process.env.RATE_LIMIT_WINDOW_MS
      ? parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10)
      : parseInt(process.env.RATE_LIMIT_WINDOW_MINUTES || '15', 10) * 60 * 1000;
    const max = parseInt(process.env.RATE_LIMIT_MAX || '100', 10);
    app.use(
      rateLimit({
        windowMs,
        max,
        standardHeaders: true,
        legacyHeaders: false,
        handler: (req, res /*, next*/) => {
          // Uniform JSON error shape per spec
          res.status(429).json({ error: 'rate_limit' });
        },
      })
    );
  }

  // Logging middleware
  app.use(
    loggingMiddleware({
      level: LogLevel.INFO, // Can be configured via environment variable in production
      logRequestBody: false, // Set to true for debugging in development
      logResponseBody: false, // Set to true for debugging in development
      excludePaths: ['/health'], // Don't log health checks
    })
  );

  // Health endpoint (no auth)
  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  // Routers
  app.use('/', apiRouter);

  // Error handler
  app.use(errorHandler);

  return app;
};

// Export a singleton app instance for simple imports, while allowing test factories if needed
const app = createApp();
export default app;
