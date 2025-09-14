import { Router } from 'express';
import { optionalAuth, requireAuth, requireManager } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { CreateServiceSchema } from '../schemas/index.js';
import { createService, listServices } from '../services/serviceService.js';

export const servicesRouter = Router();

servicesRouter.get('/', optionalAuth, async (_req, res, next) => {
  try {
    const services = await listServices();
    res.status(200).json(services);
  } catch (err) {
    next(err);
  }
});

servicesRouter.post(
  '/',
  requireAuth,
  requireManager,
  validateBody(CreateServiceSchema),
  async (req, res, next) => {
    try {
      const result = await createService(req.user!.id, req.body);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }
);

