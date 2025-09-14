import { ZodError } from 'zod';
import { Request, Response, NextFunction } from 'express';

export function validateBody(schema: any) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      next(err); // Let errorHandler map ZodError to 400
    }
  };
}
