import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/errors';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    let token = req.cookies?.token;
    
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      throw new AppError('Unauthorized - No token provided', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
    
    (req as any).user = { id: decoded.userId };
    
    next();
  } catch (error) {
    next(new AppError('Unauthorized', 401));
  }
};
