import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ThreadList from '../ThreadList/ThreadList';
import CreateThread from '../CreateThread/CreateThread';
import CategoryList from '../CategoryList/CategoryList';
import './Home.css';

// Main page of the application. Displays a list of categories and threads.
// provides functionality to create new threads and select categories.
const Home = ({ isAuthenticated }) => {
  // States for opening thread modal and selecting categories.
  const [isCreateThreadModalOpen, setIsCreateThreadModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);

  // Fetch categories when the component mounts.
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetches a list of categories from the API
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
    <main className="home">
      <h1>Welcome to Book Forum!</h1>
      {/* Create thread button only rendered for authenticated users. */}
      {isAuthenticated && (
        <button onClick={() => setIsCreateThreadModalOpen(true)}>Create New Thread</button>
      )}
      <div className="home-content">
        {/* Category List Sidebar displays categories. */}
        <div className="category-list-container">
          <CategoryList 
            categories={categories} 
            selectedCategory={selectedCategory} 
            onSelectCategory={setSelectedCategory} 
          />
        </div>
        {/* Thread list container displays a list of threads. */}
        <div className="thread-list-container">
          <ThreadList selectedCategory={selectedCategory} />
        </div>
      </div>
      {/* Renders create thread modal when CreateTreadModalOpen is true */}
      {isCreateThreadModalOpen && (
        <CreateThread 
          onClose={() => setIsCreateThreadModalOpen(false)} 
          categories={categories}
          onThreadCreated={fetchCategories}
        />
      )}
    </main>
  );
};

// PropTypes for Home component.
Home.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
};

export default Home;