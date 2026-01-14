import crypto from 'crypto';
import type { Request, Response, NextFunction } from 'express';

const sessions: Record<string, any> = {};

export const sessionMiddleware = (req: Request, res: Response, next: NextFunction) => {
  let sessionId = req.headers['x-session-id'] as string;

  if (!sessionId || !sessions[sessionId]) {
    sessionId = crypto.randomUUID();
    sessions[sessionId] = { createdAt: new Date(), progress: 0 };
    res.setHeader('x-session-id', sessionId);
    res.setHeader('Access-Control-Expose-Headers', 'x-session-id');
  }

  (req as any).session = sessions[sessionId];
  (req as any).sessionId = sessionId;

  next();
};