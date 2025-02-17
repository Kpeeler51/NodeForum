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

// Create a new router instance.
const router = express.Router();

// POST a new thread. Requires authentication.
router.post('/', authenticateToken, createThread);

// GET all threads.
router.get('/', getThreads);

// GET a specific thread by its ID.
router.get('/:id', getThread);

// POST a new reply to a specific thread. Requires authentication.
router.post('/:threadId/replies', authenticateToken, createReply);

// DELETE a specific thread by its ID. Requires authentication.
router.delete('/:id', authenticateToken, deleteThread);

// DELETE a specific reply by its ID. Requires authentication.
router.delete('/replies/:id', authenticateToken, deleteReply);

export default router;