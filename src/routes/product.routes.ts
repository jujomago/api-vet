import { Router } from 'express';
import productController from '../controllers/product.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Protect all routes (inventory is usually for staff)
router.use(authMiddleware as any);

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of products
 *   post:
 *     summary: Create a new product
 *     tags: [Inventory]
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
 *               descripcion:
 *                 type: string
 *               precio:
 *                 type: number
 *               stock:
 *                 type: integer
 *               categoria:
 *                 type: string
 *     responses:
 *       201:
 *         description: Product created
 */
router.get('/', productController.getAll as any);
router.post('/', productController.create as any);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product details
 *   patch:
 *     summary: Update a product
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Product updated
 *   delete:
 *     summary: Delete a product
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Product deleted
 */
router.get('/:id', productController.getById as any);
router.patch('/:id', productController.update as any);

/**
 * @swagger
 * /products/{id}/stock:
 *   patch:
 *     summary: Adjust product stock (atomic)
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: number
 *                 description: Amount to add (positive) or subtract (negative)
 *     responses:
 *       200:
 *         description: Stock adjusted
 *       400:
 *         description: Invalid quantity
 */
router.patch('/:id/stock', productController.adjustStock as any);

router.delete('/:id', productController.delete as any);

export default router;
