import { useState } from 'react';
import { useNavigate } from 'react-router';
import PropTypes from 'prop-types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const CreateThread = ({ onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/threads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, category }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create thread');
      }
      
      onClose();
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
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category"
            required
          />
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
};

export default CreateThread;