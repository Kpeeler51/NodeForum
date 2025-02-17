import { useState } from 'react';
import { useNavigate } from 'react-router';
import PropTypes from 'prop-types';
import storage from '../../utils/storage';

// Base URL for API requests, fallback to localhost if VITE_API_URL is not set inside of a .env file.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
// CreateThread component renders a modal form for creating a new thread.
// Allows users to input a title, description, and select a category for a new thread.
const CreateThread = ({ onClose, categories, onThreadCreated }) => {
  // State management for form inputs and error handling
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
// Handles submission of form for creating a new thread.
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Throws an error if the user does not have an authentication token.
    setError('');
    try {
      const token = storage.getToken();
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      let categoryId = category;
       // If a new category is being created, send a POST request to create it
      if (category === 'new' && newCategory.trim()) {
        const categoryResponse = await fetch(`${API_BASE_URL}/api/categories`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ name: newCategory.trim() }),
        });

        if (!categoryResponse.ok) {
          const categoryErrorData = await categoryResponse.text();
          console.error('Category creation error response:', categoryErrorData);
          throw new Error('Failed to create or fetch category');
        }

        const categoryData = await categoryResponse.json();
        categoryId = categoryData.category._id;
      }
 // Sends a POST request to create a new thread with the provided title, description, and category.
      const response = await fetch(`${API_BASE_URL}/api/threads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, category: categoryId }),
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Thread creation error response:', errorData);
        throw new Error('Failed to create thread');
      }

      const data = await response.json();
      // Close modal, trigger update, and navigate to the new thread
      onClose();
      onThreadCreated();
      navigate(`/thread/${data._id}`);
    } catch (error) {
      console.error('Error creating thread:', error);
      setError(error.message || 'Failed to create thread. Please try again.');
    }
  };

  return (
    // Modal container.
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Create New Thread</h2>
        {error && <p className="error">{error}</p>}
        {/* Handles submission of thread title, description, and sets the category. */}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Thread Title"
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Thread Description"
            required
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            {/* The user can either select an already existing category or create a new one. */}
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
            <option value="new">Create new category</option>
          </select>
          {category === 'new' && (
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="New Category Name"
              required
            />
          )}
          <div className="button-group">
            <button type="submit">Create Thread</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};
// Props Validation
CreateThread.propTypes = {
  onClose: PropTypes.func.isRequired,
  categories: PropTypes.array.isRequired,
  onThreadCreated: PropTypes.func.isRequired,
};

export default CreateThread;
