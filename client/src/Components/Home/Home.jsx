import { useState } from 'react';
import PropTypes from 'prop-types';
import ThreadList from '../ThreadList/ThreadList';
import CreateThread from '../CreateThread/CreateThread';

const Home = ({ isAuthenticated }) => {
  const [isCreateThreadModalOpen, setIsCreateThreadModalOpen] = useState(false);

  return (
    <div className="home">
      <h1>Welcome to the Forum</h1>
      {isAuthenticated && (
        <button onClick={() => setIsCreateThreadModalOpen(true)}>Create New Thread</button>
      )}
      <ThreadList />
      {isCreateThreadModalOpen && (
        <CreateThread onClose={() => setIsCreateThreadModalOpen(false)} />
      )}
    </div>
  );
};

Home.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
};

export default Home;