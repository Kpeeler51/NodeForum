import mongoose from 'mongoose';

// Define category schema and model.
// Category name is required and needs to be unique.
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});

// Create category model using the schema.
const Category = mongoose.model('Category', categorySchema);

export default Category;
