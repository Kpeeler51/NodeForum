import PropTypes from 'prop-types';

const CategoryList = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div className="category-list">
      <h3>Categories</h3>
      <button 
        onClick={() => onSelectCategory(null)}
        className={selectedCategory === null ? 'active' : ''}
      >
        All
      </button>
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
  );
};

CategoryList.propTypes = {
  categories: PropTypes.array.isRequired,
  selectedCategory: PropTypes.string,
  onSelectCategory: PropTypes.func.isRequired,
};

export default CategoryList;