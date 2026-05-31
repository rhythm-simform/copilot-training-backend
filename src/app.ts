import express, { Application, Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import healthRoutes from './routes/health.routes';
import taskRoutes from './routes/task.routes';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import swaggerDocument from './config/swagger';

const app: Application = express();

// Request logging middleware (should be first)
app.use(requestLogger);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', healthRoutes);
app.use('/api', taskRoutes);
app.get('/api-docs.json', (_req: Request, res: Response) => {
  res.status(200).json(swaggerDocument);
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;
