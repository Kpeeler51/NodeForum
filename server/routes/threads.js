import express from 'express';
import { authenticateToken } from '../middleware/authmiddleware.js';
import {
  createThread,
  getThreads,
  getThread,
  createReply,
  deleteThread,
  deleteReply,
} from '../controllers/threadcontroller.js';

const router = express.Router();

router.post('/', authenticateToken, createThread);
router.get('/', getThreads);
router.get('/:id', getThread);
router.post('/:threadId/replies', authenticateToken, createReply);
router.delete('/:id', authenticateToken, deleteThread);
router.delete('/replies/:id', authenticateToken, deleteReply);

export default router;