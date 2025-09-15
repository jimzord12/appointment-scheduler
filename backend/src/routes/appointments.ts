import { Router } from 'express';
import { z } from 'zod';

import { requireAuth } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import {
  CreateAppointmentRequestSchema,
  UpdateAppointmentRequestSchema,
} from '../schemas/index.js';
import { createRequest, listRequests, updateRequest } from '../services/appointmentService.js';

export const appointmentsRouter = Router();

appointmentsRouter.get('/requests', requireAuth, async (req, res, next) => {
  try {
    const data = await listRequests(req.user!.id);
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
});

appointmentsRouter.post(
  '/requests',
  requireAuth,
  validateBody(CreateAppointmentRequestSchema),
  async (req, res, next) => {
    try {
      const data = await createRequest(req.user!.id, req.body);
      res.status(201).json(data);
    } catch (err) {
      next(err);
    }
  }
);

appointmentsRouter.patch(
  '/requests/:id',
  requireAuth,
  validateBody(
    z.object({
      status: UpdateAppointmentRequestSchema.shape.status,
      managerNotes: z.string().optional(),
    })
  ),
  async (req, res, next) => {
    try {
      const data = await updateRequest(req.user!.id, { id: req.params.id, ...req.body });
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }
);
