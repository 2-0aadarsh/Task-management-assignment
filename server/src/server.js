import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';    
dotenv.config();

import taskRoutes from './routes/task.routes.js';
import { connectDB } from './configs/mongodb.config.js';

const app = express();

// middlewares
app.use(cors({
    origin: "*", // for now
}));
app.use(express.json());

// request logging middleware
app.use((req, res, next) => {
  console.log(` ${req.method} ${req.path}`);
  next();
});

// routes
app.use('/tasks', taskRoutes);

app.get('/', (req, res) => {
    res.send('Hello World');
});

// Global error handler middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  console.error('Stack:', err.stack);
  
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  await connectDB();
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});