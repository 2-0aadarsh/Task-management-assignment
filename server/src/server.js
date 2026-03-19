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

await connectDB();

// routes
app.use('/tasks', taskRoutes);

app.get('/', (req, res) => {
    res.send('Hello World');
});

const PORT = process.env.PORT || 5000;
// app.listen(PORT, async () => {
  
//   console.log(`Server running on ${PORT}`);
// });

// Export for Vercel instead of listen
export default app;