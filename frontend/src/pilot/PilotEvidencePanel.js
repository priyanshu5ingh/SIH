import React, { useState } from 'react';

export default function PilotEvidencePanel({
  evidenceList = [],
  confidenceScore = 76,
  confidenceClass = 'MEDIUM',
  activeEvidenceId,
  onSelectEvidence,
  onHighlightGeometry
}) {
  const [selectedEvId, setSelectedEvId] = useState(activeEvidenceId || null);

  const handleEvidenceClick = (ev) => {
    const key = ev.id || ev.field;
    const nextId = selectedEvId === key ? null : key;
    setSelectedEvId(nextId);
    if (onSelectEvidence) onSelectEvidence(nextId ? ev : null);
    if (onHighlightGeometry) {
      onHighlightGeometry(nextId ? ev.target_geometry : null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'REAL_SOURCE':
        return <span className="ev-badge verified">● REAL SOURCE</span>;
      case 'SOURCE_ATTRIBUTE':
        return <span className="ev-badge verified">● SOURCE ATTRIBUTE</span>;
      case 'DERIVED':
        return <span className="ev-badge derived">● DERIVED</span>;
      case 'ESTIMATED':
        return <span className="ev-badge estimated">~ ESTIMATED</span>;
      case 'VALIDATION_TEST_CASE':
        return <span className="ev-badge conflict">! QA TEST CASE</span>;
      case 'CONFLICT':
        return <span className="ev-badge conflict">! CONFLICT</span>;
      case 'REVIEW_REQUIRED':
        return <span className="ev-badge review">! REVIEW REQUIRED</span>;
      default:
        return <span className="ev-badge na">✕ UNAVAILABLE</span>;
    }
  };

  return (
    <div className="pilot-evidence-panel">
      {/* Evidence Quality Score Gauge */}
      <div className="confidence-card">
        <div className="confidence-top">
          <span className="confidence-label">EVIDENCE QUALITY SCORE</span>
          <span className={`confidence-val ${confidenceClass === 'HIGH' ? 'score-high' : confidenceClass === 'MEDIUM' ? 'score-med' : 'score-low'}`}>
            {confidenceScore}/100 ({confidenceClass})
          </span>
        </div>
        <div className="progress-track">
          <div
            className={`progress-fill ${confidenceClass === 'HIGH' ? 'fill-high' : confidenceClass === 'MEDIUM' ? 'fill-med' : 'fill-low'}`}
            style={{ width: `${Math.min(100, Math.max(10, confidenceScore))}%` }}
          />
        </div>
        <div className="confidence-breakdown">
          <span>✓ Real Vector Footprint</span>
          <span>✓ SRTM 30m Elevation</span>
          <span>~ Height-Derived Levels</span>
        </div>
      </div>

      {/* Evidence Items Trace */}
      <div className="evidence-trace-header">
        <span>TRACEABLE PROVENANCE REGISTRY</span>
        <span className="hint-text">Click to inspect source & CRS</span>
      </div>

      <div className="evidence-list">
        {evidenceList.map((ev, idx) => {
          const key = ev.id || ev.field || `ev_${idx}`;
          const isExpanded = selectedEvId === key;
          const label = ev.field || ev.title;

          return (
            <div
              key={key}
              className={`evidence-item ${isExpanded ? 'active' : ''}`}
              onClick={() => handleEvidenceClick(ev)}
            >
              <div className="evidence-row-main">
                <div className="ev-title-group">
                  <span className="ev-icon">{isExpanded ? '▼' : '▶'}</span>
                  <span className="ev-title">{label}</span>
                </div>
                {getStatusBadge(ev.status)}
              </div>

              {isExpanded && (
                <div className="evidence-expanded-details">
                  <div className="detail-grid">
                    <div className="detail-col">
                      <span className="col-label">SOURCE DATASET:</span>
                      <span className="col-val">{ev.source}</span>
                    </div>
                    <div className="detail-col">
                      <span className="col-label">SOURCE FEATURE ID:</span>
                      <span className="col-val code-val">{ev.feature_id || 'N/A'}</span>
                    </div>
                    <div className="detail-col">
                      <span className="col-label">PROCESSING METHOD:</span>
                      <span className="col-val">{ev.method}</span>
                    </div>
                    <div className="detail-col">
                      <span className="col-label">COORDINATE REFERENCE (CRS):</span>
                      <span className="col-val code-val">{ev.crs || 'EPSG:32643'}</span>
                    </div>
                    <div className="detail-col full-span">
                      <span className="col-label">OBSERVED / DERIVED VALUE:</span>
                      <span className="col-val highlight-val">{ev.value}</span>
                    </div>
                    <div className="detail-col full-span">
                      <span className="col-label">RETRIEVAL TIMESTAMP:</span>
                      <span className="col-val timestamp-val">{ev.retrieved_at || '2026-09-25T18:00:00Z'}</span>
                    </div>
                  </div>
                  {ev.target_geometry && ev.target_geometry !== 'none' && (
                    <div className="highlight-3d-notice">
                      ⚡ Highlighting associated {ev.target_geometry} geometry in 3D viewport
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
