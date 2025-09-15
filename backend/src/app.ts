import cors from 'cors';
import * as dotenv from 'dotenv';
import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';

import { errorHandler } from './middleware/errorHandler.js';
import { loggingMiddleware, LogLevel } from './middleware/logging.js';
import { appointmentsRouter } from './routes/appointments.js';
import { authRouter } from './routes/auth.js';
import { servicesRouter } from './routes/services.js';
import { userRouter } from './routes/user.js';

// Load environment variables once here (idempotent if called multiple times in tests)
dotenv.config();

export const createApp = (): Application => {
  const app = express();
  app.use(helmet());
  app.use(cors());
  app.use(express.json());

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
  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok' });
  });

  // Routers
  app.use('/auth', authRouter);
  app.use('/user', userRouter);
  app.use('/services', servicesRouter);
  app.use('/appointments', appointmentsRouter);

  // Error handler
  app.use(errorHandler);

  return app;
};

// Export a singleton app instance for simple imports, while allowing test factories if needed
const app = createApp();
export default app;
