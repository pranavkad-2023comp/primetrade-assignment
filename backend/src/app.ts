import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './config/db';
import { setupSwagger } from './config/swagger';
import authRoutes from './routes/v1/auth.routes';
import { errorHandler } from './middlewares/error.middleware';
import taskRoutes from './routes/v1/task.routes';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect DB
connectDB();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use(mongoSanitize());
app.use('/api/v1/auth', rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: { success: false, message: 'Too many requests, try again later' } }));

// Swagger
setupSwagger(app);

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tasks', taskRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: '🚀 PrimeTrade API is running!' });
});

// Error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

export default app;
