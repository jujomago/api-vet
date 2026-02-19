import { Request, Response, NextFunction } from 'express';
import ProductService from '../services/product.service';
import { createProductSchema, updateProductSchema } from '../schemas/product.schema';

class ProductController {
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const data = createProductSchema.parse(req.body);
            const product = await ProductService.create(data);
            res.status(201).json({ status: 'success', data: { product } });
        } catch (error) {
            next(error);
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const products = await ProductService.getAll();
            res.json({ status: 'success', data: { products } });
        } catch (error) {
            next(error);
        }
    }

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const product = await ProductService.getById(req.params.id as string);
            res.json({ status: 'success', data: { product } });
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const data = updateProductSchema.parse(req.body);
            const product = await ProductService.update(req.params.id as string, data);
            res.json({ status: 'success', data: { product } });
        } catch (error) {
            next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            await ProductService.delete(req.params.id as string);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

export default new ProductController();
