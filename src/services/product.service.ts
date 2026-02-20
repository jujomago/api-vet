import prisma from '../config/database';
import { CreateProductInput, UpdateProductInput } from '../schemas/product.schema';
import { AppError } from '../middlewares/error.middleware';

class ProductService {
    async create(data: CreateProductInput) {
        return await prisma.producto.create({
            data,
        });
    }

    async getAll() {
        return await prisma.producto.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }

    async getById(id: string) {
        const product = await prisma.producto.findUnique({
            where: { id },
        });

        if (!product) {
            const error: AppError = new Error('Product not found');
            error.statusCode = 404;
            throw error;
        }

        return product;
    }

    async update(id: string, data: UpdateProductInput) {
        const { version, ...updateData } = data;

        // If version is provided, we use it for optimistic locking
        if (version !== undefined) {
            const result = await prisma.producto.updateMany({
                where: {
                    id,
                    version: version,
                },
                data: {
                    ...updateData,
                    version: { increment: 1 },
                },
            });

            if (result.count === 0) {
                const error: AppError = new Error('Conflict: The product has been modified by another user.');
                error.statusCode = 409;
                throw error;
            }

            return await this.getById(id);
        }

        // Fallback for updates without version (less secure)
        return await prisma.producto.update({
            where: { id },
            data: {
                ...updateData,
                version: { increment: 1 },
            },
        });
    }

    async adjustStock(id: string, quantity: number) {
        // Atomic operation using Prisma's increment/decrement
        const product = await prisma.producto.update({
            where: { id },
            data: {
                stock: {
                    increment: quantity,
                },
                version: { increment: 1 },
            },
        });

        return product;
    }

    async delete(id: string) {
        await this.getById(id);

        return await prisma.producto.delete({
            where: { id },
        });
    }
}

export default new ProductService();
