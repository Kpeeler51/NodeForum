import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

const ThreadList = ({ selectedCategory }) => {
  const [threads, setThreads] = useState([]);

  const fetchThreads = useCallback(async () => {
    try {
      const url = selectedCategory
        ? `${import.meta.env.VITE_API_URL}/api/threads?category=${selectedCategory}`
        : `${import.meta.env.VITE_API_URL}/api/threads`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch threads');
      }
      const data = await response.json();
      setThreads(data);
    } catch (error) {
      console.error('Error fetching threads:', error);
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  return (
    <div className="thread-list">
      <h2>Threads</h2>
      {threads.map((thread) => (
        <div key={thread._id} className="thread-item">
          <Link to={`/thread/${thread._id}`}>
            <h3>{thread.title}</h3>
          </Link>
          <p>Category: {thread.category.name}</p>
          <p>Author: {thread.author.username}</p>
        </div>
      ))}
    </div>
  );
};

ThreadList.propTypes = {
  selectedCategory: PropTypes.string,
};

export default ThreadList;
