import express from 'express';
import { getCategories, createCategory } from '../controllers/categorycontroller.js';
import { authenticateToken } from '../middleware/authmiddleware.js';

const router = express.Router();

router.get('/', getCategories);
router.post('/', authenticateToken, createCategory);

export default router;