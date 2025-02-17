import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router';
import ReplyModal from '../ReplyModal/ReplyModal';
import storage from '../../utils/storage';
import './ThreadDetail.css';

// ThreadDetail component displays a single thread along with its replies and allows users to reply to the thread.
const ThreadDetail = () => {
  // State declaration for reply text, modal state, user verification and error handling.
  const [thread, setThread] = useState(null);
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState('');
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  // Fetch thread details and replies from the API
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

      // If more than 0 replies exist finds the latest reply and updates the thread's last reply date.
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

  // Format date into easily readable string.
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

// Fetch thread details and set current user on component mount
  useEffect(() => {
    fetchThreadDetails();
    const user = storage.getUser();
    if (user) {
      setCurrentUser(user);
    }
  }, [fetchThreadDetails]);

// Handle reply submission.
  const handleReplySubmit = async (e) => {
    e.preventDefault();

    // Checks if user is logged in before submitting a reply.
    const token = storage.getToken();
    if (!token) {
      setError('You must be logged in to submit a reply.');
      return;
    }
    try {

      // POST request to create a new reply to the thread.
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

      // set the new reply text to an empty string and close the modal.
      setNewReply('');
      setIsReplyModalOpen(false);
      fetchThreadDetails();
    } catch (error) {
      console.error('Error submitting reply:', error);
      setError('Failed to submit reply. Please try again.');
    }
  };

  // Handles thread deletion.
  const handleDeleteThread = async () => {
    if (!window.confirm('Are you sure you want to delete this thread?')) return;

  // checks if user is logged in before deleting the thread.
    const token = storage.getToken();
    if (!token) {
      setError('You must be logged in to delete a thread.');
      return;
    }

  // Fetch the thread id and sends a delete request to the API.
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

      // Navigate to home page upon deletion
      navigate('/');
    } catch (error) {
      console.error('Error deleting thread:', error);
      setError('Failed to delete thread. Please try again.');
    }
  };
  // Handles deletion of replies.
  const handleDeleteReply = async (replyId) => {
    if (!window.confirm('Are you sure you want to delete this reply?')) return;

    // Checks if user is logged in before deleting the reply.
    const token = storage.getToken();
    if (!token) {
      setError('You must be logged in to delete a reply.');
      return;
    }
  
    // Fetch the reply id and sends a delete request to the API.
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

  // Renders loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

    // Render error state
  if (error) {
    return <div>Error: {error}</div>;
  }

   // Render not found state
  if (!thread) {
    return <div>Thread not found.</div>;
  }

  return (
    <section className="thread-detail">
      {/* Thread information */}
      <div className='thread-info'>
        <h2>{thread.title}</h2>
        <p className='thread-description'>{thread.description}</p>
        {/* Thread details: author, category, time created, latest reply date. */}
        <div className='thread-items'>
          <p>Author: {thread.author?.username || 'Unknown'}</p>
          <p>Category: {thread.category?.name || 'Uncategorized'}</p>
          <p>Created: {formatDate(thread.createdAt)}</p>
          {thread.latestReplyDate && (
            <p>Latest Reply: {formatDate(thread.latestReplyDate)}</p>
          )}
          {/* Displays thread deletion button if the current user is the author. */}
          {currentUser && currentUser.userId === thread.author?._id && (
            <button className='thread-delete' onClick={handleDeleteThread}>Delete Thread</button>
          )}
        </div>
      </div>
  
      {/* List of replies */}
      <h3>Replies</h3>
      {/* If there are 0 replies display a placeholder */}
      {replies.length === 0 ? (
        <p>No replies yet.</p>
      ) : (
        // A map of replies with their content, author, and creation date.
        replies.map((reply) => (
          <div key={reply._id} className="reply-item">
            <p>{reply.content}</p>
            <div className='reply-info'>
              <p>By: {reply.author?.username || 'Unknown'}</p>
              <p>Created: {formatDate(reply.createdAt)}</p>
            </div>
            {/* displays reply deletion button if the current user is the author. */}
            {currentUser && currentUser.userId === reply.author?._id && (
              <button className='reply-delete' onClick={() => handleDeleteReply(reply._id)}>Delete Reply</button>
            )}
          </div>
        ))
      )}

      {/* reply button opens the modal */}
      <button className='reply-add' onClick={() => setIsReplyModalOpen(true)}>Add Reply</button>
  
      {/* ReplyModal render and props */}
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
