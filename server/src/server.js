import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';    
dotenv.config();

import taskRoutes from './routes/task.routes.js';
import { connectDB } from './configs/mongodb.config.js';

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// routes
app.use('/', (req, res) => {
  res.send('Hello World');
});
app.use('/tasks', taskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running on ${PORT}`);
});