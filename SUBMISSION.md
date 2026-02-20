# Backend Track Submission

## Track Chosen
**Backend Development** - RESTful API for Task Management

## GitHub Copilot Usage Summary

GitHub Copilot was extensively used throughout the development process to:
- Generate production-grade TypeScript code with proper type safety
- Implement advanced Zod validation schemas with custom business rules
- Create middleware for error handling and request logging
- Ensure best coding practices and architectural patterns
- Refactor code to eliminate `any` types and improve type safety

## Key Prompts Used

1. **"Implement a RESTful API for task management with CRUD operations, in-memory storage, input validation using Zod, and error handling following proper REST conventions"**
   - Generated complete task management system with controllers, routes, and models

2. **"Refactor the code as we are using any at many places and also put zod error handling in the middleware part"**
   - Eliminated all `any` types, centralized Zod error handling in middleware

3. **"Integrate Winston for request logging - capture all incoming requests with method, URL, and execution time"**
   - Implemented production-grade logging system with Winston

4. **"Make sure we are using advanced validation - custom validation rules, request body sanitization, detailed error messages"**
   - Enhanced Zod schemas with `.transform()`, `.refine()`, strict mode, and custom error messages

5. **"If dueDate is within 7 days then priority should be high, and get tasks by dueDate in descending order"**
   - Implemented automatic priority assignment and task sorting logic

6. **"Add isEditable flag to allow editing of completed tasks only with explicit permission"**
   - Implemented `allowEditCompleted` flag for controlling completed task modifications

## Design Decisions and Reasoning

### 1. **Clean Architecture Pattern**
- **Decision**: Separated concerns into routes, controllers, models, middleware, and config
- **Reasoning**: Improves maintainability, testability, and follows SOLID principles

### 2. **Zod for Validation**
- **Decision**: Used Zod with advanced features (transform, refine, strict mode)
- **Reasoning**: Type-safe validation, automatic sanitization, detailed error messages, and TypeScript integration via `z.infer<>`

### 3. **Centralized Error Handling**
- **Decision**: Single error handler middleware with Zod-specific formatting
- **Reasoning**: DRY principle, consistent error responses, better logging, easier maintenance

### 4. **Winston for Logging**
- **Decision**: Winston with environment-based configuration and file transports
- **Reasoning**: Production-ready logging, configurable levels, file persistence, better debugging

### 5. **Automatic Priority Assignment**
- **Decision**: Auto-set priority to "high" if due date is ≤7 days
- **Reasoning**: Business logic automation, prevents missed deadlines, user-friendly

### 6. **Completed Task Protection**
- **Decision**: Require explicit `allowEditCompleted: true` flag to edit completed tasks
- **Reasoning**: Prevents accidental modifications while maintaining flexibility for intentional edits

### 7. **Zero `any` Types**
- **Decision**: Strict TypeScript with proper type definitions throughout
- **Reasoning**: Type safety, better IDE support, catches errors at compile time, production-grade code quality

### 8. **Request Body Sanitization**
- **Decision**: Automatic trimming and whitespace normalization via Zod transforms
- **Reasoning**: Data consistency, prevents validation bypass, improves data quality

## Challenges Faced

### 1. **TypeScript Overload Signatures**
- **Challenge**: Initial implementation of request logging middleware had type conflicts with Express's `res.end()` overload signatures
- **Solution**: Used event-based approach with `res.on('finish')` instead of overriding `res.end()`, which is cleaner and avoids type issues

### 2. **Validation Field Count with Control Flags**
- **Challenge**: `allowEditCompleted` flag counted as a data field in "at least one field required" validation
- **Solution**: Updated Zod refinement to exclude control flags when counting actual data fields

### 3. **Maintaining Type Safety Without `any`**
- **Challenge**: Custom error objects needed additional properties (statusCode, validationErrors)
- **Solution**: Used TypeScript intersection types: `Error & { statusCode: number }` instead of type assertions to `any`

## Implementation Highlights

### Production-Grade Features
✅ Full CRUD operations with RESTful conventions  
✅ Advanced Zod validation (sanitization, custom rules, strict mode)  
✅ Centralized error handling with detailed validation messages  
✅ Winston-based request logging with execution time tracking  
✅ Automatic priority management based on due dates  
✅ Task sorting by due date (descending order)  
✅ Completed task edit protection with explicit permission flag  
✅ Zero `any` types - 100% type-safe TypeScript  
✅ In-memory storage with UUID identifiers  
✅ Automatic timestamps (createdAt, updatedAt)  

### API Endpoints
- `GET /api/tasks` - Get all tasks (filtered, sorted by dueDate desc)
- `GET /api/tasks/:id` - Get task by ID
- `POST /api/tasks` - Create task (auto-set priority if due ≤7 days)
- `PUT /api/tasks/:id` - Update task (requires permission for completed tasks)
- `DELETE /api/tasks/:id` - Delete task
- `DELETE /api/tasks` - Delete all tasks

### Validation Features
- Title: 3-200 characters, auto-sanitized
- Description: Max 1000 characters, auto-sanitized
- Due Date: ISO 8601 format, must be future date
- Status/Priority: Enum validation with detailed error messages
- Strict mode: Rejects unknown fields
- Custom business rules: Future dates, auto-priority assignment

## Time Breakdown

- **Initial Setup & CRUD Implementation**: ~30%
- **Advanced Validation & Sanitization**: ~20%
- **Error Handling & Logging Setup**: ~20%
- **Business Logic (Priority, Sorting)**: ~15%
- **Completed Task Protection**: ~10%
- **Code Refactoring & Type Safety**: ~5%

## Optional Challenges Attempted

1. ✅ **Advanced Validation** - Implemented custom validation rules, sanitization, and detailed error messages beyond basic Zod usage
2. ✅ **Request Logging** - Integrated Winston for production-grade logging with execution time tracking
3. ✅ **Business Logic Automation** - Automatic priority assignment based on due dates
4. ✅ **Data Integrity Controls** - Protection mechanism for editing completed tasks

## Code Quality Standards Followed

- ✅ No `any` types in entire codebase
- ✅ Strict TypeScript configuration
- ✅ Production-grade error handling
- ✅ Comprehensive input validation
- ✅ Clean architecture with separation of concerns
- ✅ RESTful API design conventions
- ✅ Proper HTTP status codes
- ✅ Detailed API documentation

## Files Created/Modified

**Created:**
- `src/models/task.model.ts` - Task model with Zod schemas
- `src/controllers/task.controller.ts` - CRUD operations
- `src/routes/task.routes.ts` - RESTful routes
- `src/config/logger.ts` - Winston logger configuration
- `src/middleware/requestLogger.ts` - Request logging middleware
- `API_DOCUMENTATION.md` - Comprehensive API documentation
- `.github/copilot-instructions.md` - Coding standards and patterns

**Modified:**
- `src/app.ts` - Registered routes and middleware
- `src/middleware/errorHandler.ts` - Enhanced with Zod error handling
- `package.json` - Added dependencies (zod, winston, uuid)

---

**Total Lines of Production Code**: ~600+ lines  
**Test Coverage**: Manual testing via API endpoints  
**Documentation**: Comprehensive API documentation with examples
