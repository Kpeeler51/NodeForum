import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRoutes from './routes/users.js';
import threadRoutes from './routes/threads.js';
import categoryRoutes from './routes/categories.js';

// Load environment variables from .env file
dotenv.config();

// Create Express application
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));
// Parse JSON bodies
app.use(express.json());
// Enable CORS with a specific origin
app.use(cors({
    origin: [
      'https://bookforum-zog8.onrender.com',
      'http://localhost:5173',
    ],
    credentials: true
  }));

  // Database connection function
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

// API routes
app.use('/api/users', userRoutes);
app.use('/api/threads', threadRoutes);
app.use('/api/categories', categoryRoutes);

// Server startup function
const startServer = async () => {
    try {
        // Connect to mongoDB
        await connectDB();
        // Start the express server.
        await new Promise((resolve, reject) => {
            app.listen(PORT, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        console.log(`Server listening on http://localhost:${PORT}`);
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();