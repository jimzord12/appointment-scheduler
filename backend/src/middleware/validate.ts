import { NextFunction, Request, Response } from 'express';

// Structural schema type avoids Zod instance/version coupling and still gives typed parse result
type SchemaLike<T> = { parse: (input: unknown) => T };

export function validateBody<T>(schema: SchemaLike<T>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body) as T;
      next();
    } catch (err) {
      next(err); // Let errorHandler map ZodError to 400
    }
  };
}
