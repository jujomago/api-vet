import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';
import { RegisterInput, LoginInput } from '../schemas/auth.schema';
import { AppError } from '../middlewares/error.middleware';

class AuthService {
    async register(data: RegisterInput) {
        const existingUser = await prisma.veterinario.findUnique({
            where: { email: data.email },
        });

        if (existingUser) {
            const error: AppError = new Error('Email already registered');
            error.statusCode = 400;
            throw error;
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = await prisma.veterinario.create({
            data: {
                ...data,
                password: hashedPassword,
            },
        });

        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async login(data: LoginInput) {
        const user = await prisma.veterinario.findUnique({
            where: { email: data.email },
        });

        if (!user) {
            const error: AppError = new Error('Invalid credentials');
            error.statusCode = 401;
            throw error;
        }

        const isPasswordValid = await bcrypt.compare(data.password, user.password);

        if (!isPasswordValid) {
            const error: AppError = new Error('Invalid credentials');
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: (process.env.JWT_EXPIRES_IN || '1d') as any }
        );

        const { password, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, token };
    }
}

export default new AuthService();
