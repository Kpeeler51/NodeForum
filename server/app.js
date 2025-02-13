import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/authroutes.js';
import dotenv from 'dotenv';
const PORT = process.env.PORT || 3000;

dotenv.config();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

  app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

