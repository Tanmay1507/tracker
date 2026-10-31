import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './database/db.js';
import apiRouter from './routers/index.js';
import { requestLogger } from './middleware/loggerMiddleware.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Core Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Root route
app.get('/', (req, res) => {
  res.json({
    name: 'Git Tracker API',
    version: '1.0.0',
    documentation: '/api/health'
  });
});

// API Routes
app.use('/api', apiRouter);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`[Server] Git Tracker backend running on port ${PORT} (${process.env.NODE_ENV || 'development'})`);
});

export default app;

