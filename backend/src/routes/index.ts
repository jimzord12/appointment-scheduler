import { Router } from 'express';

import analyticsRouter from './analytics.ts';
import appointmentsRouter from './appointments.ts';
import authRouter from './auth.ts';
import servicesRouter from './services.ts';
import userRouter from './user.ts';

export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/user', userRouter);
apiRouter.use('/services', servicesRouter);
apiRouter.use('/appointments', appointmentsRouter);
apiRouter.use('/analytics', analyticsRouter);

export default apiRouter;
