import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { 
  Task, 
  createTaskSchema, 
  updateTaskSchema,
  CreateTaskInput,
  UpdateTaskInput 
} from '../models/task.model';

// In-memory storage for tasks
let tasks: Task[] = [];

/**
 * Check if a date is within 7 days from now
 * @param dueDate - ISO date string
 * @returns true if within 7 days, false otherwise
 */
const isWithinSevenDays = (dueDate: string): boolean => {
  const due = new Date(dueDate);
  const now = new Date();
  const diffTime = due.getTime() - now.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  return diffDays <= 7 && diffDays >= 0;
};

/**
 * Determine priority based on due date
 * If due date is within 7 days, priority should be high
 * @param dueDate - Optional ISO date string
 * @param requestedPriority - Priority requested by user
 * @returns Final priority to use
 */
const determinePriority = (
  dueDate: string | undefined,
  requestedPriority: 'low' | 'medium' | 'high' | undefined
): 'low' | 'medium' | 'high' => {
  if (dueDate && isWithinSevenDays(dueDate)) {
    return 'high';
  }
  return requestedPriority || 'medium';
};

/**
 * Get all tasks with optional filtering
 */
export const getAllTasks = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const { status, priority } = req.query;
    
    let filteredTasks = [...tasks];
    
    // Filter by status if provided
    if (status && typeof status === 'string') {
      filteredTasks = filteredTasks.filter(task => task.status === status);
    }
    
    // Filter by priority if provided
    if (priority && typeof priority === 'string') {
      filteredTasks = filteredTasks.filter(task => task.priority === priority);
    }
    
    // Sort by dueDate in descending order (most recent due dates first)
    // Tasks without dueDate will be placed at the end
    filteredTasks.sort((a, b) => {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
    });
    
    res.status(200).json({
      success: true,
      count: filteredTasks.length,
      data: filteredTasks,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single task by ID
 */
export const getTaskById = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const { id } = req.params;
    
    const task = tasks.find(t => t.id === id);
    
    if (!task) {
      const error = new Error('Task not found') as Error & { statusCode: number };
      error.statusCode = 404;
      throw error;
    }
    
    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new task
 */
export const createTask = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Validate request body using Zod
    const validatedData: CreateTaskInput = createTaskSchema.parse(req.body);
    
    // Determine priority based on due date (auto-set to high if within 7 days)
    const finalPriority = determinePriority(validatedData.dueDate, validatedData.priority);
    
    // Create new task
    const newTask: Task = {
      id: uuidv4(),
      title: validatedData.title,
      description: validatedData.description,
      status: validatedData.status || 'pending',
      priority: finalPriority,
      dueDate: validatedData.dueDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Add to in-memory storage
    tasks.push(newTask);
    
    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: newTask,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing task
 */
export const updateTask = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const { id } = req.params;
    
    // Find task index
    const taskIndex = tasks.findIndex(t => t.id === id);
    
    if (taskIndex === -1) {
      const error = new Error('Task not found') as Error & { statusCode: number };
      error.statusCode = 404;
      throw error;
    }
    
    const existingTask = tasks[taskIndex];
    
    // Validate request body using Zod
    const validatedData: UpdateTaskInput = updateTaskSchema.parse(req.body);
    
    // Check if task is completed and editing is not explicitly allowed
    if (existingTask.status === 'completed' && !validatedData.allowEditCompleted) {
      const error = new Error(
        'Cannot edit completed tasks. Set allowEditCompleted to true to modify this task.'
      ) as Error & { statusCode: number };
      error.statusCode = 403;
      throw error;
    }
    
    // Remove the allowEditCompleted flag before applying updates
    const { allowEditCompleted, ...updateFields } = validatedData;
    
    // Determine the final due date (use updated value if provided, otherwise keep existing)
    const finalDueDate = updateFields.dueDate !== undefined ? updateFields.dueDate : existingTask.dueDate;
    
    // Determine priority based on due date (auto-set to high if within 7 days)
    const finalPriority = determinePriority(finalDueDate, updateFields.priority);
    
    // Update task
    const updatedTask: Task = {
      ...existingTask,
      ...updateFields,
      priority: finalPriority,
      updatedAt: new Date().toISOString(),
    };
    
    tasks[taskIndex] = updatedTask;
    
    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a task
 */
export const deleteTask = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const { id } = req.params;
    
    // Find task index
    const taskIndex = tasks.findIndex(t => t.id === id);
    
    if (taskIndex === -1) {
      const error = new Error('Task not found') as Error & { statusCode: number };
      error.statusCode = 404;
      throw error;
    }
    
    // Remove task from array
    const deletedTask = tasks.splice(taskIndex, 1)[0];
    
    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: deletedTask,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete all tasks (useful for testing/reset)
 */
export const deleteAllTasks = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const count = tasks.length;
    tasks = [];
    
    res.status(200).json({
      success: true,
      message: `Successfully deleted ${count} task(s)`,
    });
  } catch (error) {
    next(error);
  }
};
