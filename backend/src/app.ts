import cors from 'cors';
import * as dotenv from 'dotenv';
import express from 'express';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
import helmet from 'helmet';

// Load environment variables once here (idempotent if called multiple times in tests)
dotenv.config();

export const createApp = () => {
  const app = express();
  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  app.get('/health', (req: express.Request, res: express.Response) => {
    res.status(200).json({ status: 'ok' });
  });

  return app;
};

// Export a singleton app instance for simple imports, while allowing test factories if needed
const app = createApp();
export default app;
