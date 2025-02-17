import Category from '../models/category.js';

// Controller function to fetch all categories
export const getCategories = async (req, res) => {
  try {
    // Retrieve all categories from the database.
    const categories = await Category.find();
    // Send categories as a json response.
    res.json(categories);
  } catch (error) {
        // If an error occurs, send a 500 status with an error message
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
};

// Controller function to create a new category
export const createCategory = async (req, res) => {
    try {
      // Extract the category name from the request body
      const { name } = req.body;
       // Check if a category with the same name already exists
      let category = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });

      // If the category already exists, return it with a 200 status
      if (category) {
        return res.status(200).json({ message: 'Category already exists', category });
      }

      // If the category doesn't exist, create a new one
      category = new Category({ name });
      await category.save();

      // Send a 201 status with the newly created category
      res.status(201).json({ message: 'Category created successfully', category });
    } catch (error) {
      
      // If an error occurs, send a 500 status with an error message
      res.status(500).json({ message: 'Error creating category', error: error.message });
    }
  };