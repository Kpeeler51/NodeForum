import PropTypes from 'prop-types';

// Renders a reply modal containing a form for adding a reply.
const ReplyModal = ({ isOpen, onClose, newReply, setNewReply, onSubmit }) => {
  // If the modal is not open, return null to avoid rendering the modal.
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Add Reply</h3>
        <form onSubmit={onSubmit}>
          {/* Textarea for writing reply */}
          <textarea
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
            placeholder="Write your reply..."
            required
          />
          {/* Button group for submit and cancel button */}
          <div className="button-group">
            <button type="submit">Submit Reply</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// PropTypes validation for the ReplyModal component
ReplyModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  newReply: PropTypes.string.isRequired,
  setNewReply: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default ReplyModal;
