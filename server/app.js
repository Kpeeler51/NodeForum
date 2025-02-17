import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRoutes from './routes/users.js';
import threadRoutes from './routes/threads.js';
import categoryRoutes from './routes/categories.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
    origin: 'https://bookforum-zog8.onrender.com',
    credentials: true
  }));

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

app.use('/api/users', userRoutes);
app.use('/api/threads', threadRoutes);
app.use('/api/categories', categoryRoutes);

const startServer = async () => {
    try {
        await connectDB();
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