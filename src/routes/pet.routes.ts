import { Router } from 'express';
import petController from '../controllers/pet.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Protect all routes
router.use(authMiddleware as any);

/**
 * @swagger
 * /pets:
 *   get:
 *     summary: Get all pets for the authenticated veterinarian
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of pets
 *   post:
 *     summary: Create a new pet
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               especie:
 *                 type: string
 *               raza:
 *                 type: string
 *               edad:
 *                 type: integer
 *               dueñoNombre:
 *                 type: string
 *               dueñoContacto:
 *                 type: string
 *     responses:
 *       201:
 *         description: Pet created
 */
router.get('/', petController.getAll as any);
router.post('/', petController.create as any);

/**
 * @swagger
 * /pets/{id}:
 *   get:
 *     summary: Get a pet by ID
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pet details
 *   patch:
 *     summary: Update a pet
 *     tags: [Pets]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Pet updated
 *   delete:
 *     summary: Delete a pet
 *     tags: [Pets]
 *     responses:
 *       204:
 *         description: Pet deleted
 */
router.get('/:id', petController.getById as any);
router.patch('/:id', petController.update as any);
router.delete('/:id', petController.delete as any);

export default router;
