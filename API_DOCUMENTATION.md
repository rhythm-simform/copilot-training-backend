# Task Management API Documentation

## Overview
A production-grade RESTful API for task management with in-memory storage, input validation using Zod, and comprehensive error handling.

## Base URL
```
http://localhost:3000/api
```

## Swagger UI
- Interactive docs: `http://localhost:3000/api-docs`
- Raw OpenAPI spec: `http://localhost:3000/api-docs.json`
- Available only when `NODE_ENV` is `local`, `dev`, or `development`

## Features
- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ In-memory data storage
- ✅ Input validation using Zod
- ✅ Comprehensive error handling
- ✅ RESTful conventions
- ✅ Query filtering support
- ✅ Production-grade code structure

## Task Model

```typescript
{
  id: string;              // UUID v4
  title: string;           // Required, 1-200 characters
  description?: string;    // Optional
  status: 'pending' | 'in-progress' | 'completed';  // Default: 'pending'
  priority: 'low' | 'medium' | 'high';              // Default: 'medium'
  dueDate?: string;        // Optional, ISO 8601 datetime
  createdAt: string;       // ISO 8601 datetime
  updatedAt: string;       // ISO 8601 datetime
}
```

## API Endpoints

### 1. Get All Tasks
**GET** `/api/tasks`

Retrieve all tasks with optional filtering.

**Query Parameters:**
- `status` (optional): Filter by status (`pending`, `in-progress`, `completed`)
- `priority` (optional): Filter by priority (`low`, `medium`, `high`)

**Example Request:**
```bash
GET /api/tasks
GET /api/tasks?status=pending
GET /api/tasks?priority=high
GET /api/tasks?status=in-progress&priority=medium
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Complete project documentation",
      "description": "Write comprehensive API documentation",
      "status": "in-progress",
      "priority": "high",
      "dueDate": "2026-02-25T23:59:59Z",
      "createdAt": "2026-02-20T10:00:00Z",
      "updatedAt": "2026-02-20T10:00:00Z"
    }
  ]
}
```

---

### 2. Get Task by ID
**GET** `/api/tasks/:id`

Retrieve a specific task by its ID.

**URL Parameters:**
- `id` (required): Task UUID

**Example Request:**
```bash
GET /api/tasks/550e8400-e29b-41d4-a716-446655440000
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Complete project documentation",
    "description": "Write comprehensive API documentation",
    "status": "in-progress",
    "priority": "high",
    "dueDate": "2026-02-25T23:59:59Z",
    "createdAt": "2026-02-20T10:00:00Z",
    "updatedAt": "2026-02-20T10:00:00Z"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "error": {
    "message": "Task not found",
    "statusCode": 404
  }
}
```

---

### 3. Create Task
**POST** `/api/tasks`

Create a new task.

**Request Body:**
```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation",
  "status": "pending",
  "priority": "high",
  "dueDate": "2026-02-25T23:59:59Z"
}
```

**Required Fields:**
- `title` (string): 1-200 characters

**Optional Fields:**
- `description` (string)
- `status` (enum): `pending` | `in-progress` | `completed` (default: `pending`)
- `priority` (enum): `low` | `medium` | `high` (default: `medium`)
- `dueDate` (string): ISO 8601 datetime format

**Example Request:**
```bash
POST /api/tasks
Content-Type: application/json

{
  "title": "Implement user authentication",
  "description": "Add JWT-based authentication",
  "status": "pending",
  "priority": "high",
  "dueDate": "2026-03-01T23:59:59Z"
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "title": "Implement user authentication",
    "description": "Add JWT-based authentication",
    "status": "pending",
    "priority": "high",
    "dueDate": "2026-03-01T23:59:59Z",
    "createdAt": "2026-02-20T11:00:00Z",
    "updatedAt": "2026-02-20T11:00:00Z"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": {
    "message": "Title is required",
    "statusCode": 400
  }
}
```

---

### 4. Update Task
**PUT** `/api/tasks/:id`

Update an existing task. All fields are optional.

**URL Parameters:**
- `id` (required): Task UUID

**Request Body:**
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "status": "completed",
  "priority": "low",
  "dueDate": "2026-03-15T23:59:59Z"
}
```

**Example Request:**
```bash
PUT /api/tasks/550e8400-e29b-41d4-a716-446655440000
Content-Type: application/json

{
  "status": "completed"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Complete project documentation",
    "description": "Write comprehensive API documentation",
    "status": "completed",
    "priority": "high",
    "dueDate": "2026-02-25T23:59:59Z",
    "createdAt": "2026-02-20T10:00:00Z",
    "updatedAt": "2026-02-20T12:00:00Z"
  }
}
```

**Error Responses:**
- 404 Not Found: Task doesn't exist
- 400 Bad Request: Validation error

---

### 5. Delete Task
**DELETE** `/api/tasks/:id`

Delete a specific task.

**URL Parameters:**
- `id` (required): Task UUID

**Example Request:**
```bash
DELETE /api/tasks/550e8400-e29b-41d4-a716-446655440000
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Task deleted successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Complete project documentation",
    "description": "Write comprehensive API documentation",
    "status": "completed",
    "priority": "high",
    "dueDate": "2026-02-25T23:59:59Z",
    "createdAt": "2026-02-20T10:00:00Z",
    "updatedAt": "2026-02-20T12:00:00Z"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "error": {
    "message": "Task not found",
    "statusCode": 404
  }
}
```

---

### 6. Delete All Tasks
**DELETE** `/api/tasks`

Delete all tasks (useful for testing/reset).

**Example Request:**
```bash
DELETE /api/tasks
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Successfully deleted 5 task(s)"
}
```

---

## Error Handling

All errors follow a consistent format:

```json
{
  "error": {
    "message": "Error description",
    "statusCode": 400
  }
}
```

### Common HTTP Status Codes:
- `200 OK`: Successful GET, PUT, DELETE
- `201 Created`: Successful POST
- `400 Bad Request`: Validation error
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

---

## Running the API

### Development Mode:
```bash
cd backend
npm install
npm run dev
```

### Production Mode:
```bash
cd backend
npm install
npm run build
npm start
```

The server will start on `http://localhost:3000`

---

## Testing Examples with cURL

### Create a task:
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Learn TypeScript",
    "description": "Complete TypeScript tutorial",
    "status": "pending",
    "priority": "high"
  }'
```

### Get all tasks:
```bash
curl http://localhost:3000/api/tasks
```

### Get tasks by status:
```bash
curl http://localhost:3000/api/tasks?status=pending
```

### Update a task:
```bash
curl -X PUT http://localhost:3000/api/tasks/{task-id} \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed"
  }'
```

### Delete a task:
```bash
curl -X DELETE http://localhost:3000/api/tasks/{task-id}
```

---

## Project Structure

```
backend/
├── src/
│   ├── app.ts                       # Express app configuration
│   ├── server.ts                    # Server entry point
│   ├── config/
│   │   └── logger.ts                # Winston logger configuration
│   ├── controllers/
│   │   ├── health.controller.ts     # Health check endpoint
│   │   └── task.controller.ts       # Task CRUD operations
│   ├── middleware/
│   │   ├── errorHandler.ts          # Global error handler
│   │   └── requestLogger.ts         # Request logging middleware
│   ├── models/
│   │   └── task.model.ts            # Task model & Zod schemas
│   └── routes/
│       ├── health.routes.ts         # Health routes
│       └── task.routes.ts           # Task routes
├── package.json
└── tsconfig.json
```

---

## Validation Rules

### Advanced Validation Features:
- ✅ **Automatic sanitization** - Trims whitespace and normalizes spaces
- ✅ **Custom validation rules** - Business logic validation (e.g., future dates)
- ✅ **Detailed error messages** - User-friendly validation feedback
- ✅ **Strict mode** - Rejects unknown fields

### Title:
- **Required** for creation
- **Type**: String
- **Minimum**: 3 characters (after trimming)
- **Maximum**: 200 characters
- **Sanitization**: Automatic whitespace trimming and normalization
- **Error messages**: Descriptive errors for each constraint

### Description:
- **Optional**
- **Type**: String
- **Maximum**: 1000 characters
- **Sanitization**: Automatic whitespace trimming and normalization

### Status:
- **Allowed values**: `pending`, `in-progress`, `completed`
- **Default**: `pending`
- **Error message**: Lists all valid options when invalid value provided

### Priority:
- **Allowed values**: `low`, `medium`, `high`
- **Default**: `medium`
- **Error message**: Lists all valid options when invalid value provided

### Due Date:
- **Optional**
- **Format**: ISO 8601 datetime (e.g., `2026-02-25T23:59:59Z`)
- **Validation**: Must be a future date
- **Error messages**: 
  - Invalid format: "Due date must be a valid ISO 8601 datetime format"
  - Past date: "Due date must be in the future"

### Update Validation:
- **At least one field required** - Cannot send empty update request
- **No unknown fields** - Strict schema validation

### Error Response Format:

When validation fails, you'll receive a detailed error response:

```json
{
  "error": {
    "message": "Validation failed",
    "statusCode": 400,
    "validationErrors": [
      {
        "field": "title",
        "message": "Title must be at least 3 characters long after trimming",
        "code": "custom"
      },
      {
        "field": "dueDate",
        "message": "Due date must be in the future",
        "code": "custom"
      }
    ]
  }
}
```

---

## Production Features

- ✅ **Type Safety**: Full TypeScript implementation with zero `any` types
- ✅ **Advanced Validation**: 
  - Zod schema validation with custom rules
  - Automatic request body sanitization
  - Detailed validation error messages
  - Strict mode (rejects unknown fields)
  - Future date validation for due dates
  - Title length constraints with sanitization
- ✅ **Error Handling**: 
  - Centralized error middleware
  - Zod error formatting
  - Comprehensive error logging
- ✅ **Request Logging**: 
  - Winston-based logging
  - HTTP request/response tracking
  - Execution time monitoring
- ✅ **RESTful Design**: Proper HTTP methods and status codes
- ✅ **Clean Architecture**: Separation of concerns (routes, controllers, models, config)
- ✅ **Code Quality**: Production-grade standards
- ✅ **Filtering**: Query parameter support
- ✅ **Timestamps**: Automatic createdAt/updatedAt tracking
- ✅ **UUID**: Unique identifiers for tasks
