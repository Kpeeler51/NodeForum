import { useState } from 'react';
import { useNavigate } from 'react-router';
import PropTypes from 'prop-types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const CreateThread = ({ onClose, categories, onThreadCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const token = localStorage.getItem('token');
      let categoryId = category;
  
      // If "Create new category" is selected and a new category name is provided
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
          throw new Error('Failed to create or fetch category');
        }
  
        const categoryData = await categoryResponse.json();
        categoryId = categoryData.category._id;
      }
  
      const response = await fetch(`${API_BASE_URL}/api/threads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, category: categoryId }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create thread');
      }
      
      onClose();
      onThreadCreated();
      navigate(`/thread/${data._id}`);
    } catch (error) {
      console.error('Error creating thread:', error);
      setError(error.message || 'Failed to create thread. Please try again.');
    }
  };

  return (
    <div className="create-thread-modal">
      <div className="modal-content">
        <h2>Create New Thread</h2>
        {error && <p className="error">{error}</p>}
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

CreateThread.propTypes = {
  onClose: PropTypes.func.isRequired,
  categories: PropTypes.array.isRequired,
  onThreadCreated: PropTypes.func.isRequired,
};

export default CreateThread;
