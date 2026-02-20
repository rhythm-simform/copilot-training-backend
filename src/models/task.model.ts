import { z } from 'zod';

// Custom validation helpers
const sanitizeString = (str: string): string => {
  return str.trim().replace(/\s+/g, ' ');
};

const isFutureDate = (dateStr: string): boolean => {
  const dueDate = new Date(dateStr);
  const now = new Date();
  return dueDate > now;
};

// Zod schema for creating a task
export const createTaskSchema = z.object({
  title: z
    .string({
      required_error: 'Title is required',
      invalid_type_error: 'Title must be a string',
    })
    .min(1, 'Title cannot be empty')
    .max(200, 'Title must not exceed 200 characters')
    .transform(sanitizeString)
    .refine((title) => title.length >= 3, {
      message: 'Title must be at least 3 characters long after trimming',
    }),
  description: z
    .string({
      invalid_type_error: 'Description must be a string',
    })
    .max(1000, 'Description must not exceed 1000 characters')
    .transform(sanitizeString)
    .optional(),
  status: z
    .enum(['pending', 'in-progress', 'completed'], {
      errorMap: () => ({
        message: 'Status must be one of: pending, in-progress, completed',
      }),
    })
    .default('pending'),
  priority: z
    .enum(['low', 'medium', 'high'], {
      errorMap: () => ({
        message: 'Priority must be one of: low, medium, high',
      }),
    })
    .default('medium'),
  dueDate: z
    .string({
      invalid_type_error: 'Due date must be a valid ISO 8601 datetime string',
    })
    .datetime({
      message: 'Due date must be a valid ISO 8601 datetime format (e.g., 2026-02-25T23:59:59Z)',
    })
    .refine(isFutureDate, {
      message: 'Due date must be in the future',
    })
    .optional(),
}).strict({
  message: 'Unknown fields are not allowed in the request body',
});

// Zod schema for updating a task
export const updateTaskSchema = z.object({
  title: z
    .string({
      invalid_type_error: 'Title must be a string',
    })
    .min(1, 'Title cannot be empty')
    .max(200, 'Title must not exceed 200 characters')
    .transform(sanitizeString)
    .refine((title) => title.length >= 3, {
      message: 'Title must be at least 3 characters long after trimming',
    })
    .optional(),
  description: z
    .string({
      invalid_type_error: 'Description must be a string',
    })
    .max(1000, 'Description must not exceed 1000 characters')
    .transform(sanitizeString)
    .optional(),
  status: z
    .enum(['pending', 'in-progress', 'completed'], {
      errorMap: () => ({
        message: 'Status must be one of: pending, in-progress, completed',
      }),
    })
    .optional(),
  priority: z
    .enum(['low', 'medium', 'high'], {
      errorMap: () => ({
        message: 'Priority must be one of: low, medium, high',
      }),
    })
    .optional(),
  dueDate: z
    .string({
      invalid_type_error: 'Due date must be a valid ISO 8601 datetime string',
    })
    .datetime({
      message: 'Due date must be a valid ISO 8601 datetime format (e.g., 2026-02-25T23:59:59Z)',
    })
    .refine(isFutureDate, {
      message: 'Due date must be in the future',
    })
    .optional(),
  allowEditCompleted: z
    .boolean({
      invalid_type_error: 'allowEditCompleted must be a boolean',
    })
    .optional()
    .describe('Set to true to allow editing of completed tasks'),
})
  .strict({
    message: 'Unknown fields are not allowed in the request body',
  })
  .refine(
    (data) => {
      // Count actual data fields (excluding allowEditCompleted flag)
      const { allowEditCompleted, ...actualFields } = data;
      return Object.keys(actualFields).length > 0;
    },
    {
      message: 'At least one field must be provided for update',
    }
  );

// TypeScript types inferred from Zod schemas
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

// Task interface
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}
