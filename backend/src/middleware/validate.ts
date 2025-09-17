import { NextFunction, Request, Response } from 'express';

// Use a structural type to avoid coupling to a specific Zod instance across packages
type SchemaLike<T> = { parse: (input: unknown) => T };

export function validateBody<T>(schema: SchemaLike<T>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      // Parse body and assign the validated, typed value
      req.body = schema.parse(req.body) as T;
      next();
    } catch (err) {
      next(err); // Let errorHandler map ZodError to 400
    }
  };
}
