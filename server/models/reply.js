import mongoose from 'mongoose';

// Define reply schema and model,
// Content, author, and thread are required fields
const replySchema = new mongoose.Schema({
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  thread: { type: mongoose.Schema.Types.ObjectId, ref: 'Thread', required: true },
  createdAt: { type: Date, default: Date.now },
});

// Create a reply using the defined schema
const Reply = mongoose.model('Reply', replySchema);

export default Reply;