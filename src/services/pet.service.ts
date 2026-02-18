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
        // Ensure the pet belongs to the veterinarian
        await this.getById(id, veterinarianId);

        return await prisma.mascota.update({
            where: { id },
            data,
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
