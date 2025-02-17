// Module Imports
import PropTypes from 'prop-types';
import './CategoryList.css';

// Renders a list of categories, each category is a button to sort the thread list based on category.
const CategoryList = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div className="category-list">
      <h3>Categories</h3>
      <div className="category-buttons">
        {/* ALL button for displaying every category. */}
        <button 
          onClick={() => onSelectCategory(null)}
          className={selectedCategory === null ? 'active' : ''}
        >
          All
        </button>
        {/* maps through the categories and creates a button for each. */}
        {categories.map((category) => (
          <button
            key={category._id}
            onClick={() => onSelectCategory(category._id)}
            className={selectedCategory === category._id ? 'active' : ''}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

// PropTypes validation.
CategoryList.propTypes = {
  categories: PropTypes.array.isRequired,
  selectedCategory: PropTypes.string,
  onSelectCategory: PropTypes.func.isRequired,
};

export default CategoryList;