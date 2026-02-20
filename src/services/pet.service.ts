import prisma from '../config/database';
import { CreatePetInput, UpdatePetInput } from '../schemas/pet.schema';
import { AppError } from '../middlewares/error.middleware';

class PetService {
    async create(data: CreatePetInput, veterinarianId: string) {
        return await prisma.mascota.create({
            data: {
                ...data,
                veterinarioId: veterinarianId,
            },
        });
    }

    async getAll(veterinarianId: string) {
        return await prisma.mascota.findMany({
            where: { veterinarioId: veterinarianId },
        });
    }

    async getById(id: string, veterinarianId: string) {
        const pet = await prisma.mascota.findFirst({
            where: { id, veterinarioId: veterinarianId },
        });

        if (!pet) {
            const error: AppError = new Error('Pet not found');
            error.statusCode = 404;
            throw error;
        }

        return pet;
    }

    async update(id: string, data: UpdatePetInput, veterinarianId: string) {
        const { version, ...updateData } = data;

        if (version !== undefined) {
            const result = await prisma.mascota.updateMany({
                where: {
                    id,
                    version: version,
                    veterinarioId: veterinarianId,
                },
                data: {
                    ...updateData,
                    version: { increment: 1 },
                },
            });

            if (result.count === 0) {
                const error: AppError = new Error('Conflict: The pet record has been modified by another user.');
                error.statusCode = 409;
                throw error;
            }

            return await this.getById(id, veterinarianId);
        }

        // Fallback for updates without version
        await this.getById(id, veterinarianId);

        return await prisma.mascota.update({
            where: { id },
            data: {
                ...updateData,
                version: { increment: 1 },
            },
        });
    }

    async delete(id: string, veterinarianId: string) {
        // Ensure the pet belongs to the veterinarian
        await this.getById(id, veterinarianId);

        return await prisma.mascota.delete({
            where: { id },
        });
    }
}

export default new PetService();
