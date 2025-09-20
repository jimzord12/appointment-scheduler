import { Router } from 'express';

import analyticsRouter from './analytics.js';
import appointmentsRouter from './appointments.js';
import authRouter from './auth.js';
import docsRouter from './docs.js';
import servicesRouter from './services.js';
import userRouter from './user.js';

export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/user', userRouter);
apiRouter.use('/services', servicesRouter);
apiRouter.use('/appointments', appointmentsRouter);
apiRouter.use('/analytics', analyticsRouter);
apiRouter.use('/docs', docsRouter);

export default apiRouter;
