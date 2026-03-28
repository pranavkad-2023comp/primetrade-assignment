import { Router } from 'express';
import { register, login, getMe } from '../../controllers/auth.controller';
import { validate } from '../../middlewares/validate.middleware';
import { protect } from '../../middlewares/auth.middleware';
import { registerSchema, loginSchema } from '../../validators/auth.validator';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:     { type: string, example: John Doe }
 *               email:    { type: string, example: john@example.com }
 *               password: { type: string, example: password123 }
 *               role:     { type: string, example: user }
 *     responses:
 *       201: { description: User registered successfully }
 *       409: { description: Email already exists }
 */
router.post('/register', validate(registerSchema), register);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:    { type: string, example: john@example.com }
 *               password: { type: string, example: password123 }
 *     responses:
 *       200: { description: Login successful }
 *       401: { description: Invalid credentials }
 */
router.post('/login', validate(loginSchema), login);

/**
 * @swagger
 * /api/v1/auth/me:
 *   get:
 *     summary: Get current logged-in user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Current user data }
 *       401: { description: Unauthorized }
 */
router.get('/me', protect, getMe);

export default router;
