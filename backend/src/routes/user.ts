import { Router } from 'express';

import { requireAuth } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { getProfile, updateProfile, UpdateProfileInput } from '../services/userService.js';

const userRouter = Router();

userRouter.get('/profile', requireAuth, async (req, res, next) => {
  try {
    const user = await getProfile(req.user!.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

userRouter.patch(
  '/profile',
  requireAuth,
  validateBody(UpdateProfileInput.omit({ userId: true })),
  async (req, res, next) => {
    try {
      const user = await updateProfile({ userId: req.user!.id, ...req.body });
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  }
);

export default userRouter;
