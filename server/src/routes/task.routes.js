import express from 'express';
import {
  createTask,
  getTasks,
  completeTask,
  deleteTask
} from '../controllers/task.controller.js';

const router = express.Router();

router.post('/', createTask);
router.get('/', getTasks);
router.patch('/:id', completeTask);
router.delete('/:id', deleteTask);

export default router;