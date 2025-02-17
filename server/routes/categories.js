import express from 'express';
import { getCategories, createCategory } from '../controllers/categorycontroller.js';
import { authenticateToken } from '../middleware/authmiddleware.js';

// Create a new router instance
const router = express.Router();

// GET categories.
router.get('/', getCategories);

// POST new categories.
router.post('/', authenticateToken, createCategory);

export default router;