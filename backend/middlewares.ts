import crypto from 'crypto';
import type { Request, Response, NextFunction } from 'express';

export const sessionMiddleware = (req: Request, res: Response, next: NextFunction) => {
  let sessionId = req.headers['x-session-id'] as string;

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    res.setHeader('x-session-id', sessionId);
    res.setHeader('Access-Control-Expose-Headers', 'x-session-id');
  }

  (req as any).sessionId = sessionId;

  next();
};