import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import appointmentService from '../services/appointment.service';
import { createAppointmentSchema, updateAppointmentSchema } from '../schemas/appointment.schema';

class AppointmentController {
    async create(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const validatedData = createAppointmentSchema.parse(req.body);
            const veterinarianId = req.user!.id;
            const appointment = await appointmentService.create(validatedData, veterinarianId);
            res.status(201).json({
                status: 'success',
                data: { appointment },
            });
        } catch (error) {
            next(error);
        }
    }

    async getAll(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const veterinarianId = req.user!.id;
            const appointments = await appointmentService.getAll(veterinarianId);
            res.status(200).json({
                status: 'success',
                results: appointments.length,
                data: { appointments },
            });
        } catch (error) {
            next(error);
        }
    }

    async getById(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { id } = req.params as any;
            const veterinarianId = req.user!.id;
            const appointment = await appointmentService.getById(id, veterinarianId);
            res.status(200).json({
                status: 'success',
                data: { appointment },
            });
        } catch (error) {
            next(error);
        }
    }

    async update(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { id } = req.params as any;
            const validatedData = updateAppointmentSchema.parse(req.body);
            const veterinarianId = req.user!.id;
            const appointment = await appointmentService.update(id, validatedData, veterinarianId);
            res.status(200).json({
                status: 'success',
                data: { appointment },
            });
        } catch (error) {
            next(error);
        }
    }

    async delete(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { id } = req.params as any;
            const veterinarianId = req.user!.id;
            await appointmentService.delete(id, veterinarianId);
            res.status(204).json({
                status: 'success',
                data: null,
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new AppointmentController();
