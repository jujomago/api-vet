import { Router } from 'express';
import appointmentController from '../controllers/appointment.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Protect all routes
router.use(authMiddleware as any);

/**
 * @swagger
 * /appointments:
 *   get:
 *     summary: Get all appointments
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of appointments
 */
router.get('/', appointmentController.getAll as any);

/**
 * @swagger
 * /appointments:
 *   post:
 *     summary: Create a new appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fecha
 *               - motivo
 *               - mascotaId
 *             properties:
 *               fecha:
 *                 type: string
 *                 format: date-time
 *               motivo:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               mascotaId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Appointment created
 */
router.post('/', appointmentController.create as any);

/**
 * @swagger
 * /appointments/{id}:
 *   get:
 *     summary: Get an appointment by ID
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Appointment details
 */
router.get('/:id', appointmentController.getById as any);

/**
 * @swagger
 * /appointments/{id}:
 *   patch:
 *     summary: Update an appointment
 *     tags: [Appointments]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Appointment updated
 */
router.patch('/:id', appointmentController.update as any);

/**
 * @swagger
 * /appointments/{id}:
 *   delete:
 *     summary: Delete an appointment
 *     tags: [Appointments]
 *     responses:
 *       204:
 *         description: Appointment deleted
 */
router.delete('/:id', appointmentController.delete as any);

export default router;
