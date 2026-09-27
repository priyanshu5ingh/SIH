import React from 'react';

export default function PilotValidationPanel({
  validations = [],
  viewMode,
  onToggleValidationMode,
  onHighlightGeometry
}) {
  const isValidation3DActive = viewMode === 'VALIDATION';

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PASS':
        return <span className="val-icon pass">✓</span>;
      case 'WARNING':
        return <span className="val-icon warning">!</span>;
      case 'REVIEW':
        return <span className="val-icon review">!</span>;
      case 'CONFLICT':
        return <span className="val-icon conflict">✕</span>;
      default:
        return <span className="val-icon">?</span>;
    }
  };

  return (
    <div className="pilot-validation-panel">
      {/* 3D Mode Quick Toggle */}
      <div className="validation-mode-toggle-card">
        <div className="toggle-text">
          <span className="mode-name">3D TOPOLOGY OVERLAY</span>
          <span className="mode-desc">Visually isolate geometric overlaps & envelope boundaries</span>
        </div>
        <button
          className={`toggle-btn ${isValidation3DActive ? 'active' : ''}`}
          onClick={onToggleValidationMode}
        >
          {isValidation3DActive ? 'ACTIVE' : 'ENABLE'}
        </button>
      </div>

      <div className="validation-rules-header">
        <span>DETERMINISTIC TOPOLOGICAL CHECKS (10 EXECUTABLE RULES)</span>
      </div>

      <div className="validation-list">
        {validations.map((v, idx) => {
          const isConflict = v.status === 'CONFLICT';
          return (
            <div
              key={v.rule_id || v.id || `val_${idx}`}
              className={`val-item status-${(v.status || 'pass').toLowerCase()}`}
              onClick={() => {
                if (onHighlightGeometry) {
                  onHighlightGeometry(isConflict ? 'conflict_zone' : 'building');
                }
              }}
            >
              <div className="val-row-top">
                <div className="val-name-group">
                  {getStatusIcon(v.status)}
                  <span className="val-name">{v.name}</span>
                </div>
                <span className={`val-status-tag ${(v.status || 'pass').toLowerCase()}`}>{v.status}</span>
              </div>
              <div className="val-message">{v.message}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
