import { JsonObject } from 'swagger-ui-express';

const swaggerDocument: JsonObject = {
  openapi: '3.0.3',
  info: {
    title: 'Task Management API',
    version: '1.0.0',
    description: 'Swagger documentation for task and health API endpoints.',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local development server',
    },
  ],
  components: {
    schemas: {
      Task: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          title: { type: 'string' },
          description: { type: 'string' },
          status: { type: 'string', enum: ['pending', 'in-progress', 'completed'] },
          priority: { type: 'string', enum: ['low', 'medium', 'high'] },
          dueDate: { type: 'string', format: 'date-time' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
        required: ['id', 'title', 'status', 'priority', 'createdAt', 'updatedAt'],
      },
      CreateTaskInput: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          status: { type: 'string', enum: ['pending', 'in-progress', 'completed'] },
          priority: { type: 'string', enum: ['low', 'medium', 'high'] },
          dueDate: { type: 'string', format: 'date-time' },
        },
        required: ['title'],
      },
      UpdateTaskInput: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          status: { type: 'string', enum: ['pending', 'in-progress', 'completed'] },
          priority: { type: 'string', enum: ['low', 'medium', 'high'] },
          dueDate: { type: 'string', format: 'date-time' },
          allowEditCompleted: { type: 'boolean' },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          error: {
            type: 'object',
            properties: {
              message: { type: 'string' },
              statusCode: { type: 'number' },
            },
          },
        },
      },
    },
  },
  paths: {
    '/health': {
      get: {
        summary: 'Health check',
        responses: {
          '200': {
            description: 'Server health status',
          },
        },
      },
    },
    '/api/tasks': {
      get: {
        summary: 'Get all tasks',
        parameters: [
          {
            in: 'query',
            name: 'status',
            schema: { type: 'string', enum: ['pending', 'in-progress', 'completed'] },
          },
          {
            in: 'query',
            name: 'priority',
            schema: { type: 'string', enum: ['low', 'medium', 'high'] },
          },
        ],
        responses: {
          '200': {
            description: 'List of tasks',
          },
        },
      },
      post: {
        summary: 'Create a task',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateTaskInput' },
            },
          },
        },
        responses: {
          '201': { description: 'Task created successfully' },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      delete: {
        summary: 'Delete all tasks',
        responses: {
          '200': { description: 'Tasks deleted successfully' },
        },
      },
    },
    '/api/tasks/{id}': {
      get: {
        summary: 'Get task by ID',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: {
          '200': { description: 'Task found' },
          '404': {
            description: 'Task not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      put: {
        summary: 'Update task by ID',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateTaskInput' },
            },
          },
        },
        responses: {
          '200': { description: 'Task updated successfully' },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '403': {
            description: 'Completed task cannot be edited',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '404': {
            description: 'Task not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      delete: {
        summary: 'Delete task by ID',
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: {
          '200': { description: 'Task deleted successfully' },
          '404': {
            description: 'Task not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
  },
};

export default swaggerDocument;
