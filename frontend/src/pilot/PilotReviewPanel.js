import React, { useState } from 'react';

export default function PilotReviewPanel({
  isOpen,
  onClose,
  selectedParcel,
  selectedBuilding,
  selectedFloor,
  onApprove,
  onEdit,
  onReject
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedHeight, setEditedHeight] = useState(selectedFloor?.height_m || 3.5);
  const [editedUseType, setEditedUseType] = useState(selectedFloor?.use_type || 'Commercial Office Space');
  const [reviewerNotes, setReviewerNotes] = useState('Reviewed against architectural parameters and OpenStreetMap ground footprint.');

  if (!isOpen) return null;

  const handleSaveEdit = () => {
    onEdit({
      height_m: parseFloat(editedHeight),
      use_type: editedUseType,
      notes: reviewerNotes
    });
    setIsEditing(false);
  };

  return (
    <div className="review-modal-overlay" onClick={onClose}>
      <div className="review-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="review-header">
          <div className="title-group">
            <span className="badge-tag">HUMAN-IN-THE-LOOP</span>
            <h3>Cadastral Property Review</h3>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="review-body">
          {/* Target Identity Context */}
          <div className="review-context-card">
            <div className="context-row">
              <span className="ctx-lbl">Base Parcel ID:</span>
              <span className="ctx-val">{selectedParcel?.source_parcel_id} ({selectedParcel?.survey_number})</span>
            </div>
            <div className="context-row">
              <span className="ctx-lbl">Building Structure:</span>
              <span className="ctx-val">{selectedBuilding?.name} ({selectedBuilding?.code})</span>
            </div>
            <div className="context-row">
              <span className="ctx-lbl">Target Vertical Level:</span>
              <span className="ctx-val">{selectedFloor?.name} ({selectedFloor?.code})</span>
            </div>
            <div className="context-row">
              <span className="ctx-lbl">Current Status:</span>
              <span className="ctx-status-pill">{selectedParcel?.status}</span>
            </div>
          </div>

          {/* Reason Flagged */}
          <div className="review-reason-box">
            <div className="reason-title">⚠️ SYSTEM VALIDATION FLAG</div>
            <p className="reason-text">
              {selectedParcel?.review_reason || 'Vertical level boundary was derived from physical height estimation. Ground survey or human sign-off required before authoritative cadastre locking.'}
            </p>
          </div>

          {/* Edit Form (if toggled) */}
          {isEditing ? (
            <div className="review-edit-form">
              <h4>Edit Floor Geometric Attributes</h4>
              <div className="form-group">
                <label>Floor Height (meters):</label>
                <input
                  type="number"
                  step="0.1"
                  value={editedHeight}
                  onChange={(e) => setEditedHeight(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Primary Use Classification:</label>
                <input
                  type="text"
                  value={editedUseType}
                  onChange={(e) => setEditedUseType(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Reviewer Verification Notes:</label>
                <textarea
                  rows="2"
                  value={reviewerNotes}
                  onChange={(e) => setReviewerNotes(e.target.value)}
                />
              </div>
              <div className="form-actions">
                <button className="btn-cancel" onClick={() => setIsEditing(false)}>Cancel</button>
                <button className="btn-save" onClick={handleSaveEdit}>Save & Apply Updates</button>
              </div>
            </div>
          ) : (
            <div className="review-decision-card">
              <h4>Reviewer Decision</h4>
              <p className="hint">
                Approving will elevate the proposed 3D VPID record to <strong>VERIFIED</strong> status in the cadastre workbench and log an immutable audit event.
              </p>

              <div className="action-buttons-grid">
                <button className="btn-action approve" onClick={onApprove}>
                  <span className="btn-icon">✓</span>
                  <div className="btn-text">
                    <span className="btn-title">APPROVE RECORD</span>
                    <span className="btn-sub">Sign off vertical floor boundary</span>
                  </div>
                </button>

                <button className="btn-action edit" onClick={() => setIsEditing(true)}>
                  <span className="btn-icon">✎</span>
                  <div className="btn-text">
                    <span className="btn-title">EDIT PARAMETERS</span>
                    <span className="btn-sub">Adjust height & use classification</span>
                  </div>
                </button>

                <button className="btn-action reject" onClick={onReject}>
                  <span className="btn-icon">✕</span>
                  <div className="btn-text">
                    <span className="btn-title">REJECT INFERENCE</span>
                    <span className="btn-sub">Flag for physical ground survey</span>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
