import { useState, useEffect } from 'react';
import { Link } from 'react-router';

const ThreadList = () => {
  const [threads, setThreads] = useState([]);

  useEffect(() => {
    fetchThreads();
  }, []);

  const fetchThreads = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/threads`);
      if (!response.ok) {
        throw new Error('Failed to fetch threads');
      }
      const data = await response.json();
      setThreads(data);
    } catch (error) {
      console.error('Error fetching threads:', error);
    }
  };

  return (
    <div className="thread-list">
      <h2>Threads</h2>
      {threads.map((thread) => (
        <div key={thread._id} className="thread-item">
          <Link to={`/thread/${thread._id}`}>
            <h3>{thread.title}</h3>
          </Link>
          <p>Category: {thread.category}</p>
          <p>Author: {thread.author.username}</p>
        </div>
      ))}
    </div>
  );
};

export default ThreadList;
