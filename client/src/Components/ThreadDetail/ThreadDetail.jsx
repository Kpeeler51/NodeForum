import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router';

const ThreadDetail = () => {
  const [thread, setThread] = useState(null);
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  const fetchThreadDetails = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/threads/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch thread details');
      }
      const data = await response.json();
      setThread(data.thread);
      setReplies(data.replies);
    } catch (error) {
      console.error('Error fetching thread details:', error);
      setError('Failed to load thread details. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchThreadDetails();
  }, [fetchThreadDetails]);

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/threads/${id}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newReply }),
      });
      if (!response.ok) {
        throw new Error('Failed to submit reply');
      }
      setNewReply('');
      fetchThreadDetails();
    } catch (error) {
      console.error('Error submitting reply:', error);
      setError('Failed to submit reply. Please try again.');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!thread) {
    return <div>Thread not found.</div>;
  }

  return (
    <div className="thread-detail">
      <h2>{thread.title}</h2>
      <p>{thread.description}</p>
      <p>Category: {thread.category}</p>
      <p>Author: {thread.author.username}</p>

      <h3>Replies</h3>
      {replies.length === 0 ? (
        <p>No replies yet.</p>
      ) : (
        replies.map((reply) => (
          <div key={reply._id} className="reply-item">
            <p>{reply.content}</p>
            <p>By: {reply.author.username}</p>
          </div>
        ))
      )}

      <form onSubmit={handleReplySubmit}>
        <textarea
          value={newReply}
          onChange={(e) => setNewReply(e.target.value)}
          placeholder="Write your reply..."
          required
        />
        <button type="submit">Submit Reply</button>
      </form>
    </div>
  );
};

export default ThreadDetail;
