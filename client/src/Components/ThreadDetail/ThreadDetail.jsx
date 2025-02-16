import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router';
import ReplyModal from '../ReplyModal/ReplyModal';
import storage from '../../utils/storage';
import './ThreadDetail.css';

const ThreadDetail = () => {
  const [thread, setThread] = useState(null);
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState('');
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

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

      if (data.replies.length > 0) {
        const latestReply = data.replies.reduce((latest, reply) => 
          new Date(reply.createdAt) > new Date(latest.createdAt) ? reply : latest
        );
        setThread(prevThread => ({
          ...prevThread,
          latestReplyDate: latestReply.createdAt
        }));
      }
    } catch (error) {
      console.error('Error fetching thread details:', error);
      setError('Failed to load thread details. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    fetchThreadDetails();
    const user = storage.getUser();
    if (user) {
      setCurrentUser(user);
    }
  }, [fetchThreadDetails]);

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    const token = storage.getToken();
    if (!token) {
      setError('You must be logged in to submit a reply.');
      return;
    }
    try {
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
      setIsReplyModalOpen(false);
      fetchThreadDetails();
    } catch (error) {
      console.error('Error submitting reply:', error);
      setError('Failed to submit reply. Please try again.');
    }
  };

  const handleDeleteThread = async () => {
    if (!window.confirm('Are you sure you want to delete this thread?')) return;
  
    const token = storage.getToken();
    if (!token) {
      setError('You must be logged in to delete a thread.');
      return;
    }
  
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/threads/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete thread');
      }
      navigate('/');
    } catch (error) {
      console.error('Error deleting thread:', error);
      setError('Failed to delete thread. Please try again.');
    }
  };

  const handleDeleteReply = async (replyId) => {
    if (!window.confirm('Are you sure you want to delete this reply?')) return;
  
    const token = storage.getToken();
    if (!token) {
      setError('You must be logged in to delete a reply.');
      return;
    }
  
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/threads/replies/${replyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete reply');
      }
      fetchThreadDetails();
    } catch (error) {
      console.error('Error deleting reply:', error);
      setError('Failed to delete reply. Please try again.');
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
    <section className="thread-detail">
      <div className='thread-info'>
        <h2>{thread.title}</h2>
        <p className='thread-description'>{thread.description}</p>
        <div className='thread-items'>
          <p>Author: {thread.author.username}</p>
          <p>Category: {thread.category.name || 'Uncategorized'}</p>
          <p>Created: {formatDate(thread.createdAt)}</p>
          {thread.latestReplyDate && (
            <p>Latest Reply: {formatDate(thread.latestReplyDate)}</p>
          )}
          {currentUser && currentUser.userId === thread.author._id && (
            <button className='thread-delete' onClick={handleDeleteThread}>Delete Thread</button>
          )}
        </div>
      </div>
  
      <h3>Replies</h3>
      {replies.length === 0 ? (
        <p>No replies yet.</p>
      ) : (
        replies.map((reply) => (
          <div key={reply._id} className="reply-item">
            <p>{reply.content}</p>
            <div className='reply-info'>
              <p>By: {reply.author.username}</p>
              <p>Created: {formatDate(reply.createdAt)}</p>
            </div>
            {currentUser && currentUser.userId === reply.author._id && (
              <button className='reply-delete' onClick={() => handleDeleteReply(reply._id)}>Delete Reply</button>
            )}
          </div>
        ))
      )}
  
      <button className='reply-add' onClick={() => setIsReplyModalOpen(true)}>Add Reply</button>
  
      <ReplyModal
        isOpen={isReplyModalOpen}
        onClose={() => setIsReplyModalOpen(false)}
        newReply={newReply}
        setNewReply={setNewReply}
        onSubmit={handleReplySubmit}
      />
    </section>
  );
};

export default ThreadDetail;
