import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import taskRoutes from './routes/task.routes.js';
import { connectDB } from './configs/mongodb.config.js';

dotenv.config();

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// routes
app.use('/tasks', taskRoutes);

await connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));