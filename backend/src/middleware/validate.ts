import { NextFunction, Request, Response } from 'express';
import { infer as ZodInfer, ZodTypeAny } from 'zod';

export function validateBody<T extends ZodTypeAny>(schema: T) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      // Type cast helps routes infer req.body as z.infer<T> when needed
      req.body = schema.parse(req.body) as ZodInfer<T>;
      next();
    } catch (err) {
      next(err); // Let errorHandler map ZodError to 400
    }
  };
}
