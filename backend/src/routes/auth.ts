import { Router } from 'express';

import { validateBody } from '../middleware/validate.js';
import { CreateUserSchema, LoginSchema } from '../schemas/index.js';
import { login, register } from '../services/authService.js';

export const authRouter = Router();

authRouter.post('/register', validateBody(CreateUserSchema), async (req, res, next) => {
  try {
    const result = await register(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

authRouter.post('/login', validateBody(LoginSchema), async (req, res, next) => {
  try {
    const result = await login(req.body);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});
