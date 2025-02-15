import PropTypes from 'prop-types';

const ReplyModal = ({ isOpen, onClose, newReply, setNewReply, onSubmit }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Add Reply</h3>
        <form onSubmit={onSubmit}>
          <textarea
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
            placeholder="Write your reply..."
            required
          />
          <button type="submit">Submit Reply</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

ReplyModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  newReply: PropTypes.string.isRequired,
  setNewReply: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default ReplyModal;
