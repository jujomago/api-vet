import prisma from '../config/database';
import { CreateAppointmentInput, UpdateAppointmentInput } from '../schemas/appointment.schema';
import { AppError } from '../middlewares/error.middleware';

class AppointmentService {
    async create(data: CreateAppointmentInput, veterinarianId: string) {
        // Verify pet belongs to this veterinarian
        const pet = await prisma.mascota.findFirst({
            where: { id: data.mascotaId, veterinarioId: veterinarianId },
        });

        if (!pet) {
            const error: AppError = new Error('Pet not found or does not belong to you');
            error.statusCode = 404;
            throw error;
        }

        return await prisma.cita.create({
            data: {
                ...data,
                veterinarioId: veterinarianId,
                fecha: new Date(data.fecha),
            },
        });
    }

    async getAll(veterinarianId: string) {
        return await prisma.cita.findMany({
            where: { veterinarioId: veterinarianId },
            include: {
                mascota: true,
            },
        });
    }

    async getById(id: string, veterinarianId: string) {
        const appointment = await prisma.cita.findFirst({
            where: { id, veterinarioId: veterinarianId },
            include: {
                mascota: true,
            },
        });

        if (!appointment) {
            const error: AppError = new Error('Appointment not found');
            error.statusCode = 404;
            throw error;
        }

        return appointment;
    }

    async update(id: string, data: UpdateAppointmentInput, veterinarianId: string) {
        const { version, ...updateData } = data;

        if (version !== undefined) {
            const result = await prisma.cita.updateMany({
                where: {
                    id,
                    version: version,
                    veterinarioId: veterinarianId,
                },
                data: {
                    ...updateData,
                    fecha: updateData.fecha ? new Date(updateData.fecha) : undefined,
                    version: { increment: 1 },
                },
            });

            if (result.count === 0) {
                const error: AppError = new Error('Conflict: This appointment has been modified by another user.');
                error.statusCode = 409;
                throw error;
            }

            return await this.getById(id, veterinarianId);
        }

        // Fallback for updates without version
        await this.getById(id, veterinarianId);

        return await prisma.cita.update({
            where: { id },
            data: {
                ...updateData,
                fecha: updateData.fecha ? new Date(updateData.fecha) : undefined,
                version: { increment: 1 },
            },
        });
    }

    async delete(id: string, veterinarianId: string) {
        await this.getById(id, veterinarianId);

        return await prisma.cita.delete({
            where: { id },
        });
    }
}

export default new AppointmentService();
