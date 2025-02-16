import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ThreadList from '../ThreadList/ThreadList';
import CreateThread from '../CreateThread/CreateThread';
import CategoryList from '../CategoryList/CategoryList';
import './Home.css';

const Home = ({ isAuthenticated }) => {
  const [isCreateThreadModalOpen, setIsCreateThreadModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/categories`);
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  return (
    <div className="home">
      <h1>Welcome to the Forum</h1>
      {isAuthenticated && (
        <button onClick={() => setIsCreateThreadModalOpen(true)}>Create New Thread</button>
      )}
      <div className="home-content">
        <div className="category-list-container">
          <CategoryList 
            categories={categories} 
            selectedCategory={selectedCategory} 
            onSelectCategory={setSelectedCategory} 
          />
        </div>
        <div className="thread-list-container">
          <ThreadList selectedCategory={selectedCategory} />
        </div>
      </div>
      {isCreateThreadModalOpen && (
        <CreateThread 
          onClose={() => setIsCreateThreadModalOpen(false)} 
          categories={categories}
          onThreadCreated={fetchCategories}
        />
      )}
    </div>
  );
};

Home.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
};

export default Home;