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
        await this.getById(id);

        return await prisma.producto.update({
            where: { id },
            data,
        });
    }

    async delete(id: string) {
        await this.getById(id);

        return await prisma.producto.delete({
            where: { id },
        });
    }
}

export default new ProductService();
