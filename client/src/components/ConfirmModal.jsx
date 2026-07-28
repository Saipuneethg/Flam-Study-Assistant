import React from 'react';

export function ConfirmModal({ isOpen, message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay animate-fade-in">
      <div className="modal-content">
        <h3 className="modal-title">Confirm Action</h3>
        <p className="modal-message">{message}</p>
        <div className="modal-actions">
          <button className="modal-btn cancel-btn" onClick={onCancel}>
            Cancel
          </button>
          <button className="modal-btn confirm-btn" onClick={onConfirm}>
            Discard
          </button>
        </div>
      </div>
    </div>
  );
}
