import { z } from 'zod';

export const createAppointmentSchema = z.object({
    fecha: z.string().datetime(),
    motivo: z.string().min(5),
    descripcion: z.string().optional(),
    mascotaId: z.string().uuid(),
});

export const updateAppointmentSchema = z.object({
    fecha: z.string().datetime().optional(),
    motivo: z.string().min(5).optional(),
    descripcion: z.string().optional(),
    estado: z.enum(['pendiente', 'completada', 'cancelada']).optional(),
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentInput = z.infer<typeof updateAppointmentSchema>;
