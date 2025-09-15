import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-insecure-secret';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  const token = header.slice('Bearer '.length).trim();
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { sub?: string; role?: string };
    if (!decoded.sub || !decoded.role) {
      return res.status(401).json({ error: 'unauthorized' });
    }
    req.user = { id: decoded.sub, role: decoded.role as 'customer' | 'manager' };
    next();
  } catch {
    return res.status(401).json({ error: 'unauthorized' });
  }
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) {
    const token = header.slice('Bearer '.length).trim();
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { sub?: string; role?: string };
      if (decoded.sub && decoded.role) {
        req.user = { id: decoded.sub, role: decoded.role as 'customer' | 'manager' };
      }
    } catch {
      // ignore invalid token for optional auth
    }
  }
  next();
}

export function requireManager(req: Request, res: Response, next: NextFunction) {
  if (!req.user) return res.status(401).json({ error: 'unauthorized' });
  if (req.user.role !== 'manager') return res.status(403).json({ error: 'forbidden' });
  next();
}
