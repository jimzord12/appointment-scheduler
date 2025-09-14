import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  let status = (err && typeof err.status === 'number' && err.status) || 500;
  const payload: any = { error: err?.message || 'Internal Server Error' };

  const isZod = err instanceof ZodError;
  const looksLikeZod = !isZod && Array.isArray(err?.issues) && err.issues.every((i: any) => i && typeof i === 'object' && 'code' in i && 'message' in i);

  if (isZod || looksLikeZod) {
    status = 400;
    payload.error = 'Validation failed';
    payload.issues = err.issues || (isZod ? (err as ZodError).issues : undefined);
  }

  if (process.env.NODE_ENV !== 'production' && err?.stack) {
    payload.stack = err.stack;
    if (looksLikeZod && !isZod) {
      payload.validationNote = 'Treated as ZodError via heuristic (issues[] detected)';
    }
  }
  res.status(status).json(payload);
}
