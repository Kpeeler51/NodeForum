import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import './ThreadList.css';

// ThreadList component displays a list of threads, optionally filtered by category
const ThreadList = ({ selectedCategory }) => {
  const [threads, setThreads] = useState([]);

// Fetch threads from the API, optionally filtered by category
  const fetchThreads = useCallback(async () => {
    try {
      // Construct the API URL based on whether a category is selected
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
      // Catch and log any errors that occur during the fetch process,
      console.error('Error fetching threads:', error);
    }
  }, [selectedCategory]);

    // Fetch threads when the component mounts or when the selected category changes
  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  // Format date to a readable string format.
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Render the list of threads
  return (
    <div className="thread-list">
      <h2>Threads</h2>
      {/* Map of threads, containing links to the details of the thread clicked. */}
      {threads.map((thread) => (
        <div key={thread._id} className="thread-item">
          {/* Link to the individual thread based on ID. */}
          <Link to={`/thread/${thread._id}`}>
            <h3>{thread.title}</h3>
          </Link>
          {/* Thread data: category, author, time created, latest reply */}
          <div className='thread-list-info'>
            <p>Category: {thread.category?.name || 'Uncategorized'}</p>
            <p>Author: {thread.author?.username || 'Unknown'}</p>
            <p>Created: {formatDate(thread.createdAt)}</p>
            {thread.latestReplyDate && (
              <p>Latest Reply: {formatDate(thread.latestReplyDate)}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// PropTypes for the ThreadList component
ThreadList.propTypes = {
  selectedCategory: PropTypes.string,
};

export default ThreadList;
