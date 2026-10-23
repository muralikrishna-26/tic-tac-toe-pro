import Modal from './Modal.jsx';

export default function ConfirmDialog({ open, title, message, confirmLabel = 'Confirm', onConfirm, onCancel }) {
  return (
    <Modal open={open} onClose={onCancel} role="alertdialog" labelledBy="confirm-title" describedBy="confirm-message">
      <h2 id="confirm-title" className="modal-title">{title}</h2>
      <p id="confirm-message" className="modal-text">{message}</p>
      <div className="modal-actions">
        <button type="button" className="btn btn-secondary" data-autofocus onClick={onCancel}>Cancel</button>
        <button type="button" className="btn btn-danger" onClick={onConfirm}>{confirmLabel}</button>
      </div>
    </Modal>
  );
}
