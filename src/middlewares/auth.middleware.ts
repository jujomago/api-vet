import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './error.middleware';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
    };
}

export const authMiddleware = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;
    console.log('[AuthMiddleware] Header Received:', authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        const error: AppError = new Error('No token provided');
        error.statusCode = 401;
        return next(error);
    }

    const token = authHeader.split(' ')[1];

    try {
        const secret = process.env.JWT_SECRET || 'secret';
        const decoded = jwt.verify(token, secret) as {
            id: string;
            email: string;
        };
        req.user = decoded;
        next();
    } catch (err) {
        console.error('[AuthMiddleware] JWT Verification Failed:', err instanceof Error ? err.message : err);
        const error: AppError = new Error('Invalid or expired token');
        error.statusCode = 401;
        return next(error);
    }
};
