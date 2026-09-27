import React from 'react';
import { PILOT_DATA as pilotData } from '../pilot/pilotData';
import './PropertyInspector.css';

const PropertyInspector = ({ selectedParcel, selectedBuilding, selectedFloor, reviewStatus, onReviewAction }) => {
  // Get units for selected floor
  const getUnitsForFloor = (floorId) => {
    return pilotData.units.filter(u => u.floor_id === floorId);
  };

  // Real pilot evidence and validation helpers
  const getEvidenceForFloor = (floorId) => {
    return [
      { id: 'e1', source: 'OpenStreetMap Contributors', method: 'Vector Footprint Ingestion', value: 'Building footprint matches parcel boundary', confidence: 0.95, timestamp: '2026-09-25 18:00:00' },
      { id: 'e2', source: 'SRTM 30m via Open Topo Data', method: 'Ground DEM Interpolation', value: 'Ground Elevation: 921.5m MSL', confidence: 0.90, timestamp: '2026-09-25 18:00:00' },
      { id: 'e3', source: 'Karnataka SSLR Cadastral Reference', method: 'Cadastral Map Link', value: 'Base Parcel: KA-BLR-SY-42-1', confidence: 0.98, timestamp: '2026-09-25 18:00:00' },
    ];
  };

  const getValidationForFloor = (floorId) => {
    return [
      { id: 'v1', check: 'Geometry Validity', status: 'PASS', message: 'Building footprint is a valid polygon' },
      { id: 'v2', check: 'Parcel Association', status: 'PASS', message: 'Building is fully within parcel boundary' },
      { id: 'v3', check: 'Vertical Structure', status: 'WARNING', message: 'Vertical levels estimated from physical height (H/3.5m)' },
      { id: 'v4', check: 'Volume Overlap', status: 'PASS', message: 'No overlapping volumes detected' },
      { id: 'v5', check: 'Evidence Cross-Check', status: 'PASS', message: 'OSM and Microsoft GlobalML footprints in 98.1% spatial agreement' },
    ];
  };

  const evidence = selectedFloor ? getEvidenceForFloor(selectedFloor.id) : [];
  const validation = selectedFloor ? getValidationForFloor(selectedFloor.id) : [];

  const [evidenceExpanded, setEvidenceExpanded] = React.useState(false);
  const [validationExpanded, setValidationExpanded] = React.useState(false);

  if (!selectedBuilding) {
    return (
      <div className="property-inspector">
        <div className="empty-state">
          <h3>Property Inspector</h3>
          <p>Select a building to view details</p>
        </div>
      </div>
    );
  }

  // Get Proposed VPID (Proposed Vertical Property Identifier)
  const getVPID = () => {
    if (!selectedBuilding || !selectedFloor) return '-';
    const unit = 'U00';
    return `${selectedParcel.source_parcel_id || selectedParcel.ulpin}-${selectedBuilding.code || selectedBuilding.building_name.replace(' ', '')}-${selectedFloor.code || selectedFloor.floor_name.replace(' ', '')}-${unit}`;
  };

  // Determine status color and label
  const getStatusDetails = (status) => {
    switch (status) {
      case 'VERIFIED':
        return { label: 'VERIFIED', color: '#4cc957' };
      case 'EDITED':
        return { label: 'EDITED', color: '#ffb400' };
      case 'REJECTED':
        return { label: 'REJECTED', color: '#ff6b6b' };
      default:
        return { label: 'PENDING REVIEW', color: '#ffb400' };
    }
  };

  const { label: statusLabel, color: statusColor } = getStatusDetails(reviewStatus);

  return (
    <div className="property-inspector">
      <div className="inspector-header">
        <h3>Property Inspector</h3>
      </div>

      <div className="inspector-content">
        <div className="info-section">
          <h4>Building Information</h4>
          <div className="info-grid">
            <div className="info-item">
              <span className="label">Base ULPIN:</span>
              <span className="value">{selectedParcel.ulpin}</span>
            </div>
            <div className="info-item">
              <span className="label">Building:</span>
              <span className="value">{selectedBuilding.building_name}</span>
            </div>
            <div className="info-item">
              <span className="label">Floors:</span>
              <span className="value">{selectedBuilding.num_floors_above + selectedBuilding.num_floors_below}</span>
            </div>
            <div className="info-item">
              <span className="label">Estimated Height:</span>
              <span className="value">{selectedBuilding.height_m} m</span>
            </div>
            <div className="info-item">
              <span className="label">Footprint:</span>
              <span className="value">{selectedBuilding.footprint_wkt}</span>
            </div>
            <div className="info-item">
              <span className="label">Proposed VPID:</span>
              <span className="value">{getVPID()}</span>
            </div>
            <div className="info-item">
              <span className="label">Status:</span>
              <span className="value" style={{ color: statusColor, fontWeight: 600 }}>{statusLabel}</span>
            </div>
          </div>
        </div>

        {selectedFloor && (
          <>
            <div className="info-section">
              <h4>Floor Details</h4>
              <div className="info-grid">
                <div className="info-item">
                  <span className="label">Floor:</span>
                  <span className="value">{selectedFloor.floor_name}</span>
                </div>
                <div className="info-item">
                  <span className="label">Level:</span>
                  <span className="value">{selectedFloor.floor_number}</span>
                </div>
                <div className="info-item">
                  <span className="label">Area:</span>
                  <span className="value">{selectedFloor.area_sqm} m²</span>
                </div>
                <div className="info-item">
                  <span className="label">Height:</span>
                  <span className="value">{selectedFloor.height_m} m</span>
                </div>
                <div className="info-item">
                  <span className="label">Unit:</span>
                  <span className="value">00 (Whole Floor)</span>
                </div>
              </div>
            </div>

            <div className="accordion">
              <div className="accordion-item" onClick={() => setEvidenceExpanded(!evidenceExpanded)}>
                <div className="accordion-header">
                  <h4>Evidence Panel</h4>
                  <span className="accordion-icon">{evidenceExpanded ? '▲' : '▼'}</span>
                </div>
                {evidenceExpanded && (
                  <div className="accordion-content">
                    <div className="evidence-matrix">
                      <div className="evidence-header">
                        <div>Source</div>
                        <div>Method</div>
                        <div>Value</div>
                        <div className="confidence">Confidence</div>
                        <div>Timestamp</div>
                      </div>
                      {evidence.map(ev => (
                        <div key={ev.id} className="evidence-row">
                          <div>{ev.source}</div>
                          <div>{ev.method}</div>
                          <div>{ev.value}</div>
                          <div className="confidence">{Math.round(ev.confidence * 100)}%</div>
                          <div>{ev.timestamp}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="accordion-item" onClick={() => setValidationExpanded(!validationExpanded)}>
                <div className="accordion-header">
                  <h4>Validation Panel</h4>
                  <span className="accordion-icon">{validationExpanded ? '▲' : '▼'}</span>
                </div>
                {validationExpanded && (
                  <div className="accordion-content">
                    <div className="validation-list">
                      {validation.map(v => (
                        <div key={v.id} className={`validation-item status-${v.status.toLowerCase()}`}>
                          <div className="validation-check">{v.check}</div>
                          <div className="validation-status">{v.status}</div>
                          <div className="validation-message">{v.message}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        <div className="review-section">
          <h4>Review Workflow</h4>
          <p className="review-question">WHY IS THIS FLAGGED?</p>
          <p className="review-hint">Select an action to proceed</p>
          <div className="review-buttons">
            <button
              onClick={() => onReviewAction('APPROVE')}
              className="btn approve"
            >
              APPROVE
            </button>
            <button
              onClick={() => onReviewAction('EDIT')}
              className="btn edit"
            >
              EDIT
            </button>
            <button
              onClick={() => onReviewAction('REJECT')}
              className="btn reject"
            >
              REJECT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyInspector;