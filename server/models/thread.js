import mongoose from 'mongoose';

// Define thread schema and model.
// Threads require a title, descripton, category, and author.
const threadSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

// Creates thread using the defined schema.
const Thread = mongoose.model('Thread', threadSchema);

export default Thread;