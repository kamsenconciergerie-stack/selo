import { Request, Response, NextFunction } from 'express';
import { storage } from './storage';

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Token manquant' });
    }

    const user = await storage.getUserBySessionToken(token);
    
    if (!user) {
      return res.status(401).json({ error: 'Session invalide' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Erreur d\'authentification' });
  }
};

export const generateSessionToken = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};