import Category from '../models/category.js';

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
};

export const createCategory = async (req, res) => {
    try {
      const { name } = req.body;
  
      // Check if the category already exists
      let category = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
  
      if (category) {
        // If category exists, return it
        return res.status(200).json({ message: 'Category already exists', category });
      }
  
      // If category doesn't exist, create a new one
      category = new Category({ name });
      await category.save();
  
      res.status(201).json({ message: 'Category created successfully', category });
    } catch (error) {
      res.status(500).json({ message: 'Error creating category', error: error.message });
    }
  };