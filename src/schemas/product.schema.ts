import { z } from 'zod';

export const createProductSchema = z.object({
    nombre: z.string().min(1, 'El nombre es requerido'),
    descripcion: z.string().optional(),
    precio: z.number().positive('El precio debe ser mayor a 0'),
    stock: z.number().int().nonnegative('El stock no puede ser negativo').default(0),
    categoria: z.string().default('farmacia'),
});

export const updateProductSchema = createProductSchema.partial().extend({
    version: z.number().int().optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
