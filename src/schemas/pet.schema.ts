import { z } from 'zod';

export const createPetSchema = z.object({
    nombre: z.string().min(2),
    especie: z.string().min(2),
    raza: z.string().min(2),
    edad: z.number().int().min(0),
    dueñoNombre: z.string().min(2),
    dueñoContacto: z.string().min(5),
});

export const updatePetSchema = createPetSchema.partial().extend({
    version: z.number().int().optional(),
});

export type CreatePetInput = z.infer<typeof createPetSchema>;
export type UpdatePetInput = z.infer<typeof updatePetSchema>;
