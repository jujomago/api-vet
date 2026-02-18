import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import petService from '../services/pet.service';
import { createPetSchema, updatePetSchema } from '../schemas/pet.schema';

class PetController {
    async create(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const validatedData = createPetSchema.parse(req.body);
            const veterinarianId = req.user!.id;
            const pet = await petService.create(validatedData, veterinarianId);
            res.status(201).json({
                status: 'success',
                data: { pet },
            });
        } catch (error) {
            next(error);
        }
    }

    async getAll(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const veterinarianId = req.user!.id;
            const pets = await petService.getAll(veterinarianId);
            res.status(200).json({
                status: 'success',
                results: pets.length,
                data: { pets },
            });
        } catch (error) {
            next(error);
        }
    }

    async getById(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { id } = req.params as any;
            const veterinarianId = req.user!.id;
            const pet = await petService.getById(id, veterinarianId);
            res.status(200).json({
                status: 'success',
                data: { pet },
            });
        } catch (error) {
            next(error);
        }
    }

    async update(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { id } = req.params as any;
            const validatedData = updatePetSchema.parse(req.body);
            const veterinarianId = req.user!.id;
            const pet = await petService.update(id, validatedData, veterinarianId);
            res.status(200).json({
                status: 'success',
                data: { pet },
            });
        } catch (error) {
            next(error);
        }
    }

    async delete(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { id } = req.params as any;
            const veterinarianId = req.user!.id;
            await petService.delete(id, veterinarianId);
            res.status(204).json({
                status: 'success',
                data: null,
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new PetController();
