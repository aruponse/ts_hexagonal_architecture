import { Request, Response, NextFunction } from 'express';
import { ServiceFactory } from '../../../factories/service.factory';
import { AuthTokenPayload } from '../../../domain/types/auth.type';

export interface AuthenticatedRequest extends Request {
  user?: AuthTokenPayload;
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const tokenService = ServiceFactory.getTokenService();
    
    const decoded = tokenService.verify(token) as AuthTokenPayload;
    req.user = decoded;
    
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
