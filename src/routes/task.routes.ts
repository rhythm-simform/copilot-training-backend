import { Router } from 'express';
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  deleteAllTasks,
} from '../controllers/task.controller';

const router = Router();

// GET /api/tasks - Get all tasks (with optional filtering)
router.get('/tasks', getAllTasks);

// GET /api/tasks/:id - Get a specific task by ID
router.get('/tasks/:id', getTaskById);

// POST /api/tasks - Create a new task
router.post('/tasks', createTask);

// PUT /api/tasks/:id - Update a task
router.put('/tasks/:id', updateTask);

// DELETE /api/tasks/:id - Delete a specific task
router.delete('/tasks/:id', deleteTask);

// DELETE /api/tasks - Delete all tasks
router.delete('/tasks', deleteAllTasks);

export default router;
