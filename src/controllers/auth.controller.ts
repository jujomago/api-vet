import { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.service';
import { registerSchema, loginSchema } from '../schemas/auth.schema';

class AuthController {
    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const validatedData = registerSchema.parse(req.body);
            const user = await authService.register(validatedData);
            res.status(201).json({
                status: 'success',
                data: { user },
            });
        } catch (error) {
            next(error);
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const validatedData = loginSchema.parse(req.body);
            const { user, token } = await authService.login(validatedData);
            res.status(200).json({
                status: 'success',
                data: { user, token },
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new AuthController();
