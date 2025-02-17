import express from 'express';
import { register, login } from '../controllers/usercontroller.js';

// Create a new router instance
const router = express.Router();

// POST a new user.
router.post('/register', register);

// POST a user to login.
router.post('/login', login);

export default router;
