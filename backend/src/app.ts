import cors from 'cors';
import * as dotenv from 'dotenv';
import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';

// Load environment variables once here (idempotent if called multiple times in tests)
dotenv.config();

export const createApp = (): Application => {
  const app = express();
  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  // Health endpoint (no auth)
  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok' });
  });

  // TODO (T028/T029): mount routers here, e.g.:
  // app.use('/auth', authRouter);
  // app.use('/user', userRouter);
  // app.use('/services', servicesRouter);
  // app.use('/appointments', appointmentsRouter);

  // TODO (T030): global error handler
  // app.use(errorHandler);

  return app;
};

// Export a singleton app instance for simple imports, while allowing test factories if needed
const app = createApp();
export default app;
