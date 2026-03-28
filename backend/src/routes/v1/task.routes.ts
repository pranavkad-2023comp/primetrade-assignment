import { Router } from 'express';
import { protect, restrictTo } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { createTaskSchema, updateTaskSchema } from '../../validators/task.validator';
import {
  createTask, getTasks, getTask,
  updateTask, deleteTask, getAllTasksAdmin
} from '../../controllers/task.controller';

const router = Router();

// All routes below require login
router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management endpoints
 */

/**
 * @swagger
 * /api/v1/tasks:
 *   get:
 *     summary: Get all tasks for logged-in user
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: List of tasks }
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:       { type: string, example: My First Task }
 *               description: { type: string, example: Task details here }
 *               status:      { type: string, example: todo }
 *     responses:
 *       201: { description: Task created }
 */
router.route('/')
  .get(getTasks)
  .post(validate(createTaskSchema), createTask);

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   get:
 *     summary: Get a single task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Task data }
 *       404: { description: Task not found }
 *   patch:
 *     summary: Update a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Updated task }
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Task deleted }
 */
router.route('/:id')
  .get(getTask)
  .patch(validate(updateTaskSchema), updateTask)
  .delete(deleteTask);

/**
 * @swagger
 * /api/v1/tasks/admin/all:
 *   get:
 *     summary: Admin - Get ALL tasks from all users
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: All tasks }
 *       403: { description: Forbidden }
 */
router.get('/admin/all', restrictTo('admin'), getAllTasksAdmin);

export default router;
