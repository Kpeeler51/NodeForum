import mongoose from 'mongoose';

// Define user schema and model.
// Username and email are required and unique.
// Password is required but not unique.
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Create a user using the defined schema.
const User = mongoose.model('User', userSchema);

export default User;